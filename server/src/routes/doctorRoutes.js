const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Publicly viewable doctors
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

// Admin doctor management
router.post('/', authenticate, requireAdmin, doctorController.createDoctor);
router.put('/:id', authenticate, requireAdmin, doctorController.updateDoctor);
router.delete('/:id', authenticate, requireAdmin, doctorController.deleteDoctor);

module.exports = router;
