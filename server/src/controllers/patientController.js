const prisma = require('../config/db');

// GET /api/patients (Admin only)
exports.getAllPatients = async (req, res, next) => {
  try {
    const { search, gender, bloodGroup, status } = req.query;

    const where = {};

    if (search) {
      where.user = {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } }
        ]
      };
    }

    if (gender) {
      where.gender = gender;
    }

    if (bloodGroup) {
      where.bloodGroup = bloodGroup;
    }

    if (status) {
      where.user = {
        ...where.user,
        status: status
      };
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            status: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            appointments: true,
            medicalRecords: true,
            prescriptions: true,
            invoices: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/:id
exports.getPatientById = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.id);

    // If patient role, check ownership
    if (req.user.role === 'PATIENT' && (!req.user.patient || req.user.patient.id !== patientId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own patient file.'
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            status: true,
            createdAt: true
          }
        },
        appointments: {
          include: {
            doctor: { include: { user: true, department: true } },
            department: true
          },
          orderBy: { appointmentDate: 'desc' },
          take: 10
        },
        medicalRecords: {
          include: {
            doctor: { include: { user: true } }
          },
          orderBy: { visitDate: 'desc' }
        },
        prescriptions: {
          include: {
            doctor: { include: { user: true } },
            medicines: true
          },
          orderBy: { issuedDate: 'desc' }
        },
        invoices: {
          include: { payments: true },
          orderBy: { issueDate: 'desc' }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    return res.json({
      success: true,
      patient
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/patients/:id
exports.updatePatient = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.id);

    // Role check
    if (req.user.role === 'PATIENT' && (!req.user.patient || req.user.patient.id !== patientId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own details.'
      });
    }

    const { name, phone, dob, gender, bloodGroup, address, emergencyContact, medicalHistory, allergies, status } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found.'
      });
    }

    await prisma.user.update({
      where: { id: patient.userId },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        phone: phone !== undefined ? phone.trim() : undefined,
        status: (req.user.role === 'ADMIN' && status) ? status : undefined
      }
    });

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        dob: dob ? new Date(dob) : undefined,
        gender: gender !== undefined ? gender : undefined,
        bloodGroup: bloodGroup !== undefined ? bloodGroup : undefined,
        address: address !== undefined ? address : undefined,
        emergencyContact: emergencyContact !== undefined ? emergencyContact : undefined,
        medicalHistory: medicalHistory !== undefined ? medicalHistory : undefined,
        allergies: allergies !== undefined ? allergies : undefined
      },
      include: {
        user: true
      }
    });

    return res.json({
      success: true,
      message: 'Patient profile updated successfully.',
      patient: updatedPatient
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/patients/:id (Admin only)
exports.deletePatient = async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.id);

    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    // Soft toggle or safe delete
    await prisma.user.update({
      where: { id: patient.userId },
      data: { status: 'INACTIVE' }
    });

    return res.json({
      success: true,
      message: 'Patient account marked as inactive successfully.'
    });
  } catch (error) {
    next(error);
  }
};
