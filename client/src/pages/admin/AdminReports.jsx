import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Printer, 
  Calendar, 
  Download, 
  DollarSign, 
  Users, 
  Stethoscope, 
  Activity, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReports = () => {
  const [activeReportTab, setActiveReportTab] = useState('appointments'); // appointments, revenue, patients
  const [appointmentReport, setAppointmentReport] = useState(null);
  const [revenueReport, setRevenueReport] = useState(null);
  const [patientReport, setPatientReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadReports = () => {
    setLoading(true);
    Promise.all([
      reportService.getAppointmentReport({ startDate, endDate }).catch(() => null),
      reportService.getRevenueReport().catch(() => null),
      reportService.getPatientReport().catch(() => null)
    ]).then(([apptRes, revRes, patRes]) => {
      if (apptRes) setAppointmentReport(apptRes);
      if (revRes) setRevenueReport(revRes);
      if (patRes) setPatientReport(patRes);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Clinical & Financial Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit reports for hospital management and university submission</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all shrink-0"
        >
          <Printer className="w-4 h-4" /> Print / Save Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-6 no-print">
        {[
          { id: 'appointments', name: 'Appointments & Doctor Performance' },
          { id: 'revenue', name: 'Financial Revenue & Collections' },
          { id: 'patients', name: 'Patient Demographics & Growth' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id)}
            className={`pb-3 transition-colors border-b-2 ${
              activeReportTab === tab.id
                ? 'border-secondary text-secondary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Compiling analytical hospital reports..." />
      ) : (
        <div id="printable-report" className="space-y-6">
          
          {/* Printable Report Header */}
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-soft print:border-none print:shadow-none space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {activeReportTab === 'appointments' && 'Outpatient Consultation & Doctor Performance Audit'}
                  {activeReportTab === 'revenue' && 'Hospital Revenue, Billed Invoices & Collections Summary'}
                  {activeReportTab === 'patients' && 'Patient Registration & Clinical Demographics Report'}
                </h3>
                <p className="text-xs text-slate-400">i_CarePlus Medical Center • Academic Submission Report</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* TAB 1: Appointments & Doctor Performance */}
            {activeReportTab === 'appointments' && appointmentReport && (
              <div className="space-y-6">
                {/* Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Bookings</span>
                    <span className="text-xl font-bold text-slate-800 font-mono">{appointmentReport.statusBreakdown?.TOTAL}</span>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
                    <span className="text-teal-700 text-[10px] uppercase font-bold block">Confirmed</span>
                    <span className="text-xl font-bold text-teal-800 font-mono">{appointmentReport.statusBreakdown?.CONFIRMED}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-700 text-[10px] uppercase font-bold block">Completed</span>
                    <span className="text-xl font-bold text-emerald-800 font-mono">{appointmentReport.statusBreakdown?.COMPLETED}</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-amber-700 text-[10px] uppercase font-bold block">Pending</span>
                    <span className="text-xl font-bold text-amber-800 font-mono">{appointmentReport.statusBreakdown?.PENDING}</span>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                    <span className="text-rose-700 text-[10px] uppercase font-bold block">Cancelled</span>
                    <span className="text-xl font-bold text-rose-800 font-mono">{appointmentReport.statusBreakdown?.CANCELLED}</span>
                  </div>
                </div>

                {/* Doctor Workload Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Doctor Workload & Consultations Delivered
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Physician Name</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3 text-center">Completed Visits</th>
                          <th className="py-2.5 px-3 text-center">Pending Slots</th>
                          <th className="py-2.5 px-3 text-right">Total Scheduled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointmentReport.doctorPerformance?.map((doc, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-bold text-slate-800">{doc.doctorName}</td>
                            <td className="py-3 px-3 text-slate-600">{doc.department}</td>
                            <td className="py-3 px-3 text-center font-bold text-emerald-600 font-mono">{doc.completed}</td>
                            <td className="py-3 px-3 text-center font-bold text-amber-600 font-mono">{doc.pending}</td>
                            <td className="py-3 px-3 text-right font-bold text-slate-800 font-mono">{doc.totalAppointments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Financial Revenue */}
            {activeReportTab === 'revenue' && revenueReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Billed</span>
                    <span className="text-xl font-bold text-slate-800 font-mono">
                      ${Number(revenueReport.summary?.totalBilled || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-700 text-[10px] uppercase font-bold block">Total Collected</span>
                    <span className="text-xl font-bold text-emerald-800 font-mono">
                      ${Number(revenueReport.summary?.totalCollected || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-amber-700 text-[10px] uppercase font-bold block">Outstanding Balance</span>
                    <span className="text-xl font-bold text-amber-800 font-mono">
                      ${Number(revenueReport.summary?.totalOutstanding || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
                    <span className="text-teal-700 text-[10px] uppercase font-bold block">Collection Ratio</span>
                    <span className="text-xl font-bold text-teal-800 font-mono">
                      {revenueReport.summary?.collectionRate}%
                    </span>
                  </div>
                </div>

                {/* Breakdown by Payment Channel */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Collections by Payment Gateway / Settlement Method
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {Object.entries(revenueReport.paymentMethodsBreakdown || {}).map(([method, amt]) => (
                      <div key={method} className="p-3 rounded-2xl bg-white border border-slate-200">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{method}</span>
                        <span className="text-lg font-bold text-primary font-mono">${Number(amt).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Patient Demographics */}
            {activeReportTab === 'patients' && patientReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Patients Active</span>
                    <span className="text-3xl font-extrabold text-slate-800 font-mono">{patientReport.totalPatients}</span>
                    <p className="text-[11px] text-slate-500">Registered across hospital database</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Gender Distribution</span>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Male:</span>
                        <strong className="font-mono">{patientReport.genderStats?.Male || 0}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Female:</span>
                        <strong className="font-mono">{patientReport.genderStats?.Female || 0}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Blood Group Diversity</span>
                    <div className="grid grid-cols-4 gap-1 text-[11px] font-mono text-center">
                      {Object.entries(patientReport.bloodGroupStats || {}).map(([bg, count]) => (
                        <div key={bg} className="p-1 rounded bg-slate-50 border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">{bg}</span>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
