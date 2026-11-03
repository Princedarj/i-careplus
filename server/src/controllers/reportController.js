const prisma = require('../config/db');

// GET /api/reports/appointments (Admin only)
exports.getAppointmentReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.appointmentDate = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59))
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, department: true } },
        department: true
      },
      orderBy: { appointmentDate: 'desc' }
    });

    const statusBreakdown = {
      TOTAL: appointments.length,
      CONFIRMED: appointments.filter(a => a.status === 'CONFIRMED').length,
      COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
      PENDING: appointments.filter(a => a.status === 'PENDING').length,
      CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length
    };

    // Doctor workload breakdown
    const doctorStats = {};
    appointments.forEach(a => {
      const docName = a.doctor.user.name;
      if (!doctorStats[docName]) {
        doctorStats[docName] = {
          doctorName: docName,
          department: a.department.name,
          totalAppointments: 0,
          completed: 0,
          pending: 0
        };
      }
      doctorStats[docName].totalAppointments++;
      if (a.status === 'COMPLETED') doctorStats[docName].completed++;
      if (a.status === 'PENDING') doctorStats[docName].pending++;
    });

    return res.json({
      success: true,
      statusBreakdown,
      doctorPerformance: Object.values(doctorStats),
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/revenue (Admin only)
exports.getRevenueReport = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        payments: true,
        patient: { include: { user: true } },
        appointment: { include: { department: true } }
      },
      orderBy: { issueDate: 'desc' }
    });

    const totalBilled = invoices.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + Number(curr.paidAmount || curr.totalAmount), 0);
    const totalOutstanding = invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + Number(curr.balance || curr.totalAmount), 0);

    // Group by payment method
    const paymentMethods = {
      ONLINE: 0,
      CARD: 0,
      INSURANCE: 0,
      CASH: 0
    };

    invoices.forEach(inv => {
      if (inv.status === 'PAID' && inv.paymentMethod) {
        const method = inv.paymentMethod.toUpperCase();
        if (paymentMethods[method] !== undefined) {
          paymentMethods[method] += Number(inv.totalAmount);
        } else {
          paymentMethods.ONLINE += Number(inv.totalAmount);
        }
      }
    });

    return res.json({
      success: true,
      summary: {
        totalBilled,
        totalCollected,
        totalOutstanding,
        collectionRate: totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : 0
      },
      paymentMethodsBreakdown: paymentMethods,
      invoices
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/patients (Admin only)
exports.getPatientReport = async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: true,
        _count: {
          select: { appointments: true, medicalRecords: true, prescriptions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const genderStats = { Male: 0, Female: 0, Other: 0 };
    const bloodGroupStats = {};

    patients.forEach(p => {
      if (p.gender && genderStats[p.gender] !== undefined) {
        genderStats[p.gender]++;
      } else {
        genderStats.Other++;
      }

      const bg = p.bloodGroup || 'Unknown';
      bloodGroupStats[bg] = (bloodGroupStats[bg] || 0) + 1;
    });

    return res.json({
      success: true,
      totalPatients: patients.length,
      genderStats,
      bloodGroupStats,
      patients
    });
  } catch (error) {
    next(error);
  }
};
