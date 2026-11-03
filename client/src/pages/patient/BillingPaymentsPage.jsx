import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ShieldAlert, 
  Eye, 
  ArrowUpRight 
} from 'lucide-react';
import { billingService } from '../../services/billingService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InvoicePrintModal from '../../components/patient/InvoicePrintModal';
import PaymentModal from '../../components/patient/PaymentModal';

const BillingPaymentsPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentInvoice, setPaymentInvoice] = useState(null);

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
    fetchInvoices();
  }, [statusFilter, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Patient Billing & Payments</h2>
          <p className="text-xs text-slate-400 mt-0.5">Review consultation invoices, payment receipts, and settle outstanding balances</p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Payment Gateway Enabled (Academic Simulation)</span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Billed Invoices"
          value={summary.totalBills ?? 0}
          subtitle={`Total $${Number(summary.totalAmount || 0).toFixed(2)}`}
          icon={FileText}
          color="navy"
        />
        <StatCard
          title="Paid Invoices"
          value={summary.paidBills ?? 0}
          subtitle={`Cleared $${Number(summary.paidAmount || 0).toFixed(2)}`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Invoices"
          value={summary.pendingBills ?? 0}
          subtitle={`Balance due to hospital`}
          icon={Clock}
          color={summary.pendingBills > 0 ? "rose" : "teal"}
        />
        <StatCard
          title="Total Outstanding"
          value={`$${Number(summary.pendingAmount || 0).toFixed(2)}`}
          subtitle="Awaiting demo settlement"
          icon={CreditCard}
          color={summary.pendingAmount > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number or description..."
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
          <LoadingSpinner text="Retrieving hospital invoices..." />
        ) : invoices.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-2">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Invoices Found</h4>
            <p className="text-xs text-slate-400">All consultation fees and services have zero outstanding dues.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Invoice ID</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Department / Doctor</th>
                  <th className="py-3.5 px-5">Issue Date</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-secondary">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-800 max-w-[200px] truncate">
                      {inv.title}
                    </td>

                    <td className="py-4 px-5 text-slate-600">
                      {inv.appointment?.doctor?.user?.name || 'General OPD'}
                      <span className="text-[10px] text-slate-400 block">{inv.appointment?.department?.name}</span>
                    </td>

                    <td className="py-4 px-5 text-slate-500 font-mono">
                      {new Date(inv.issueDate).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-5 font-mono font-bold text-slate-800">
                      ${Number(inv.totalAmount).toFixed(2)}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <Badge status={inv.status} />
                    </td>

                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-secondary hover:border-secondary font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Printer className="w-3 h-3" /> View / Print
                      </button>

                      {inv.status === 'PENDING' && (
                        <button
                          onClick={() => setPaymentInvoice(inv)}
                          className="px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all inline-flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" /> Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Printable Modal */}
      {selectedInvoice && (
        <InvoicePrintModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}

      {/* Simulated Payment Modal */}
      {paymentInvoice && (
        <PaymentModal
          isOpen={!!paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          invoice={paymentInvoice}
          onSuccess={() => fetchInvoices()}
        />
      )}
    </div>
  );
};

export default BillingPaymentsPage;
