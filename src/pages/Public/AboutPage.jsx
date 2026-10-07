import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiShield, FiUsers, FiAward } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Our Mission</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#4A2523]">
          Good Food Deserves to be Shared, Not Wasted
        </h1>
        <p className="text-lg text-[#746B66] leading-relaxed">
          FOOD CONNECT was created to bridge the gap between event surplus cooked food and local community organizations working to end hunger.
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold text-[#4A2523]">The Problem We Address</h2>
          <p className="text-base text-[#2D2422] leading-relaxed">
            Large celebrations — weddings, parties, corporate summits, and religious festivals — frequently generate substantial amounts of freshly prepared, untouched cooked food. Without a reliable logistics channel, safe food is discarded.
          </p>
          <p className="text-base text-[#2D2422] leading-relaxed">
            Meanwhile, verified local shelters and community kitchens often struggle to meet daily meal demands. FOOD CONNECT acts as the coordination layer that makes food redistribution fast, accountable, and repeatable.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
            >
              Join the Platform
            </Link>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1610057099443-f63a152d19eb?auto=format&fit=crop&q=80&w=800"
            alt="Warm community food distribution"
            className="w-full h-[380px] object-cover rounded-fc-lg border border-[#E7DED1]"
          />
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-[#4A2523]">Core Principles</h2>
          <p className="text-sm text-[#746B66] mt-1">Guiding every workflow and feature we design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] flex items-center justify-center border border-[#E8D8C1]">
              <FiTarget className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">Mission First</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              Every feature serves one goal: moving safe surplus food efficiently from events to people in need.
            </p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] flex items-center justify-center border border-[#E8D8C1]">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">Uncompromising Trust</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              NGO verification, strict food safety reporting, and transparent status updates build confidence for all participants.
            </p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] flex items-center justify-center border border-[#E8D8C1]">
              <FiUsers className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">Human-Centered Design</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              Respectful, hopeful messaging celebrating community welfare without stigmatizing food recipients.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutPage;
