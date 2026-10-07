import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import MetricBlock from '../../components/common/MetricBlock';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { FiTruck, FiMapPin, FiCheckCircle, FiClock, FiArrowRight, FiCheck } from 'react-icons/fi';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { donations, acceptAssignment } = useApp();
  const navigate = useNavigate();

  // Active assignment for this volunteer
  const activeAssignment = donations.find(d => 
    d.volunteerId === user?.uid &&
    ['PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS'].includes(d.status)
  );

  // Unassigned accepted donations available for volunteers to claim
  const availableAssignments = donations.filter(d => 
    d.status === 'ACCEPTED' && !d.volunteerId
  );

  const completedAssignments = donations.filter(d => 
    d.volunteerId === user?.uid &&
    (d.status === 'COMPLETED' || d.status === 'DELIVERED')
  );

  const handleAcceptAssignment = async (donationId) => {
    const res = await acceptAssignment(donationId);

    if (res.success) {
      navigate(`/volunteer/tracking/${donationId}`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Volunteer Dispatch</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F0E6] text-[#5F8F65] border border-[#C7DFC4]">Active Volunteer</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#4A2523]">
            Welcome Back, {user?.name || 'Rahul Sharma'}!
          </h1>
          <p className="text-sm text-[#746B66] mt-1">
            Vehicle: Motorcycle with Insulated Carrier • Transporting meals safely
          </p>
        </div>

        <Link
          to="/volunteer/assignments"
          className="px-5 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors shadow-sm self-start sm:self-center"
        >
          View All Assignments ({availableAssignments.length})
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricBlock icon={FiTruck} value={activeAssignment ? '1 Active' : 'None'} label="Current Active Assignment" subtitle="In progress" />
        <MetricBlock icon={FiCheckCircle} value={48 + completedAssignments.length} label="Completed Pickups" subtitle="Lifetime deliveries" />
        <MetricBlock icon={FiClock} value="120 hrs" label="Volunteered Hours" subtitle="Community service" />
      </div>

      {/* Active Assignment Highlight Callout */}
      {activeAssignment && (
        <div className="bg-[#F8EFE1] border border-[#E8D8C1] rounded-fc-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8D8C1] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B98228] animate-pulse" />
              <span className="font-serif font-bold text-lg text-[#4A2523]">Active Transport In Progress</span>
            </div>
            <Badge status={activeAssignment.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#2D2422]">
            <div>
              <span className="font-bold text-[#4A2523] block">Event Venue:</span>
              <p>{activeAssignment.eventName} ({activeAssignment.pickupLocation?.address})</p>
            </div>
            <div>
              <span className="font-bold text-[#4A2523] block">Destination NGO:</span>
              <p>{activeAssignment.ngoName}</p>
            </div>
            <div>
              <span className="font-bold text-[#4A2523] block">Food Quantity:</span>
              <p>{activeAssignment.quantity}</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => navigate(`/volunteer/tracking/${activeAssignment.id}`)}
              className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] transition-colors flex items-center space-x-2"
            >
              <span>Open Live Tracking & Update Status</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Available Pickup Assignments List */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7DED1] pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#4A2523]">Available Pickup Assignments</h2>
            <p className="text-xs text-[#746B66]">Donations accepted by NGOs waiting for volunteer pickup</p>
          </div>
          <span className="text-xs font-bold text-[#D7A94C]">{availableAssignments.length} Available</span>
        </div>

        {availableAssignments.length === 0 ? (
          <EmptyState
            title="No unassigned pickups available"
            description="There are currently no accepted donations waiting for volunteer pickup in your area."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableAssignments.map((item) => (
              <div key={item.id} className="bg-[#F8EFE1]/40 border border-[#E8D8C1] rounded-fc-lg p-5 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#746B66]">#{item.id}</span>
                    <Badge status={item.status} />
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
                  <p className="text-xs text-[#2D2422] font-semibold">{item.foodType} • {item.quantity}</p>

                  <div className="bg-[#FFFDF8] p-3 rounded-fc-md border border-[#E7DED1] text-xs space-y-1.5 text-[#2D2422]">
                    <p className="flex items-start gap-1">
                      <FiMapPin className="text-[#D7A94C] shrink-0 mt-0.5" />
                      <span><strong className="text-[#4A2523]">Pickup:</strong> {item.pickupLocation?.address}</span>
                    </p>
                    <p className="flex items-start gap-1">
                      <FiTruck className="text-[#557A8A] shrink-0 mt-0.5" />
                      <span><strong className="text-[#4A2523]">Deliver To NGO:</strong> {item.ngoName}</span>
                    </p>
                    <p><strong className="text-[#4A2523]">Window:</strong> {item.pickupWindow?.date} ({item.pickupWindow?.from} - {item.pickupWindow?.to})</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8D8C1] flex items-center justify-between">
                  <span className="text-[11px] text-[#746B66]">Est. Distance: ~3.5 km</span>
                  <button
                    onClick={() => handleAcceptAssignment(item.id)}
                    className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] transition-colors flex items-center space-x-1"
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                    <span>Accept Assignment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default VolunteerDashboard;
