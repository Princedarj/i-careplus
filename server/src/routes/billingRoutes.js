const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.use(authenticate);

router.get('/', billingController.getAllInvoices);
router.get('/:id', billingController.getInvoiceById);
router.post('/', requireAdmin, billingController.createInvoice);
router.patch('/:id/status', requireAdmin, billingController.updateInvoiceStatus);
router.post('/:id/pay', billingController.payInvoice);

module.exports = router;
