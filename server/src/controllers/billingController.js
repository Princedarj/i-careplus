const prisma = require('../config/db');

// GET /api/invoices
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, patientId, search } = req.query;

    const where = {};

    if (req.user.role === 'PATIENT') {
      if (!req.user.patient) {
        return res.status(400).json({ success: false, message: 'Patient profile not found.' });
      }
      where.patientId = req.user.patient.id;
    } else if (patientId) {
      where.patientId = parseInt(patientId);
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { title: { contains: search } },
        { patient: { user: { name: { contains: search } } } }
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
        appointment: {
          include: {
            doctor: { include: { user: true, department: true } }
          }
        },
        payments: true
      },
      orderBy: { issueDate: 'desc' }
    });

    // Summary calculations
    const totalAmount = invoices.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const paidAmount = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const pendingAmount = invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    return res.json({
      success: true,
      summary: {
        totalBills: invoices.length,
        paidBills: invoices.filter(i => i.status === 'PAID').length,
        pendingBills: invoices.filter(i => i.status === 'PENDING').length,
        totalAmount,
        paidAmount,
        pendingAmount
      },
      invoices
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/invoices/:id
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoiceId = parseInt(req.params.id);

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
        appointment: {
          include: {
            doctor: { include: { user: true, department: true } },
            department: true
          }
        },
        payments: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.'
      });
    }

    if (req.user.role === 'PATIENT' && req.user.patient && invoice.patientId !== req.user.patient.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own billing records.'
      });
    }

    return res.json({
      success: true,
      invoice
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/invoices (Admin only)
exports.createInvoice = async (req, res, next) => {
  try {
    const { patientId, appointmentId, title, description, totalAmount, dueDate, paymentMethod, status } = req.body;

    if (!patientId || !title || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Patient, title, and total amount are required.'
      });
    }

    const invNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const amount = parseFloat(totalAmount);
    const invStatus = status || 'PENDING';

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: invNumber,
        patientId: parseInt(patientId),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        title: title.trim(),
        description: description ? description.trim() : null,
        issueDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 86400000 * 7),
        totalAmount: amount,
        paidAmount: invStatus === 'PAID' ? amount : 0.00,
        balance: invStatus === 'PAID' ? 0.00 : amount,
        status: invStatus,
        paymentMethod: paymentMethod || null
      },
      include: {
        patient: { include: { user: true } }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Invoice generated successfully.',
      invoice
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/invoices/:id/status (Admin only)
exports.updateInvoiceStatus = async (req, res, next) => {
  try {
    const invoiceId = parseInt(req.params.id);
    const { status, paymentMethod } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.'
      });
    }

    const isPaid = status === 'PAID';

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        paymentMethod: paymentMethod || invoice.paymentMethod,
        paidAmount: isPaid ? invoice.totalAmount : invoice.paidAmount,
        balance: isPaid ? 0.00 : invoice.totalAmount
      },
      include: {
        patient: { include: { user: true } },
        payments: true
      }
    });

    return res.json({
      success: true,
      message: `Invoice status updated to ${status}.`,
      invoice: updated
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/invoices/:id/pay (Patient Demo Payment)
exports.payInvoice = async (req, res, next) => {
  try {
    const invoiceId = parseInt(req.params.id);
    const { paymentMethod, notes } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        patient: { include: { user: true } }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.'
      });
    }

    if (req.user.role === 'PATIENT' && req.user.patient && invoice.patientId !== req.user.patient.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'This invoice has already been fully paid.'
      });
    }

    const transactionId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}-ICP`;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          transactionId,
          amount: invoice.totalAmount,
          paymentMethod: paymentMethod || 'ONLINE_DEMO',
          paymentDate: new Date(),
          status: 'SUCCESS',
          notes: notes || 'Simulated college project demo payment processed successfully.'
        }
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID',
          paidAmount: invoice.totalAmount,
          balance: 0.00,
          paymentMethod: paymentMethod || 'ONLINE_DEMO'
        },
        include: {
          patient: { include: { user: true } },
          payments: true
        }
      });

      // Notify patient
      await tx.notification.create({
        data: {
          userId: invoice.patient.userId,
          title: 'Payment Successful',
          message: `Your payment of $${Number(invoice.totalAmount).toFixed(2)} for invoice ${invoice.invoiceNumber} was successfully received. Ref: ${transactionId}`,
          type: 'BILLING'
        }
      });

      return { payment, invoice: updatedInvoice };
    });

    return res.json({
      success: true,
      message: 'Demo payment processed successfully! Invoice marked as PAID.',
      transactionId,
      invoice: result.invoice,
      payment: result.payment
    });
  } catch (error) {
    next(error);
  }
};
