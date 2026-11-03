const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.use(authenticate, requireAdmin);

router.get('/appointments', reportController.getAppointmentReport);
router.get('/revenue', reportController.getRevenueReport);
router.get('/patients', reportController.getPatientReport);

module.exports = router;
