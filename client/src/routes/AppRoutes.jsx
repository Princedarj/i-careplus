import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PatientLayout from '../layouts/PatientLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import DoctorsPage from '../pages/public/DoctorsPage';
import DepartmentsPage from '../pages/public/DepartmentsPage';
import ContactPage from '../pages/public/ContactPage';
import PatientLoginPage from '../pages/public/PatientLoginPage';
import PatientRegisterPage from '../pages/public/PatientRegisterPage';
import AdminLoginPage from '../pages/public/AdminLoginPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';
import MyAppointmentsPage from '../pages/patient/MyAppointmentsPage';
import FindDoctorsPage from '../pages/patient/FindDoctorsPage';
import MedicalRecordsPage from '../pages/patient/MedicalRecordsPage';
import PrescriptionsPage from '../pages/patient/PrescriptionsPage';
import BillingPaymentsPage from '../pages/patient/BillingPaymentsPage';
import PatientProfilePage from '../pages/patient/PatientProfilePage';
import PatientSettingsPage from '../pages/patient/PatientSettingsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAppointments from '../pages/admin/AdminAppointments';
import AdminPatients from '../pages/admin/AdminPatients';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminDepartments from '../pages/admin/AdminDepartments';
import AdminBilling from '../pages/admin/AdminBilling';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<PatientLoginPage />} />
        <Route path="/register" element={<PatientRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      {/* 2. Patient Portal Routes (Role: PATIENT) */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
        <Route path="doctors" element={<FindDoctorsPage />} />
        <Route path="records" element={<MedicalRecordsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="billing" element={<BillingPaymentsPage />} />
        <Route path="profile" element={<PatientProfilePage />} />
        <Route path="settings" element={<PatientSettingsPage />} />
      </Route>

      {/* 3. Admin Workspace Routes (Role: ADMIN) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
