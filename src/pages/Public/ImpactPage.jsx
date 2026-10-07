import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MetricBlock from '../../components/common/MetricBlock';
import { FiHeart, FiBox, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';

const ImpactPage = () => {
  const { impactMetrics } = useApp();
  const [eventGuests, setEventGuests] = useState(250);

  // Simple impact estimator for donor events
  const estimatedSurplusMeals = Math.round(eventGuests * 0.25);
  const estimatedCo2SavedKg = Math.round(estimatedSurplusMeals * 1.8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Social & Environmental Impact</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#4A2523]">
          Rescuing Meals, Preserving Dignity
        </h1>
        <p className="text-lg text-[#746B66] leading-relaxed">
          Every meal redirected from disposal to a community table reduces greenhouse gas emissions and serves families.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricBlock icon={FiHeart} value={impactMetrics.mealsServed} label="Total Meals Served" subtitle="To verified NGO hubs" />
        <MetricBlock icon={FiBox} value={impactMetrics.foodRescuedKg} label="Food Waste Prevented" subtitle="Redirected from landfills" />
        <MetricBlock icon={FiUsers} value={impactMetrics.eventsConnected} label="Events Connected" subtitle="Weddings & banquets" />
        <MetricBlock icon={FiShield} value={impactMetrics.partnerNgos} label="Partner NGOs" subtitle="Verified community shelters" />
      </div>

      {/* Impact Calculator Widget */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 lg:p-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Estimate Your Event's Redistribution Impact</h2>
            <p className="text-sm text-[#746B66]">Adjust guest size to estimate potential meal rescue from your upcoming event.</p>
          </div>

          <div className="space-y-4 bg-[#F8EFE1] border border-[#E8D8C1] p-6 rounded-fc-lg">
            <div className="flex justify-between items-center text-sm font-bold text-[#4A2523]">
              <label htmlFor="guest-slider">Expected Event Guests:</label>
              <span className="text-lg font-serif text-[#4A2523]">{eventGuests} Guests</span>
            </div>
            <input
              id="guest-slider"
              type="range"
              min="50"
              max="2000"
              step="50"
              value={eventGuests}
              onChange={(e) => setEventGuests(Number(e.target.value))}
              className="w-full accent-[#4A2523] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-[#F7F2E9] border border-[#E7DED1] p-5 rounded-fc-lg">
              <div className="text-3xl font-serif font-bold text-[#4A2523]">~{estimatedSurplusMeals}</div>
              <div className="text-xs font-semibold text-[#746B66] mt-1">Potential Meals Rescued</div>
            </div>
            <div className="bg-[#F7F2E9] border border-[#E7DED1] p-5 rounded-fc-lg">
              <div className="text-3xl font-serif font-bold text-[#5F8F65]">~{estimatedCo2SavedKg} kg</div>
              <div className="text-xs font-semibold text-[#746B66] mt-1">Estimated CO₂e Emissions Prevented</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImpactPage;
