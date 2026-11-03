import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CalendarCheck, 
  CalendarPlus, 
  Clock, 
  CreditCard, 
  FileText, 
  Pill, 
  UserRoundCheck, 
  Activity, 
  AlertCircle, 
  ArrowRight,
  Printer,
  HeartPulse
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrescriptionPrintModal from '../../components/patient/PrescriptionPrintModal';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const fetchDashboard = () => {
    setLoading(true);
    dashboardService.getPatientDashboard()
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled appointment?')) return;
    try {
      await appointmentService.deleteAppointment(id);
      fetchDashboard();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your patient health portal..." />;
  }

  const stats = data?.stats || {};
  const nextAppt = data?.nextAppointment;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-primary to-slate-800 text-white p-6 sm:p-8 overflow-hidden shadow-card">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <HeartPulse className="w-3.5 h-3.5" /> Patient Wellness Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Valued Patient'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track upcoming doctor consultations, review electronic prescriptions, and manage medical invoices from your dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/patient/book-appointment"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-secondary/30 transition-all"
            >
              <CalendarPlus className="w-4 h-4" /> Book Appointment
            </Link>
            <Link
              to="/patient/billing"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <CreditCard className="w-4 h-4" /> Pay Invoices
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Consultations"
          value={stats.totalAppointments ?? 0}
          subtitle="Hospital lifetime visits"
          icon={Calendar}
          color="navy"
        />
        <StatCard
          title="Upcoming Consultations"
          value={stats.upcomingAppointments ?? 0}
          subtitle="Confirmed & Pending"
          icon={Clock}
          color="teal"
        />
        <StatCard
          title="Completed Visits"
          value={stats.completedAppointments ?? 0}
          subtitle="Discharged consultations"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Pending Payments"
          value={`$${Number(stats.pendingPaymentsTotal || 0).toFixed(0)}`}
          subtitle={`${stats.pendingBillsCount || 0} unpaid invoices`}
          icon={CreditCard}
          color={stats.pendingBillsCount > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* Grid: Next Appointment & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Next Appointment Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-slate-800">Your Next Scheduled Appointment</h3>
              </div>
              {nextAppt && <Badge status={nextAppt.status} />}
            </div>

            {nextAppt ? (
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={nextAppt.doctor?.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"}
                    alt={nextAppt.doctor?.user?.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{nextAppt.doctor?.user?.name}</h4>
                    <p className="text-xs font-semibold text-secondary">{nextAppt.doctor?.specialization}</p>
                    <p className="text-[11px] text-slate-400">{nextAppt.department?.name} Department • {nextAppt.doctor?.roomNumber || 'Room 101'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      {new Date(nextAppt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Time Slot</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      {nextAppt.timeSlot}
                    </span>
                  </div>
                </div>

                {nextAppt.reason && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Reason: </span>
                    <span>{nextAppt.reason}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <CalendarPlus className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Upcoming Appointments</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You do not have any pending or confirmed upcoming appointments scheduled right now.
                </p>
                <Link
                  to="/patient/book-appointment"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 text-secondary font-bold text-xs hover:bg-secondary hover:text-white transition-all"
                >
                  Schedule Your Visit Now →
                </Link>
              </div>
            )}
          </div>

          {nextAppt && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-semibold">Ref: {nextAppt.appointmentNumber}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCancelAppointment(nextAppt.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  Cancel Appointment
                </button>
                <Link
                  to="/patient/appointments"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Quick Health Actions
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            <Link
              to="/patient/book-appointment"
              className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100/80 hover:bg-secondary hover:text-white group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary group-hover:bg-white text-white group-hover:text-secondary flex items-center justify-center mb-2 transition-colors">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-white">Book Doctor</p>
              <p className="text-[10px] text-slate-500 group-hover:text-teal-100">Pick day & slot</p>
            </Link>

            <Link
              to="/patient/records"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-primary hover:text-white group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary group-hover:bg-white text-white group-hover:text-primary flex items-center justify-center mb-2 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-white">Medical History</p>
              <p className="text-[10px] text-slate-500 group-hover:text-slate-300">Diagnosis & tests</p>
            </Link>

            <Link
              to="/patient/prescriptions"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-secondary hover:text-white group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 group-hover:bg-white text-white group-hover:text-secondary flex items-center justify-center mb-2 transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-white">Prescriptions</p>
              <p className="text-[10px] text-slate-500 group-hover:text-teal-100">Medicines & dosage</p>
            </Link>

            <Link
              to="/patient/billing"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-600 hover:text-white group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-white text-white group-hover:text-emerald-600 flex items-center justify-center mb-2 transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-white">Billing & Pay</p>
              <p className="text-[10px] text-slate-500 group-hover:text-emerald-100">Simulate invoices</p>
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-primary text-white text-xs space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-300" /> Need Medical Advice?
            </p>
            <p className="text-[11px] text-teal-100">
              Our registered clinical specialists are ready for OPD inquiries and checkups.
            </p>
            <Link
              to="/patient/doctors"
              className="inline-block pt-1 text-[11px] font-bold text-white underline"
            >
              Explore Doctor Directory →
            </Link>
          </div>
        </div>

      </div>

      {/* Grid: Recent Prescriptions & Recent Medical Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Prescriptions */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-secondary" />
              <h3 className="text-base font-bold text-slate-800">Recent Electronic Prescriptions</h3>
            </div>
            <Link to="/patient/prescriptions" className="text-xs font-bold text-secondary hover:underline">
              View All
            </Link>
          </div>

          {data?.recentPrescriptions && data.recentPrescriptions.length > 0 ? (
            <div className="space-y-3">
              {data.recentPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-teal-50/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-secondary text-xs">{rx.prescriptionNumber}</span>
                      <span className="text-[10px] text-slate-400">• {new Date(rx.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{rx.doctor?.user?.name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{rx.diagnosis || 'Clinical Prescription'}</p>
                  </div>

                  <button
                    onClick={() => setSelectedPrescription(rx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-secondary hover:border-secondary text-xs font-bold transition-all shadow-sm shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Rx
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-xs text-slate-400">No prescriptions recorded yet.</p>
          )}
        </div>

        {/* Recent Medical Records */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              <h3 className="text-base font-bold text-slate-800">Recent Medical Records</h3>
            </div>
            <Link to="/patient/records" className="text-xs font-bold text-secondary hover:underline">
              View History
            </Link>
          </div>

          {data?.recentRecords && data.recentRecords.length > 0 ? (
            <div className="space-y-3">
              {data.recentRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-secondary">{rec.recordNumber}</span>
                    <span className="text-slate-400 text-[11px]">{new Date(rec.visitDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{rec.diagnosis}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{rec.treatment}</p>
                  <p className="text-[10px] text-slate-400 pt-1">Physician: {rec.doctor?.user?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-xs text-slate-400">No medical records documented yet.</p>
          )}
        </div>

      </div>

      {/* Prescription Printable Modal */}
      {selectedPrescription && (
        <PrescriptionPrintModal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          prescription={selectedPrescription}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
