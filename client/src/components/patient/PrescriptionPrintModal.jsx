import React from 'react';
import Modal from '../common/Modal';
import { Printer, Activity, Pill, ShieldCheck } from 'lucide-react';

const PrescriptionPrintModal = ({ isOpen, onClose, prescription }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const patient = prescription.patient || {};
  const patientUser = patient.user || {};
  const doctor = prescription.doctor || {};
  const doctorUser = doctor.user || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Medical Prescription Details" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Printable Paper Canvas */}
        <div id="printable-prescription" className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm print:border-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-primary gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <Activity className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-primary tracking-tight">
                  i_<span className="text-secondary">CarePlus</span> Medical Center
                </h2>
                <p className="text-xs text-slate-500 font-medium">Multi-Specialty Tertiary Care & Research Institute</p>
                <p className="text-[11px] text-slate-400">742 Evergreen Healthcare Ave, NY | Emergency: +1 (800) 911-CARE</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-slate-800">{doctorUser.name || 'Attending Physician'}</p>
              <p className="text-xs text-secondary font-semibold">{doctor.specialization || 'Consultant Specialist'}</p>
              <p className="text-[11px] text-slate-500">{doctor.qualification || 'MD / MBBS'}</p>
              <p className="text-[10px] text-slate-400">Reg. No: MED-{doctor.id ? doctor.id + 10920 : '10842'}</p>
            </div>
          </div>

          {/* Patient Details strip */}
          <div className="my-4 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Patient Name</p>
              <p className="font-bold text-slate-800">{patientUser.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Gender / Blood Group</p>
              <p className="font-bold text-slate-800">{patient.gender || 'Not specified'} ({patient.bloodGroup || 'O+'})</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Rx Number</p>
              <p className="font-bold text-secondary font-mono">{prescription.prescriptionNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Issued Date</p>
              <p className="font-bold text-slate-800">{new Date(prescription.issuedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="mb-4 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs">
              <span className="font-bold text-slate-800">Primary Diagnosis: </span>
              <span className="text-slate-700 font-medium">{prescription.diagnosis}</span>
            </div>
          )}

          {/* Rx Medicines Table */}
          <div className="my-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-serif font-bold text-primary">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescribed Medications</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine & Strength</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicines && prescription.medicines.length > 0 ? (
                    prescription.medicines.map((med, idx) => (
                      <tr key={med.id || idx} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{med.medicineName}</td>
                        <td className="py-3 px-3 text-slate-600">{med.dosage}</td>
                        <td className="py-3 px-3 text-slate-600">{med.frequency}</td>
                        <td className="py-3 px-3 text-slate-600">{med.duration}</td>
                        <td className="py-3 px-3 text-slate-500 italic">{med.instructions}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-slate-400">No specific medicines recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Advice / Notes */}
          {prescription.notes && (
            <div className="mb-6 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Physician's Dietary & Recovery Advice:</p>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 leading-relaxed">{prescription.notes}</p>
            </div>
          )}

          {/* Doctor Signature Block */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end text-xs">
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <p className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Digitally verified e-Prescription</p>
              <p>Valid across all certified pharmacies nationwide.</p>
            </div>

            <div className="text-right">
              <p className="font-serif italic text-base text-primary font-bold">{doctorUser.name || 'Dr. Physician'}</p>
              <div className="w-40 border-b border-slate-300 my-1 ml-auto"></div>
              <p className="text-[10px] text-slate-500 font-semibold">Authorized Medical Practitioner Signature</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white text-sm font-bold shadow-md shadow-secondary/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save Prescription
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PrescriptionPrintModal;
