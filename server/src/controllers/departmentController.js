const prisma = require('../config/db');

// GET /api/departments (Public & Authenticated)
exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        doctors: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        _count: {
          select: {
            doctors: true,
            appointments: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return res.json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/departments/:id
exports.getDepartmentById = async (req, res, next) => {
  try {
    const departmentId = parseInt(req.params.id);

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        doctors: {
          where: { status: 'ACTIVE' },
          include: {
            user: { select: { id: true, name: true, avatar: true, email: true, phone: true } },
            availabilities: true
          }
        },
        _count: {
          select: { doctors: true, appointments: true }
        }
      }
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    return res.json({
      success: true,
      department
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/departments (Admin only)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, headOfDepartment, icon } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Department name and department code are required.'
      });
    }

    const existingCode = await prisma.department.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'A department with this code already exists.'
      });
    }

    const department = await prisma.department.create({
      data: {
        name: name.trim(),
        code: code.toUpperCase().trim(),
        description: description ? description.trim() : null,
        headOfDepartment: headOfDepartment ? headOfDepartment.trim() : null,
        icon: icon || 'Heart',
        status: 'ACTIVE'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Department added successfully.',
      department
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/departments/:id (Admin only)
exports.updateDepartment = async (req, res, next) => {
  try {
    const departmentId = parseInt(req.params.id);
    const { name, code, description, headOfDepartment, icon, status } = req.body;

    const existing = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    const updated = await prisma.department.update({
      where: { id: departmentId },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        code: code !== undefined ? code.toUpperCase().trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        headOfDepartment: headOfDepartment !== undefined ? headOfDepartment.trim() : undefined,
        icon: icon || undefined,
        status: status || undefined
      }
    });

    return res.json({
      success: true,
      message: 'Department updated successfully.',
      department: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/departments/:id (Admin only)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const departmentId = parseInt(req.params.id);

    const counts = await prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        _count: {
          select: { doctors: true, appointments: true }
        }
      }
    });

    if (!counts) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.'
      });
    }

    if (counts._count.doctors > 0 || counts._count.appointments > 0) {
      // Safe deactivation instead of raw deletion
      await prisma.department.update({
        where: { id: departmentId },
        data: { status: 'INACTIVE' }
      });

      return res.json({
        success: true,
        message: 'Department has active doctors or past appointment history. Deactivated department status safely.'
      });
    }

    await prisma.department.delete({
      where: { id: departmentId }
    });

    return res.json({
      success: true,
      message: 'Department deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
