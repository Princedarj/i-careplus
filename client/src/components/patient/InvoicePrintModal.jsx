import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { Printer, Activity, CheckCircle, ShieldCheck } from 'lucide-react';

const InvoicePrintModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const patient = invoice.patient || {};
  const patientUser = patient.user || {};
  const appointment = invoice.appointment || {};
  const doctor = appointment.doctor || {};
  const doctorUser = doctor.user || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hospital Medical Invoice" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Printable Paper Canvas */}
        <div id="printable-invoice" className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm print:border-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-primary gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <Activity className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-primary tracking-tight">
                  i_<span className="text-secondary">CarePlus</span> Hospital
                </h2>
                <p className="text-xs text-slate-500 font-medium">Billing & Patient Financial Services</p>
                <p className="text-[11px] text-slate-400">742 Evergreen Healthcare Ave, NY | Tax ID: US-99482103</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Official Invoice</span>
              <p className="text-lg font-black text-primary font-mono">{invoice.invoiceNumber}</p>
              <Badge status={invoice.status} className="mt-1" />
            </div>
          </div>

          {/* Billing info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Billed To (Patient)</p>
              <p className="text-sm font-bold text-slate-800">{patientUser.name || 'Valued Patient'}</p>
              <p className="text-slate-600">{patientUser.phone || 'Phone not on record'}</p>
              <p className="text-slate-600">{patientUser.email || ''}</p>
              {patient.address && <p className="text-slate-500">{patient.address}</p>}
            </div>

            <div className="sm:text-right space-y-1">
              <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Invoice Metadata</p>
              <p className="text-slate-600">Issue Date: <span className="font-semibold text-slate-800">{new Date(invoice.issueDate).toLocaleDateString()}</span></p>
              {invoice.dueDate && (
                <p className="text-slate-600">Due Date: <span className="font-semibold text-slate-800">{new Date(invoice.dueDate).toLocaleDateString()}</span></p>
              )}
              {invoice.paymentMethod && (
                <p className="text-slate-600">Payment Channel: <span className="font-semibold text-slate-800 uppercase">{invoice.paymentMethod}</span></p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 my-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Service Dept</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {invoice.title}
                    {invoice.description && (
                      <p className="text-[11px] font-normal text-slate-500 mt-0.5">{invoice.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {appointment.department?.name || 'General OPD'}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-mono">1</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800 font-mono">
                    ${Number(invoice.totalAmount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total summary */}
          <div className="flex justify-end my-6 text-xs">
            <div className="w-64 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">${Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hospital Care Tax / Levy:</span>
                <span className="font-mono text-emerald-600">$0.00 (Waived)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-800 border-t border-slate-200 pt-2">
                <span>Total Amount:</span>
                <span className="font-mono text-primary">${Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold text-emerald-600">${Number(invoice.paidAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-t border-slate-100 pt-1 text-slate-700">
                <span>Balance Due:</span>
                <span className="font-mono text-rose-600">${Number(invoice.balance || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment receipt confirmation block */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Payment Verified ({invoice.payments[0].paymentMethod}) – Trans Ref: <strong className="font-mono">{invoice.payments[0].transactionId}</strong></span>
              </div>
              <span className="font-semibold">{new Date(invoice.payments[0].paymentDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Bottom disclaimer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between items-center">
            <span>Computer-generated medical invoice. No physical signature required.</span>
            <span className="font-semibold text-slate-600">i_CarePlus Medical Accounts</span>
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
            <Printer className="w-4 h-4" /> Print / Save Invoice
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoicePrintModal;
