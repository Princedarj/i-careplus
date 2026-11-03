import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Calendar, Shield, User, Menu, X, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isPatient } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Departments', path: '/departments' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top emergency strip */}
      <div className="bg-primary text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-teal-300 font-medium">
            <PhoneCall className="w-3.5 h-3.5" /> 24/7 Emergency Line: +1 (800) 911-CARE
          </span>
          <span className="hidden md:inline text-slate-300">| OPD Hours: 8:00 AM - 8:00 PM</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/contact" className="hover:text-teal-300 transition-colors">Hospital Locations</Link>
          <span className="text-slate-400">•</span>
          <Link to="/admin/login" className="flex items-center gap-1 hover:text-teal-300 text-teal-200 font-semibold transition-colors">
            <Shield className="w-3.5 h-3.5" /> Staff / Admin
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-secondary/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-primary tracking-tight">
                i_<span className="text-secondary">CarePlus</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Hospital System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-secondary bg-teal-50'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/patient/dashboard'}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <User className="w-4 h-4 text-secondary" />
                  <span>{isAdmin ? 'Admin Workspace' : 'Patient Portal'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-primary hover:text-secondary hover:bg-slate-50 transition-colors"
                >
                  Patient Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:border-secondary hover:text-secondary transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              to={isAuthenticated ? (isPatient ? '/patient/book-appointment' : '/admin/appointments') : '/login'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-secondary-600 shadow-md shadow-secondary/20 hover:shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'text-secondary bg-teal-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/patient/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold bg-primary text-white"
              >
                Go to {isAdmin ? 'Admin Workspace' : 'Patient Portal'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-base font-bold text-primary bg-slate-100"
                >
                  Patient Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-base font-bold text-secondary border border-secondary"
                >
                  Create Patient Account
                </Link>
              </>
            )}
            <Link
              to={isAuthenticated ? '/patient/book-appointment' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-bold text-white bg-secondary"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
