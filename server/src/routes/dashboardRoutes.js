const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.get('/patient', authenticate, dashboardController.getPatientDashboard);
router.get('/admin', authenticate, requireAdmin, dashboardController.getAdminDashboard);

module.exports = router;
