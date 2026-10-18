import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Impact', path: '/impact' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ngo') return '/ngo/dashboard';
    if (user.role === 'volunteer') return '/volunteer/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/donor/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F2E9]/95 backdrop-blur-md border-b border-[#E7DED1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/food-connect-logo.png" alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
            <div>
              <span className="font-serif font-bold text-xl text-[#4A2523] tracking-tight block leading-tight">
                FOOD CONNECT
              </span>
              <span className="text-[10px] uppercase font-semibold text-[#746B66] tracking-widest block">
                Share. Rescue. Connect.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#4A2523] font-bold border-b-2 border-[#4A2523] pb-0.5'
                    : 'text-[#746B66] hover:text-[#4A2523]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Role Switcher & Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                
                <span className="px-3 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-xs font-semibold text-[#746B66] capitalize">
                  {user.role}
                </span>

                <NotificationDropdown />

                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-[#746B66] hover:text-[#4A2523] hover:bg-[#F8EFE1] rounded-fc-md transition-colors"
                  title="Log Out"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-[#4A2523] text-[#4A2523] text-sm font-medium rounded-fc-md hover:bg-[#F8EFE1] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {user && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A2523] hover:bg-[#F8EFE1] rounded-fc-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF8] border-b border-[#E7DED1] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-fc-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-[#F8EFE1] text-[#4A2523] font-bold'
                    : 'text-[#2D2422] hover:bg-[#F7F2E9]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E7DED1]">
            {user ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#F8EFE1] rounded-fc-md flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#746B66]">Active Role</p>
                    <p className="text-sm font-bold text-[#4A2523] capitalize">{user.role}</p>
                  </div>
                  <span className="text-sm font-bold text-[#4A2523] capitalize">{user.role}</span>
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="block w-full py-2 text-center border border-[#E7DED1] text-[#746B66] text-sm font-medium rounded-fc-md"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center border border-[#4A2523] text-[#4A2523] text-sm font-medium rounded-fc-md"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
