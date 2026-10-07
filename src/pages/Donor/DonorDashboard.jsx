import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import MetricBlock from '../../components/common/MetricBlock';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { FiPlusCircle, FiBox, FiCheckCircle, FiClock, FiEye, FiXCircle, FiTrendingUp } from 'react-icons/fi';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { donations, cancelDonation } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  // Filter donor's donations
  const donorDonations = donations.filter(d => d.donorId === user?.uid);

  const totalDonations = donorDonations.length;
  const activeDonations = donorDonations.filter(d => ['AVAILABLE', 'ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS'].includes(d.status)).length;
  const completedDonations = donorDonations.filter(d => d.status === 'COMPLETED' || d.status === 'DELIVERED').length;
  const totalMealsSaved = donorDonations.reduce((acc, curr) => acc + (curr.estimatedMeals || 0), 0);

  const filteredList = donorDonations.filter(d => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['AVAILABLE', 'ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS'].includes(d.status);
    if (filter === 'COMPLETED') return d.status === 'COMPLETED' || d.status === 'DELIVERED';
    return d.status === filter;
  });

  return (
    <div className="space-y-8">
      
      {/* Dashboard Greeting Header */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Donor Dashboard</span>
          <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">
            Good Day, {user?.name || 'Event Host'}!
          </h1>
          <p className="text-sm text-[#746B66] mt-1">
            {user?.organization || 'Event Host Partner'} • Thank you for keeping good food in circulation.
          </p>
        </div>
        <div>
          <Link
            to="/donor/donate"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors shadow-sm"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Post New Donation</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricBlock icon={FiBox} value={totalDonations} label="Total Donations Posted" subtitle="Lifetime postings" />
        <MetricBlock icon={FiClock} value={activeDonations} label="Active Donations" subtitle="Available or in transport" />
        <MetricBlock icon={FiCheckCircle} value={completedDonations} label="Completed Deliveries" subtitle="Delivered to NGOs" />
        <MetricBlock icon={FiTrendingUp} value={`${totalMealsSaved} Meals`} label="Estimated Meals Saved" subtitle="Community impact" />
      </div>

      {/* Action Banner Panel */}
      <div className="bg-[#F8EFE1] border border-[#E8D8C1] rounded-fc-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-[#4A2523]">Have Leftover Cooked Food After an Event?</h3>
          <p className="text-sm text-[#2D2422]">
            Post details within 1-2 hours of preparation to enable verified NGOs and local volunteers to handle pickup.
          </p>
        </div>
        <Link
          to="/donor/donate"
          className="px-5 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold uppercase tracking-wider rounded-fc-md hover:bg-[#351816] shrink-0 text-center"
        >
          Create Surplus Post
        </Link>
      </div>

      {/* Recent Donations List */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DED1]">
          <h2 className="text-xl font-serif font-bold text-[#4A2523]">My Surplus Food Posts</h2>
          
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-[#F7F2E9] p-1 rounded-fc-md border border-[#E7DED1] text-xs">
            {['ALL', 'ACTIVE', 'COMPLETED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 font-semibold rounded-fc-sm capitalize transition-all ${
                  filter === tab
                    ? 'bg-[#4A2523] text-[#FFF9F0]'
                    : 'text-[#746B66] hover:text-[#4A2523]'
                }`}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {filteredList.length === 0 ? (
          <EmptyState
            title="No donations found"
            description="You have not created any surplus food donations under this filter."
            actionLabel="Create Donation"
            onAction={() => navigate('/donor/donate')}
          />
        ) : (
          <div className="divide-y divide-[#E7DED1]">
            {filteredList.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.eventName}
                    className="w-16 h-16 rounded-fc-md object-cover border border-[#E7DED1] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-[#746B66]">#{item.id}</span>
                      <Badge status={item.status} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
                    <p className="text-xs text-[#2D2422]">
                      <span className="font-semibold text-[#4A2523]">{item.foodType}</span> • {item.quantity} ({item.estimatedMeals} meals)
                    </p>
                    <p className="text-xs text-[#746B66]">
                      Pickup: {item.pickupLocation?.address || 'Mangalore'} | {item.pickupWindow?.date} ({item.pickupWindow?.from} - {item.pickupWindow?.to})
                    </p>
                    {item.ngoName && (
                      <p className="text-xs text-[#557A8A] font-medium">
                        Accepted by: {item.ngoName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => navigate(`/donor/donations/${item.id}`)}
                    className="inline-flex items-center space-x-1 px-3.5 py-2 border border-[#E7DED1] text-[#4A2523] text-xs font-medium rounded-fc-md hover:bg-[#F8EFE1] transition-colors"
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    <span>View Lifecycle</span>
                  </button>

                  {item.status === 'AVAILABLE' && (
                    <button
                      onClick={() => cancelDonation(item.id, "Cancelled by donor")}
                      className="inline-flex items-center space-x-1 px-3 py-2 text-[#B84C46] hover:bg-[#F5E3E0] text-xs font-medium rounded-fc-md transition-colors"
                      title="Cancel Donation"
                    >
                      <FiXCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DonorDashboard;
