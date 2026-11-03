const prisma = require('../config/db');

// GET /api/prescriptions
exports.getAllPrescriptions = async (req, res, next) => {
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
        { prescriptionNumber: { contains: search } },
        { diagnosis: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
        { doctor: { user: { name: { contains: search } } } }
      ];
    }

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            department: true
          }
        },
        medicines: true,
        appointment: true
      },
      orderBy: { issuedDate: 'desc' }
    });

    return res.json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/prescriptions/:id
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescriptionId = parseInt(req.params.id);

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            department: true
          }
        },
        medicines: true,
        appointment: true
      }
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found.'
      });
    }

    // Ownership check
    if (req.user.role === 'PATIENT' && req.user.patient && prescription.patientId !== req.user.patient.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own prescriptions.'
      });
    }

    return res.json({
      success: true,
      prescription
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/prescriptions (Admin / Doctor)
exports.createPrescription = async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentId, diagnosis, notes, medicines } = req.body;

    if (!patientId || !doctorId || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Patient, Doctor, and at least one medicine entry are required.'
      });
    }

    const prescriptionNumber = `RX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPrescription = await prisma.$transaction(async (tx) => {
      const rx = await tx.prescription.create({
        data: {
          prescriptionNumber,
          patientId: parseInt(patientId),
          doctorId: parseInt(doctorId),
          appointmentId: appointmentId ? parseInt(appointmentId) : null,
          diagnosis: diagnosis ? diagnosis.trim() : null,
          notes: notes ? notes.trim() : null,
          issuedDate: new Date()
        }
      });

      for (const med of medicines) {
        if (med.medicineName && med.dosage) {
          await tx.prescriptionMedicine.create({
            data: {
              prescriptionId: rx.id,
              medicineName: med.medicineName.trim(),
              dosage: med.dosage.trim(),
              frequency: med.frequency ? med.frequency.trim() : 'Once daily',
              duration: med.duration ? med.duration.trim() : '5 days',
              instructions: med.instructions ? med.instructions.trim() : 'As directed by physician'
            }
          });
        }
      }

      return tx.prescription.findUnique({
        where: { id: rx.id },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true, department: true } },
          medicines: true
        }
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription issued successfully.',
      prescription: newPrescription
    });
  } catch (error) {
    next(error);
  }
};
