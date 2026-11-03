import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/appointments')) return 'Appointment Central';
    if (path.includes('/patients')) return 'Patient Registry & Records';
    if (path.includes('/doctors')) return 'Medical Staff & Specialists';
    if (path.includes('/departments')) return 'Hospital Clinical Departments';
    if (path.includes('/billing')) return 'Financial Billing Management';
    if (path.includes('/reports')) return 'Clinical Analytics & Reports';
    if (path.includes('/settings')) return 'Hospital Settings & Config';
    return 'Hospital Administration';
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader setMobileOpen={setMobileOpen} title={getPageTitle()} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
