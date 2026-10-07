import React from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiCheckSquare, FiTruck, FiSmile, FiShield, FiClock } from 'react-icons/fi';

const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Operational Clarity</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#4A2523]">
          How Redistribution Works
        </h1>
        <p className="text-lg text-[#746B66] leading-relaxed">
          Step-by-step walkthrough of how event hosts, verified NGOs, and pickup volunteers coordinate to prevent food waste.
        </p>
      </div>

      {/* Role Workflows */}
      <div className="space-y-12">
        
        {/* Donor Journey */}
        <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
          <div className="flex items-center space-x-3 text-[#4A2523] border-b border-[#E7DED1] pb-4">
            <FiBox className="w-6 h-6 text-[#D7A94C]" />
            <h2 className="text-2xl font-serif font-bold">1. For Donors (Event Hosts & Caterers)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 1: Post Available Food</span>
              <p className="text-[#746B66]">Enter event details, quantity of meals, preparation time, and pickup address.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 2: Get Acceptance Notice</span>
              <p className="text-[#746B66]">A verified NGO reviews the post and accepts it. A volunteer is assigned for transport.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 3: Hand Over & Track</span>
              <p className="text-[#746B66]">Hand over food boxes to the volunteer and receive live completion updates.</p>
            </div>
          </div>
        </div>

        {/* NGO Journey */}
        <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
          <div className="flex items-center space-x-3 text-[#4A2523] border-b border-[#E7DED1] pb-4">
            <FiShield className="w-6 h-6 text-[#D7A94C]" />
            <h2 className="text-2xl font-serif font-bold">2. For Verified NGOs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 1: Discover Nearby Donations</span>
              <p className="text-[#746B66]">Browse real-time listings of surplus meals matching your serving capacity.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 2: Accept Donation</span>
              <p className="text-[#746B66]">Claim the donation. The system locks it to prevent duplicate acceptance.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 3: Receive & Distribute</span>
              <p className="text-[#746B66]">Volunteer delivers food directly to your community kitchen for immediate serving.</p>
            </div>
          </div>
        </div>

        {/* Volunteer Journey */}
        <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
          <div className="flex items-center space-x-3 text-[#4A2523] border-b border-[#E7DED1] pb-4">
            <FiTruck className="w-6 h-6 text-[#D7A94C]" />
            <h2 className="text-2xl font-serif font-bold">3. For Volunteers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 1: Accept Pickup Assignment</span>
              <p className="text-[#746B66]">Select available route assignments between donor event location and NGO.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 2: Collect & Transport</span>
              <p className="text-[#746B66]">Inspect container sealing, verify temperature, and transport safely.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-[#4A2523]">Step 3: Confirm Delivery</span>
              <p className="text-[#746B66]">Hand over food at NGO shelter and mark assignment completed in app.</p>
            </div>
          </div>
        </div>

      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/register"
          className="inline-flex items-center px-8 py-3.5 bg-[#4A2523] text-[#FFF9F0] text-base font-bold rounded-fc-md hover:bg-[#351816] transition-colors"
        >
          Get Started Today
        </Link>
      </div>

    </div>
  );
};

export default HowItWorksPage;
