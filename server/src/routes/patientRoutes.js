const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.get('/', authenticate, requireAdmin, patientController.getAllPatients);
router.get('/:id', authenticate, patientController.getPatientById);
router.put('/:id', authenticate, patientController.updatePatient);
router.delete('/:id', authenticate, requireAdmin, patientController.deletePatient);

module.exports = router;
