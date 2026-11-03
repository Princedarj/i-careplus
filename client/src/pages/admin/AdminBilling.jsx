import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  PlusCircle, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Eye, 
  FileText, 
  DollarSign 
} from 'lucide-react';
import { billingService } from '../../services/billingService';
import { patientService } from '../../services/patientService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InvoiceModal from '../../components/admin/InvoiceModal';
import InvoicePrintModal from '../../components/patient/InvoicePrintModal';

const AdminBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = () => {
    setLoading(true);
    billingService.getAllInvoices({
      status: statusFilter,
      search: searchTerm
    })
      .then((res) => {
        if (res.invoices) {
          setInvoices(res.invoices);
          setSummary(res.summary || {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    patientService.getAllPatients().then(res => {
      if (res.patients) setPatients(res.patients);
    });
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, searchTerm]);

  const handleUpdateStatus = async (invoice, newStatus) => {
    try {
      await billingService.updateStatus(invoice.id, {
        status: newStatus,
        paymentMethod: newStatus === 'PAID' ? 'CASH' : null
      });
      fetchInvoices();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hospital Billing & Accounts</h2>
          <p className="text-xs text-slate-400 mt-0.5">Generate invoices, verify payments, track receivables, and print financial receipts</p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Issue New Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Billed"
          value={`$${Number(summary.totalAmount || 0).toLocaleString()}`}
          subtitle={`${summary.totalBills || 0} Total invoices`}
          icon={FileText}
          color="navy"
        />
        <StatCard
          title="Revenue Collected"
          value={`$${Number(summary.paidAmount || 0).toLocaleString()}`}
          subtitle={`${summary.paidBills || 0} Paid accounts`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Outstanding Receivable"
          value={`$${Number(summary.pendingAmount || 0).toLocaleString()}`}
          subtitle={`${summary.pendingBills || 0} Pending accounts`}
          icon={Clock}
          color={summary.pendingBills > 0 ? "rose" : "teal"}
        />
        <StatCard
          title="Collection Rate"
          value={summary.totalAmount > 0 ? `${((summary.paidAmount / summary.totalAmount) * 100).toFixed(1)}%` : '100%'}
          subtitle="Hospital clearance index"
          icon={CreditCard}
          color="teal"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, patient or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex gap-1.5">
            {['ALL', 'PENDING', 'PAID'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving hospital billing invoices..." />
        ) : invoices.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-2">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Invoices Found</h4>
            <p className="text-xs text-slate-400">Click "Issue New Invoice" to generate a patient bill.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Service Description</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Total Due</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-secondary">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {inv.patient?.user?.name}
                      <span className="font-normal text-[10px] text-slate-400 block">PAT-#{inv.patientId}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-[200px] truncate">
                      {inv.title}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {new Date(inv.issueDate).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      ${Number(inv.totalAmount).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge status={inv.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => handleUpdateStatus(inv, 'PAID')}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}

                      {inv.status !== 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(inv, 'PENDING')}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold transition-colors"
                        >
                          Mark Pending
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-secondary hover:bg-slate-100 transition-colors"
                        title="View / Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Generate Modal */}
      {showGenerateModal && (
        <InvoiceModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          patients={patients}
          onSuccess={() => fetchInvoices()}
        />
      )}

      {/* Invoice Print Modal */}
      {selectedInvoice && (
        <InvoicePrintModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
};

export default AdminBilling;
