import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  CalendarCheck, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  BarChart3, 
  Eye, 
  CreditCard,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AppointmentModal from '../../components/admin/AppointmentModal';
import DoctorModal from '../../components/admin/DoctorModal';
import DepartmentModal from '../../components/admin/DepartmentModal';
import InvoiceModal from '../../components/admin/InvoiceModal';
import { departmentService } from '../../services/departmentService';
import { patientService } from '../../services/patientService';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [patients, setPatients] = useState([]);

  const fetchDashboard = () => {
    setLoading(true);
    dashboardService.getAdminDashboard()
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
    departmentService.getAllDepartments().then(res => {
      if (res.departments) setDepartments(res.departments);
    });
    patientService.getAllPatients().then(res => {
      if (res.patients) setPatients(res.patients);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading hospital executive dashboard..." />;
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const monthlyTrends = charts.monthlyTrends || [];
  const statusData = charts.statusChartData || [];
  const deptData = charts.departmentChartData || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hospital Executive Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time clinical metrics, patient traffic, and revenue analytics</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowDoctorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-400" /> Add Doctor
          </button>
          <button
            onClick={() => setShowDepartmentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs shadow-sm transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-secondary" /> Add Dept
          </button>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" /> Issue Invoice
          </button>
        </div>
      </div>

      {/* 6 Main Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients ?? 0}
          subtitle="Registered accounts"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors ?? 0}
          subtitle="Medical faculty"
          icon={UserPlus}
          color="navy"
        />
        <StatCard
          title="Total Appts"
          value={stats.totalAppointments ?? 0}
          subtitle="Scheduled & past"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Today's OPD"
          value={stats.todayAppointments ?? 0}
          subtitle="Day consultations"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments ?? 0}
          subtitle="Active wings"
          icon={Building2}
          color="emerald"
        />
        <StatCard
          title="Total Revenue"
          value={`$${Number(stats.totalRevenue || 0).toLocaleString()}`}
          subtitle="Cleared payments"
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Patient Visits & Consultations</h3>
              <p className="text-[11px] text-slate-400">Monthly appointment volume trends</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-secondary">
              6-Month Interval
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5A4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0EA5A4" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#0EA5A4" strokeWidth={3} fillOpacity={1} fill="url(#colorAppt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Consultation Status Breakdown</h3>
            <p className="text-[11px] text-slate-400">Real-time appointment statuses</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {statusData.map((st, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }}></span>
                <span className="text-slate-600 text-[11px]">{st.name}: <strong>{st.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Recent Appointments & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Appointments Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Hospital Appointments</h3>
              <p className="text-[11px] text-slate-400">Latest scheduled patient visits</p>
            </div>
            <Link to="/admin/appointments" className="text-xs font-bold text-secondary hover:underline">
              View All ({stats.totalAppointments})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Doctor</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Date/Time</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentAppointments && data.recentAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {appt.patient?.user?.name}
                      <span className="font-mono text-[10px] text-slate-400 block">{appt.appointmentNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {appt.doctor?.user?.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {appt.department?.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {new Date(appt.appointmentDate).toLocaleDateString()}
                      <span className="text-[10px] text-slate-400 block">{appt.timeSlot}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge status={appt.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="p-1 rounded-lg text-slate-400 hover:text-secondary hover:bg-slate-100"
                        title="Manage"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Registered Patients */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Newly Registered</h3>
              <p className="text-[11px] text-slate-400">Recent patient sign-ups</p>
            </div>
            <Link to="/admin/patients" className="text-xs font-bold text-secondary hover:underline">
              All Patients
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentPatients && data.recentPatients.map((pat) => (
              <div key={pat.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={pat.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pat.user?.name}`}
                    alt={pat.user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-white"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{pat.user?.name}</p>
                    <p className="text-[10px] text-slate-400">{pat.user?.email}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100">
                  {pat.bloodGroup || 'O+'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Appointment Manage Modal */}
      {selectedAppointment && (
        <AppointmentModal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          appointment={selectedAppointment}
          onSuccess={() => fetchDashboard()}
        />
      )}

      {/* Add Doctor Modal */}
      {showDoctorModal && (
        <DoctorModal
          isOpen={showDoctorModal}
          onClose={() => setShowDoctorModal(false)}
          departments={departments}
          onSuccess={() => fetchDashboard()}
        />
      )}

      {/* Add Department Modal */}
      {showDepartmentModal && (
        <DepartmentModal
          isOpen={showDepartmentModal}
          onClose={() => setShowDepartmentModal(false)}
          onSuccess={() => fetchDashboard()}
        />
      )}

      {/* Generate Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          patients={patients}
          onSuccess={() => fetchDashboard()}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
