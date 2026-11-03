import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  DollarSign, 
  Award, 
  Stethoscope, 
  Building2,
  CalendarCheck
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { appointmentService } from '../../services/appointmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctor');

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Tomorrow as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  const navigate = useNavigate();

  // Standard doctor time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    departmentService.getAllDepartments().then((res) => {
      if (res.departments) setDepartments(res.departments);
    });
  }, []);

  useEffect(() => {
    setLoadingDoctors(true);
    doctorService.getAllDoctors({
      search: searchTerm,
      departmentId: selectedDept !== 'all' ? selectedDept : undefined
    })
      .then((res) => {
        if (res.doctors) {
          setDoctors(res.doctors);
          if (initialDoctorId) {
            const found = res.doctors.find(d => String(d.id) === String(initialDoctorId));
            if (found) setSelectedDoctor(found);
          } else if (!selectedDoctor && res.doctors.length > 0) {
            setSelectedDoctor(res.doctors[0]);
          }
        }
      })
      .finally(() => setLoadingDoctors(false));
  }, [searchTerm, selectedDept, initialDoctorId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a doctor to continue.');
      return;
    }
    if (!appointmentDate || !selectedTimeSlot) {
      setError('Please pick a date and an available consultation time slot.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await appointmentService.createAppointment({
        doctorId: selectedDoctor.id,
        appointmentDate,
        timeSlot: selectedTimeSlot,
        reason: reason || 'Outpatient Consultation'
      });

      if (res.success) {
        setSuccessBooking(res.appointment);
      }
    } catch (err) {
      setError(err.message || 'Could not complete appointment booking. The slot might already be reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Book a Medical Consultation</h2>
        <p className="text-xs text-slate-400 mt-1">Select your physician, pick a convenient time slot, and confirm your hospital OPD visit</p>
      </div>

      {successBooking ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-card text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800">Your Appointment is Scheduled!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your appointment request has been recorded in the MySQL database. An electronic invoice has been generated for your review.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-xs text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-400">Appointment Number:</span>
              <span className="font-mono font-bold text-secondary text-sm">{successBooking.appointmentNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Doctor:</span>
              <span className="font-bold text-slate-800">{successBooking.doctor?.user?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Department:</span>
              <span className="font-semibold text-slate-700">{successBooking.department?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Date & Slot:</span>
              <span className="font-bold text-slate-800">
                {new Date(successBooking.appointmentDate).toLocaleDateString()} at {successBooking.timeSlot}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Consultation Fee:</span>
              <span className="font-mono font-bold text-primary">${Number(selectedDoctor?.consultationFee || 50).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/patient/appointments"
              className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all"
            >
              View My Appointments
            </Link>
            <Link
              to="/patient/billing"
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Review Consultation Invoices
            </Link>
            <button
              onClick={() => {
                setSuccessBooking(null);
                setReason('');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Book Another
            </button>
          </div>
        </div>
      ) : (
        /* Booking Workflow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Doctor Selection & Filter */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1: Choose Physician</span>
                <span className="text-xs font-bold text-secondary">{doctors.length} Doctors</span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctor name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Doctors Scroll List */}
              {loadingDoctors ? (
                <LoadingSpinner size="sm" text="Updating doctors list..." />
              ) : doctors.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">No doctors match this search filter.</p>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-secondary bg-teal-50/60 shadow-sm ring-1 ring-secondary/30'
                            : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"}
                            alt={doc.user?.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{doc.user?.name}</p>
                            <p className="text-[11px] text-secondary font-semibold">{doc.specialization}</p>
                            <p className="text-[10px] text-slate-400">{doc.department?.name} • {doc.experience} Yrs Exp</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-primary text-xs block">
                            ${Number(doc.consultationFee).toFixed(0)}
                          </span>
                          <span className="text-[10px] text-slate-400">OPD fee</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Appointment Date, Slot & Confirmation */}
          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={handleBooking} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-soft space-y-5 text-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Step 2: Consultation Schedule
              </span>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Selected Doctor Summary */}
              {selectedDoctor && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDoctor.user?.avatar}
                      alt={selectedDoctor.user?.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{selectedDoctor.user?.name}</p>
                      <p className="text-[10px] text-slate-500">{selectedDoctor.qualification} • {selectedDoctor.department?.name}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-primary text-sm">${Number(selectedDoctor.consultationFee).toFixed(2)}</span>
                </div>
              )}

              {/* Date Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Select Consultation Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white"
                />
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Available OPD Time Slots *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-secondary text-white border-secondary shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason for Appointment */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Reason for Visit / Clinical Symptoms
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Follow-up blood pressure check, persistent cough, or routine medical examination..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                ></textarea>
              </div>

              {/* Booking Confirmation CTA */}
              <button
                type="submit"
                disabled={submitting || !selectedDoctor}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-secondary hover:bg-secondary-600 text-white font-bold text-sm shadow-md shadow-secondary/25 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Hospital Database...</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>Confirm Consultation Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default BookAppointmentPage;
