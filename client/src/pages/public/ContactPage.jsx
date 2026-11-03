import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, PhoneCall, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            Hospital Helpdesk & Locations
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Contact i_CarePlus Hospital</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about outpatient consultations, admissions, or administrative support? We are here to assist you 24/7.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900">24/7 Trauma Emergency Hotline</h3>
                <p className="text-xs text-rose-700 mt-0.5">Direct triage dispatch for ambulance and acute medical trauma.</p>
                <p className="text-lg font-black text-rose-600 font-mono mt-2">+1 (800) 911-CARE</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft space-y-5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Medical Center Address</p>
                  <p className="mt-0.5">742 Evergreen Healthcare Ave, Medical District, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">General OPD Reception</p>
                  <p className="mt-0.5 font-semibold text-slate-800">+1 (800) 422-7375</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Email Inquiries</p>
                  <p className="mt-0.5">contact@icareplus.com | billing@icareplus.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Working Hours</p>
                  <p className="mt-0.5">Emergency & Inpatient: <strong>24/7 Non-stop</strong></p>
                  <p className="text-slate-500">Outpatient (OPD): Mon - Sat 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-soft">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Send a Message to Patient Relations</h2>
            <p className="text-xs text-slate-500 mb-6">We typically respond to online inquiries within 2-4 business hours.</p>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-800">Message Received!</h4>
                <p className="text-xs text-emerald-700">Thank you for reaching out. Our patient liaison will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Appointment Inquiry / Records"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message or Medical Question *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe how we can assist you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-sm shadow-md shadow-secondary/20 transition-all"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
