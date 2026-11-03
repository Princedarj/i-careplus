import React, { useState } from 'react';
import Modal from '../common/Modal';
import { CreditCard, CheckCircle2, AlertCircle, ShieldAlert, Loader2, DollarSign } from 'lucide-react';
import { billingService } from '../../services/billingService';

const PaymentModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_DEMO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!invoice) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await billingService.payInvoice(invoice.id, {
        paymentMethod,
        notes: `Simulated Demo Settlement via ${paymentMethod}`
      });

      if (res.success) {
        setSuccessData(res);
        if (onSuccess) onSuccess(res.invoice);
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Simulated Bill Payment Portal" maxWidth="max-w-lg">
      {successData ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-slate-800">Payment Successful!</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            The demo payment of <strong className="text-slate-800 font-mono">${Number(invoice.totalAmount).toFixed(2)}</strong> has been processed and updated in the MySQL database.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-800">{successData.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice:</span>
              <span className="font-mono font-bold text-slate-800">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-600">PAID & VERIFIED</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-5">
          {/* Demo Academic Disclaimer Badge */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Simulated Academic Demo Payment</p>
              <p className="text-amber-700 text-[11px]">
                This is a mock sandbox workflow for college evaluation. No real bank accounts or real cards are billed.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bill summary card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">{invoice.invoiceNumber}</p>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[240px]">{invoice.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Payable</p>
              <p className="text-xl font-bold text-primary font-mono">${Number(invoice.totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {/* Select Simulated Channel */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Demo Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'ONLINE_DEMO', name: 'Instant Online Pay', desc: 'Simulated 1-click gateway' },
                { id: 'CARD', name: 'Demo Credit / Debit Card', desc: 'Mock card clearance' },
                { id: 'INSURANCE', name: 'Demo Insurance Claim', desc: 'Direct claim settlement' },
                { id: 'CASH', name: 'Hospital Desk Cash', desc: 'Counter receipt simulation' }
              ].map(method => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-secondary bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-800">{method.name}</p>
                  <p className="text-[10px] text-slate-500">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-sm shadow-md shadow-secondary/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Demo...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ${Number(invoice.totalAmount).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default PaymentModal;
