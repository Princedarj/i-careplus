const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

// GET /api/doctors (Public & Authenticated)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const { departmentId, search, status } = req.query;

    const where = {};

    if (departmentId && departmentId !== 'all') {
      where.departmentId = parseInt(departmentId);
    }

    if (status) {
      where.status = status;
    } else {
      // By default show active doctors unless admin specifies
      if (!req.user || req.user.role !== 'ADMIN') {
        where.status = 'ACTIVE';
      }
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { specialization: { contains: search } },
        { qualification: { contains: search } }
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            status: true
          }
        },
        department: true,
        availabilities: true,
        _count: {
          select: {
            appointments: true
          }
        }
      },
      orderBy: { experience: 'desc' }
    });

    return res.json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/:id
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctorId = parseInt(req.params.id);

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            status: true
          }
        },
        department: true,
        availabilities: true,
        appointments: {
          where: {
            appointmentDate: { gte: new Date() }
          },
          select: {
            appointmentDate: true,
            timeSlot: true,
            status: true
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    return res.json({
      success: true,
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/doctors (Admin only)
exports.createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      departmentId,
      qualification,
      specialization,
      experience,
      consultationFee,
      workingDays,
      workingHours,
      roomNumber,
      bio,
      password
    } = req.body;

    if (!name || !email || !departmentId || !qualification || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, department, qualification, and specialization are required.'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const doctorPassword = password || 'Doctor@123';
    const hashedPassword = await bcrypt.hash(doctorPassword, 10);
    const avatar = `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80`;

    const newDoctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'DOCTOR',
          phone: phone ? phone.trim() : null,
          avatar,
          status: 'ACTIVE'
        }
      });

      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          departmentId: parseInt(departmentId),
          qualification: qualification.trim(),
          specialization: specialization.trim(),
          experience: parseInt(experience) || 1,
          consultationFee: parseFloat(consultationFee) || 50.00,
          workingDays: workingDays || 'Mon,Tue,Wed,Thu,Fri',
          workingHours: workingHours || '09:00 AM - 05:00 PM',
          roomNumber: roomNumber ? roomNumber.trim() : null,
          bio: bio ? bio.trim() : null,
          status: 'ACTIVE'
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, avatar: true, status: true }
          },
          department: true
        }
      });

      // Default availability slots
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (const day of days) {
        await tx.doctorAvailability.create({
          data: {
            doctorId: doctor.id,
            dayOfWeek: day,
            startTime: '09:00 AM',
            endTime: '05:00 PM',
            slotDurationMinutes: 30,
            isAvailable: true
          }
        });
      }

      return doctor;
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor created and credentialed successfully.',
      doctor: newDoctor
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/doctors/:id (Admin only)
exports.updateDoctor = async (req, res, next) => {
  try {
    const doctorId = parseInt(req.params.id);
    const {
      name,
      phone,
      departmentId,
      qualification,
      specialization,
      experience,
      consultationFee,
      workingDays,
      workingHours,
      roomNumber,
      bio,
      status
    } = req.body;

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    if (name || phone || status) {
      await prisma.user.update({
        where: { id: existingDoctor.userId },
        data: {
          name: name ? name.trim() : undefined,
          phone: phone ? phone.trim() : undefined,
          status: status || undefined
        }
      });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        departmentId: departmentId ? parseInt(departmentId) : undefined,
        qualification: qualification ? qualification.trim() : undefined,
        specialization: specialization ? specialization.trim() : undefined,
        experience: experience !== undefined ? parseInt(experience) : undefined,
        consultationFee: consultationFee !== undefined ? parseFloat(consultationFee) : undefined,
        workingDays: workingDays !== undefined ? workingDays : undefined,
        workingHours: workingHours !== undefined ? workingHours : undefined,
        roomNumber: roomNumber !== undefined ? roomNumber : undefined,
        bio: bio !== undefined ? bio : undefined,
        status: status || undefined
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true, status: true }
        },
        department: true
      }
    });

    return res.json({
      success: true,
      message: 'Doctor record updated successfully.',
      doctor: updatedDoctor
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/doctors/:id (Admin only)
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctorId = parseInt(req.params.id);

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { _count: { select: { appointments: true } } }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    // Toggle status to INACTIVE for safe archiving
    await prisma.doctor.update({
      where: { id: doctorId },
      data: { status: 'INACTIVE' }
    });

    await prisma.user.update({
      where: { id: doctor.userId },
      data: { status: 'INACTIVE' }
    });

    return res.json({
      success: true,
      message: 'Doctor account deactivated successfully.'
    });
  } catch (error) {
    next(error);
  }
};
