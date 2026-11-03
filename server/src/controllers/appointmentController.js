const prisma = require('../config/db');

// GET /api/appointments
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, doctorId, departmentId, date, search } = req.query;

    const where = {};

    // Patient can only see their own appointments
    if (req.user.role === 'PATIENT') {
      if (!req.user.patient) {
        return res.status(400).json({ success: false, message: 'Patient profile not found.' });
      }
      where.patientId = req.user.patient.id;
    } else if (req.user.role === 'DOCTOR' && req.user.doctor) {
      where.doctorId = req.user.doctor.id;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (doctorId && doctorId !== 'ALL') {
      where.doctorId = parseInt(doctorId);
    }

    if (departmentId && departmentId !== 'ALL') {
      where.departmentId = parseInt(departmentId);
    }

    if (date) {
      const selected = new Date(date);
      const startOfDay = new Date(selected.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selected.setHours(23, 59, 59, 999));
      where.appointmentDate = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    if (search) {
      where.OR = [
        { appointmentNumber: { contains: search } },
        { reason: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
        { doctor: { user: { name: { contains: search } } } }
      ];
    }

    const appointments = await prisma.appointment.findMany({
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
        department: true,
        invoice: true,
        medicalRecord: true,
        prescriptions: true
      },
      orderBy: { appointmentDate: 'desc' }
    });

    return res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/appointments/:id
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointmentId = parseInt(req.params.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
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
        department: true,
        invoice: {
          include: { payments: true }
        },
        medicalRecord: true,
        prescriptions: {
          include: { medicines: true }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Role check
    if (req.user.role === 'PATIENT' && req.user.patient && appointment.patientId !== req.user.patient.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this appointment.'
      });
    }

    return res.json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/appointments
exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason, patientId: inputPatientId } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, appointment date, and time slot are required.'
      });
    }

    // Determine target patient
    let patientId;
    if (req.user.role === 'PATIENT') {
      if (!req.user.patient) {
        return res.status(400).json({ success: false, message: 'Patient profile not found.' });
      }
      patientId = req.user.patient.id;
    } else {
      if (!inputPatientId) {
        return res.status(400).json({ success: false, message: 'Please specify the patient ID.' });
      }
      patientId = parseInt(inputPatientId);
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
      include: { department: true, user: true }
    });

    if (!doctor || doctor.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor is not available for appointments.'
      });
    }

    // Check slot collision on the given date
    const dateObj = new Date(appointmentDate);
    const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0);
    const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59);

    const existingSlot = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        timeSlot: timeSlot.trim(),
        status: { not: 'CANCELLED' }
      }
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: `The ${timeSlot} slot on ${startOfDay.toLocaleDateString()} is already reserved. Please select another time slot.`
      });
    }

    const aptNumber = `APT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.create({
        data: {
          appointmentNumber: aptNumber,
          patientId,
          doctorId: doctor.id,
          departmentId: doctor.departmentId,
          appointmentDate: dateObj,
          timeSlot: timeSlot.trim(),
          reason: reason ? reason.trim() : 'General Medical Consultation',
          status: 'PENDING'
        },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true, department: true } },
          department: true
        }
      });

      // Automatically generate a medical invoice for this consultation
      const invNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      const consultationFee = Number(doctor.consultationFee) || 50;

      await tx.invoice.create({
        data: {
          invoiceNumber: invNumber,
          patientId,
          appointmentId: appt.id,
          title: `Consultation - ${doctor.user.name} (${doctor.department.name})`,
          description: `Outpatient consultation booking on ${dateObj.toLocaleDateString()} at ${timeSlot}.`,
          issueDate: new Date(),
          dueDate: new Date(dateObj.getTime() + 86400000 * 3),
          totalAmount: consultationFee,
          paidAmount: 0.00,
          balance: consultationFee,
          status: 'PENDING'
        }
      });

      // Add notification for patient
      const patient = await tx.patient.findUnique({ where: { id: patientId } });
      if (patient) {
        await tx.notification.create({
          data: {
            userId: patient.userId,
            title: 'Appointment Request Submitted',
            message: `Your appointment request (${aptNumber}) with ${doctor.user.name} for ${dateObj.toLocaleDateString()} at ${timeSlot} has been placed.`,
            type: 'APPOINTMENT'
          }
        });
      }

      return appt;
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment: newAppointment
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/appointments/:id/status
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const { status, notes } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be PENDING, CONFIRMED, COMPLETED, or CANCELLED.'
      });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } }
      }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Role check: Only admin or doctor can mark CONFIRMED/COMPLETED
    if (req.user.role === 'PATIENT') {
      if (status !== 'CANCELLED') {
        return res.status(403).json({
          success: false,
          message: 'Patients can only cancel appointments.'
        });
      }
      if (appointment.patientId !== req.user.patient.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.'
        });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        notes: notes !== undefined ? notes : appointment.notes
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, department: true } },
        department: true
      }
    });

    // Notify patient
    await prisma.notification.create({
      data: {
        userId: appointment.patient.userId,
        title: `Appointment Status: ${status}`,
        message: `Your appointment with ${appointment.doctor.user.name} on ${new Date(appointment.appointmentDate).toLocaleDateString()} has been marked as ${status}.`,
        type: 'APPOINTMENT'
      }
    });

    return res.json({
      success: true,
      message: `Appointment successfully updated to ${status}.`,
      appointment: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/appointments/:id (Admin delete or Cancel)
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointmentId = parseInt(req.params.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Patient can cancel
    if (req.user.role === 'PATIENT') {
      if (appointment.patientId !== req.user.patient.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied.'
        });
      }

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' }
      });

      return res.json({
        success: true,
        message: 'Appointment cancelled successfully.'
      });
    }

    // Admin can delete
    await prisma.appointment.delete({
      where: { id: appointmentId }
    });

    return res.json({
      success: true,
      message: 'Appointment removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
