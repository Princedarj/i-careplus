const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'icareplus_super_secret_jwt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, dob, gender, bloodGroup, address, emergencyContact } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;

    // Create user and patient in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'PATIENT',
          phone: phone ? phone.trim() : null,
          avatar,
          status: 'ACTIVE'
        }
      });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          dob: dob ? new Date(dob) : null,
          gender: gender || null,
          bloodGroup: bloodGroup || null,
          address: address || null,
          emergencyContact: emergencyContact || null
        }
      });

      // Welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to i_CarePlus',
          message: 'Your patient account has been created successfully. You can now book appointments and access healthcare services.',
          type: 'INFO'
        }
      });

      return { user, patient };
    });

    const token = generateToken(result.user);

    const safeUser = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      phone: result.user.phone,
      avatar: result.user.avatar,
      patient: result.patient
    };

    return res.status(201).json({
      success: true,
      message: 'Registration completed successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login (Patients / General)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        patient: true,
        doctor: {
          include: { department: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact hospital administration.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/admin/login (Dedicated Admin Portal Login)
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password are required.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Account does not possess Administrator privileges.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Administrator account is inactive.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Admin authentication verified.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        patient: true,
        doctor: {
          include: { department: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    const { password, ...safeUser } = user;
    return res.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters in length.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, dob, gender, bloodGroup, address, emergencyContact, medicalHistory, allergies } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name ? name.trim() : undefined,
        phone: phone ? phone.trim() : undefined
      }
    });

    if (req.user.role === 'PATIENT' && req.user.patient) {
      await prisma.patient.update({
        where: { id: req.user.patient.id },
        data: {
          dob: dob ? new Date(dob) : undefined,
          gender: gender !== undefined ? gender : undefined,
          bloodGroup: bloodGroup !== undefined ? bloodGroup : undefined,
          address: address !== undefined ? address : undefined,
          emergencyContact: emergencyContact !== undefined ? emergencyContact : undefined,
          medicalHistory: medicalHistory !== undefined ? medicalHistory : undefined,
          allergies: allergies !== undefined ? allergies : undefined
        }
      });
    }

    const freshUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        patient: true,
        doctor: {
          include: { department: true }
        }
      }
    });

    const { password: _, ...safeUser } = freshUser;
    return res.json({
      success: true,
      message: 'Profile information updated successfully.',
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};
