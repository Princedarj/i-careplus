import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Stethoscope, Search, Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { medicalRecordService } from '../../services/medicalRecordService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    setLoading(true);
    medicalRecordService.getAllRecords({ search: searchTerm })
      .then((res) => {
        if (res.records) setRecords(res.records);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const parseVitals = (vitalsJson) => {
    try {
      return vitalsJson ? JSON.parse(vitalsJson) : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Personal Medical History</h2>
          <p className="text-xs text-slate-400 mt-0.5">Verified clinical records, diagnoses, and medical observations</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200/80 text-secondary text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Relational Electronic Health Record (EHR)
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search diagnosis, physician, or record ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
          />
        </div>
        <span className="text-slate-400 text-xs hidden sm:inline">{records.length} Documents On Record</span>
      </div>

      {/* Records Listing */}
      {loading ? (
        <LoadingSpinner text="Retrieving verified health records..." />
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No Medical Records Found</p>
          <p className="text-xs text-slate-400">Clinical documentation will appear here following completed doctor visits.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => {
            const vitals = parseVitals(rec.vitalsJson);
            return (
              <div
                key={rec.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-card transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-secondary text-sm">{rec.recordNumber}</span>
                    <span className="text-xs text-slate-400">• Visit Date: {new Date(rec.visitDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <Stethoscope className="w-4 h-4 text-secondary" />
                    <span>{rec.doctor?.user?.name} ({rec.doctor?.department?.name})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-800">{rec.diagnosis}</h3>
                  {rec.treatment && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80 text-xs text-slate-600">
                      <span className="font-bold text-slate-700 block mb-1">Treatment Regimen & Recovery Plan:</span>
                      <p className="leading-relaxed">{rec.treatment}</p>
                    </div>
                  )}
                </div>

                {/* Vitals Ribbon */}
                {vitals && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
                    {vitals.bloodPressure && (
                      <div className="p-2 rounded-xl bg-teal-50/50 border border-teal-100/60">
                        <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                        <span className="font-bold text-slate-800">{vitals.bloodPressure}</span>
                      </div>
                    )}
                    {vitals.heartRate && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                        <span className="font-bold text-slate-800">{vitals.heartRate}</span>
                      </div>
                    )}
                    {vitals.temperature && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Temperature</span>
                        <span className="font-bold text-slate-800">{vitals.temperature}</span>
                      </div>
                    )}
                    {vitals.weight && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Body Weight</span>
                        <span className="font-bold text-slate-800">{vitals.weight}</span>
                      </div>
                    )}
                    {vitals.spo2 && (
                      <div className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
                        <span className="text-[10px] text-slate-400 block">SpO2 Oxygen</span>
                        <span className="font-bold text-emerald-700">{vitals.spo2}</span>
                      </div>
                    )}
                  </div>
                )}

                {rec.notes && (
                  <p className="text-xs text-slate-500 italic pt-1">
                    Doctor remarks: "{rec.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
