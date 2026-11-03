import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { patientService } from '../../services/patientService';
import { User, Phone, Mail, MapPin, Calendar, Activity, Pill, CreditCard, Shield, Clock } from 'lucide-react';

const PatientDetailModal = ({ isOpen, onClose, patientId, onStatusChange }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, records, invoices

  useEffect(() => {
    if (patientId && isOpen) {
      setLoading(true);
      patientService.getPatientById(patientId)
        .then((res) => {
          if (res.success) setPatient(res.patient);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [patientId, isOpen]);

  if (!isOpen) return null;

  const handleToggleStatus = async () => {
    if (!patient) return;
    const newStatus = patient.user?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await patientService.updatePatient(patient.id, { status: newStatus });
      setPatient({
        ...patient,
        user: { ...patient.user, status: newStatus }
      });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
    }
  };

  const pUser = patient?.user || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Full Clinical Profile" maxWidth="max-w-3xl">
      {loading ? (
        <LoadingSpinner text="Fetching clinical records..." />
      ) : !patient ? (
        <p className="text-center py-6 text-slate-500">Patient record not found.</p>
      ) : (
        <div className="space-y-5">
          {/* Header Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={pUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pUser.name}`}
                alt={pUser.name}
                className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm object-cover bg-white"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{pUser.name}</h3>
                  <Badge status={pUser.status} />
                </div>
                <p className="text-xs text-slate-500">Patient ID: <span className="font-mono font-bold text-secondary">PAT-{patient.id}</span></p>
                <p className="text-[11px] text-slate-400">Registered on {new Date(patient.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <button
              onClick={handleToggleStatus}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                pUser.status === 'ACTIVE'
                  ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {pUser.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b border-slate-200 text-xs font-bold space-x-4">
            {[
              { id: 'overview', name: 'Demographics & Vitals' },
              { id: 'appointments', name: `Appointments (${patient.appointments?.length || 0})` },
              { id: 'records', name: `Medical Records (${patient.medicalRecords?.length || 0})` },
              { id: 'prescriptions', name: `Prescriptions (${patient.prescriptions?.length || 0})` },
              { id: 'invoices', name: `Invoices (${patient.invoices?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2.5">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Contact Info</p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" /> {pUser.email}
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" /> {pUser.phone || 'No phone registered'}
                </p>
                <p className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{patient.address || 'Address not provided'}</span>
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2.5">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Clinical Parameters</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                    <span className="font-bold text-secondary text-sm">{patient.bloodGroup || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gender:</span>
                    <span className="font-bold text-slate-700">{patient.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date of Birth:</span>
                    <span className="font-bold text-slate-700">{patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Emergency Contact:</span>
                    <span className="font-bold text-slate-700 truncate block">{patient.emergencyContact || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Documented Medical History & Allergies</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700 block mb-1">Medical Background:</span>
                    <p className="text-slate-600">{patient.medicalHistory || 'No major pre-existing illnesses recorded.'}</p>
                  </div>
                  <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                    <span className="font-bold text-rose-800 block mb-1">Known Allergies:</span>
                    <p className="text-rose-700">{patient.allergies || 'No known allergies reported.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Appointments */}
          {activeTab === 'appointments' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {patient.appointments && patient.appointments.length > 0 ? (
                patient.appointments.map(app => (
                  <div key={app.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-secondary">{app.appointmentNumber}</span>
                        <Badge status={app.status} />
                      </div>
                      <p className="font-semibold text-slate-800 mt-1">{app.doctor?.user?.name} ({app.department?.name})</p>
                      <p className="text-slate-500 text-[11px]">{app.reason}</p>
                    </div>
                    <div className="text-right text-slate-500">
                      <p className="font-semibold text-slate-700">{new Date(app.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-[11px]">{app.timeSlot}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs">No appointments booked yet.</p>
              )}
            </div>
          )}

          {/* Tab 3: Medical Records */}
          {activeTab === 'records' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
                patient.medicalRecords.map(rec => (
                  <div key={rec.id} className="p-3.5 bg-white rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-secondary">{rec.recordNumber}</span>
                      <span className="text-slate-400 text-[11px]">{new Date(rec.visitDate).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-slate-800">{rec.diagnosis}</p>
                    <p className="text-slate-600">{rec.treatment}</p>
                    <p className="text-slate-400 text-[11px] mt-1">Doctor: {rec.doctor?.user?.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs">No medical records documented yet.</p>
              )}
            </div>
          )}

          {/* Tab 4: Prescriptions */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {patient.prescriptions && patient.prescriptions.length > 0 ? (
                patient.prescriptions.map(rx => (
                  <div key={rx.id} className="p-3.5 bg-white rounded-xl border border-slate-100 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-secondary">{rx.prescriptionNumber}</span>
                      <span className="text-slate-400 text-[11px]">{new Date(rx.issuedDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Doctor: {rx.doctor?.user?.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rx.medicines && rx.medicines.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-teal-50 border border-teal-100 text-[11px] text-teal-800 font-medium">
                          {m.medicineName} ({m.dosage})
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs">No prescriptions on file.</p>
              )}
            </div>
          )}

          {/* Tab 5: Invoices */}
          {activeTab === 'invoices' && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {patient.invoices && patient.invoices.length > 0 ? (
                patient.invoices.map(inv => (
                  <div key={inv.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-secondary">{inv.invoiceNumber}</span>
                        <Badge status={inv.status} />
                      </div>
                      <p className="font-semibold text-slate-800 mt-1">{inv.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-slate-800">${Number(inv.totalAmount).toFixed(2)}</p>
                      <p className="text-slate-400 text-[11px]">{new Date(inv.issueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs">No invoices generated yet.</p>
              )}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PatientDetailModal;
