import React, { useState, useEffect } from 'react';
import { Pill, Printer, Calendar, User, Search, Stethoscope, Clock, ShieldCheck } from 'lucide-react';
import { prescriptionService } from '../../services/prescriptionService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrescriptionPrintModal from '../../components/patient/PrescriptionPrintModal';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    setLoading(true);
    prescriptionService.getAllPrescriptions({ search: searchTerm })
      .then((res) => {
        if (res.prescriptions) setPrescriptions(res.prescriptions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Electronic Prescriptions (Rx)</h2>
          <p className="text-xs text-slate-400 mt-0.5">View active medicines, dosage instructions, and download printable prescriptions</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200/80 text-secondary text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Pharmacy-Ready e-Rx System
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prescription number or physician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
          />
        </div>
        <span className="text-slate-400 text-xs hidden sm:inline">{prescriptions.length} Prescriptions Issued</span>
      </div>

      {/* Prescriptions Cards */}
      {loading ? (
        <LoadingSpinner text="Retrieving digital prescriptions..." />
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No Prescriptions On File</p>
          <p className="text-xs text-slate-400">Prescriptions issued by your hospital doctors will be displayed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-secondary text-sm">{rx.prescriptionNumber}</span>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{rx.doctor?.user?.name}</p>
                    <p className="text-[11px] text-slate-400">{rx.doctor?.department?.name}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                    {new Date(rx.issuedDate).toLocaleDateString()}
                  </span>
                </div>

                {rx.diagnosis && (
                  <p className="text-xs font-semibold text-slate-700">
                    Diagnosis: <span className="font-normal text-slate-600">{rx.diagnosis}</span>
                  </p>
                )}

                {/* Medicines List */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Medications ({rx.medicines?.length || 0})
                  </span>
                  <div className="space-y-1.5">
                    {rx.medicines && rx.medicines.map((med, idx) => (
                      <div
                        key={med.id || idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 text-xs flex justify-between items-start"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{med.medicineName}</p>
                          <p className="text-[11px] text-slate-500">{med.frequency} • {med.duration}</p>
                          {med.instructions && (
                            <p className="text-[10px] text-teal-700 italic mt-0.5">{med.instructions}</p>
                          )}
                        </div>
                        <span className="font-semibold text-secondary text-[11px] px-2 py-0.5 rounded-lg bg-teal-50 border border-teal-100">
                          {med.dosage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {rx.notes && (
                  <p className="text-xs text-slate-500 italic p-2.5 bg-slate-50 rounded-xl">
                    "{rx.notes}"
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedPrescription(rx)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" /> View & Print Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default PrescriptionsPage;
