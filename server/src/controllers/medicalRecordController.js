const prisma = require('../config/db');

// GET /api/medical-records
exports.getAllMedicalRecords = async (req, res, next) => {
  try {
    const { patientId, search } = req.query;

    const where = {};

    if (req.user.role === 'PATIENT') {
      if (!req.user.patient) {
        return res.status(400).json({ success: false, message: 'Patient profile not found.' });
      }
      where.patientId = req.user.patient.id;
    } else if (patientId) {
      where.patientId = parseInt(patientId);
    }

    if (search) {
      where.OR = [
        { recordNumber: { contains: search } },
        { diagnosis: { contains: search } },
        { treatment: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
        { doctor: { user: { name: { contains: search } } } }
      ];
    }

    const records = await prisma.medicalRecord.findMany({
      where,
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatar: true } }
          }
        },
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
            department: true
          }
        },
        appointment: true
      },
      orderBy: { visitDate: 'desc' }
    });

    return res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/medical-records/:id
exports.getMedicalRecordById = async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id);

    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatar: true } }
          }
        },
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
            department: true
          }
        },
        appointment: true
      }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found.'
      });
    }

    // Role check
    if (req.user.role === 'PATIENT' && req.user.patient && record.patientId !== req.user.patient.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own medical records.'
      });
    }

    return res.json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/medical-records (Admin / Doctor only)
exports.createMedicalRecord = async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentId, diagnosis, treatment, symptoms, notes, vitals } = req.body;

    if (!patientId || !doctorId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Patient, Doctor, and Diagnosis are required fields.'
      });
    }

    const recordNumber = `MED-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord = await prisma.medicalRecord.create({
      data: {
        recordNumber,
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        visitDate: new Date(),
        diagnosis: diagnosis.trim(),
        treatment: treatment ? treatment.trim() : null,
        symptoms: symptoms ? symptoms.trim() : null,
        notes: notes ? notes.trim() : null,
        vitalsJson: vitals ? JSON.stringify(vitals) : null
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, department: true } },
        appointment: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Medical record documented successfully.',
      record: newRecord
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/medical-records/:id (Admin only)
exports.updateMedicalRecord = async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id);
    const { diagnosis, treatment, symptoms, notes, vitals } = req.body;

    const updated = await prisma.medicalRecord.update({
      where: { id: recordId },
      data: {
        diagnosis: diagnosis !== undefined ? diagnosis.trim() : undefined,
        treatment: treatment !== undefined ? treatment.trim() : undefined,
        symptoms: symptoms !== undefined ? symptoms.trim() : undefined,
        notes: notes !== undefined ? notes.trim() : undefined,
        vitalsJson: vitals !== undefined ? JSON.stringify(vitals) : undefined
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, department: true } },
        appointment: true
      }
    });

    return res.json({
      success: true,
      message: 'Medical record updated successfully.',
      record: updated
    });
  } catch (error) {
    next(error);
  }
};
