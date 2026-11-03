const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authenticate = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Publicly viewable departments
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);

// Admin department management
router.post('/', authenticate, requireAdmin, departmentController.createDepartment);
router.put('/:id', authenticate, requireAdmin, departmentController.updateDepartment);
router.delete('/:id', authenticate, requireAdmin, departmentController.deleteDepartment);

module.exports = router;
