import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientHeader from '../components/patient/PatientHeader';

const PatientLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/book-appointment')) return 'Book Consultation';
    if (path.includes('/appointments')) return 'My Scheduled Appointments';
    if (path.includes('/doctors')) return 'Our Medical Specialists';
    if (path.includes('/records')) return 'Personal Medical History';
    if (path.includes('/prescriptions')) return 'My Digital Prescriptions';
    if (path.includes('/billing')) return 'Billing & Invoices';
    if (path.includes('/profile')) return 'My Profile Information';
    if (path.includes('/settings')) return 'Account Preferences';
    return 'Patient Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      <PatientSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <PatientHeader setMobileOpen={setMobileOpen} title={getPageTitle()} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
