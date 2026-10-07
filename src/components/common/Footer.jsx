import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShield, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#4A2523] text-[#FFF9F0] pt-16 pb-12 border-t border-[#351816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#6B403C]">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-fc-md bg-[#FFFDF8] text-[#4A2523] flex items-center justify-center font-bold text-lg shadow-sm">
                FC
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#FFF9F0]">
                FOOD CONNECT
              </span>
            </div>
            <p className="text-sm text-[#E8D8C1] max-w-sm leading-relaxed">
              Connecting event hosts with verified NGOs and volunteer network to ensure safe, surplus cooked food reaches people who need it most.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#D7A94C]">
              <FiShield className="w-4 h-4" />
              <span>Verified NGO Network • Strict Food Safety Standards</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#D7A94C] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-[#E8D8C1]">
              <li><Link to="/" className="hover:text-[#FFF9F0] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#FFF9F0] transition-colors">About Mission</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#FFF9F0] transition-colors">How It Works</Link></li>
              <li><Link to="/impact" className="hover:text-[#FFF9F0] transition-colors">Social Impact</Link></li>
              <li><Link to="/faq" className="hover:text-[#FFF9F0] transition-colors">FAQ & Guidance</Link></li>
            </ul>
          </div>

          {/* Col 3: Workflows */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#D7A94C] mb-4">Get Involved</h4>
            <ul className="space-y-2.5 text-sm text-[#E8D8C1]">
              <li><Link to="/register?role=donor" className="hover:text-[#FFF9F0] transition-colors">Donate Surplus Food</Link></li>
              <li><Link to="/register?role=ngo" className="hover:text-[#FFF9F0] transition-colors">Register as Verified NGO</Link></li>
              <li><Link to="/register?role=volunteer" className="hover:text-[#FFF9F0] transition-colors">Become a Volunteer</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFF9F0] transition-colors">Partner With Us</Link></li>
              <li><Link to="/login" className="hover:text-[#FFF9F0] transition-colors">Account Login</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#D7A94C] mb-4">Contact Support</h4>
            <ul className="space-y-3 text-sm text-[#E8D8C1]">
              <li className="flex items-start space-x-2.5">
                <FiMapPin className="w-4 h-4 text-[#D7A94C] shrink-0 mt-0.5" />
                <span>Central Coordination Office, Mangalore, KA</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FiMail className="w-4 h-4 text-[#D7A94C] shrink-0" />
                <span>support@foodconnect.org</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FiPhone className="w-4 h-4 text-[#D7A94C] shrink-0" />
                <span>+91 800-FOOD-CONNECT</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Food Safety & Legal Disclaimer */}
        <div className="py-6 border-b border-[#6B403C] text-xs text-[#E8D8C1]/80 space-y-2">
          <p className="font-semibold text-[#D7A94C]">Food Safety Notice & Operational Disclaimer:</p>
          <p>
            FOOD CONNECT facilitates non-monetary redistribution of freshly cooked surplus food from events. All food items must be unserved, hygienic, packed in clean food-grade containers, and stored within appropriate temperature windows. NGOs and volunteers inspect food condition prior to distribution.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8D8C1]/70">
          <p>© 2026 FOOD CONNECT Social Impact Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with care for zero food waste & stronger communities.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
