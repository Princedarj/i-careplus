const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.use(authenticate);

router.get('/', medicalRecordController.getAllMedicalRecords);
router.get('/:id', medicalRecordController.getMedicalRecordById);
router.post('/', requireAdmin, medicalRecordController.createMedicalRecord);
router.put('/:id', requireAdmin, medicalRecordController.updateMedicalRecord);

module.exports = router;
