const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.use(authenticate);

router.get('/', prescriptionController.getAllPrescriptions);
router.get('/:id', prescriptionController.getPrescriptionById);
router.post('/', requireAdmin, prescriptionController.createPrescription);

module.exports = router;
