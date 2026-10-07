import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import { FiArrowLeft, FiCheckCircle, FiClock, FiMapPin, FiNavigation, FiPhone, FiShield, FiTruck } from 'react-icons/fi';

const VolunteerTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donations, updateDonationStatus } = useApp();

  const item = donations.find(d => d.id === id);

  if (!item) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Tracking Assignment Not Found</h2>
        <button onClick={() => navigate('/volunteer/dashboard')} className="px-4 py-2 bg-[#4A2523] text-white text-xs font-bold rounded">
          Back to Volunteer Dashboard
        </button>
      </div>
    );
  }

  const [actionError, setActionError] = useState('');

  const handleNextStatusStep = async () => {
    let nextStatus = 'PICKUP_IN_PROGRESS';
    if (item.status === 'PICKUP_ASSIGNED') nextStatus = 'PICKUP_IN_PROGRESS';
    else if (item.status === 'PICKUP_IN_PROGRESS') nextStatus = 'PICKED_UP';
    else if (item.status === 'PICKED_UP') nextStatus = 'DELIVERY_IN_PROGRESS';
    else if (item.status === 'DELIVERY_IN_PROGRESS') nextStatus = 'DELIVERED';
    else if (item.status === 'DELIVERED') nextStatus = 'COMPLETED';

    const result = await updateDonationStatus(item.id, nextStatus);
    setActionError(result.success ? '' : result.error);
  };

  const timelineSteps = [
    { status: 'ACCEPTED', label: 'Assignment Accepted', done: ['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.acceptedAt },
    { status: 'PICKUP_IN_PROGRESS', label: 'En Route to Pickup Venue', done: ['PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.pickupStartedAt },
    { status: 'PICKED_UP', label: 'Food Picked Up & Container Sealed', done: ['PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.pickedUpAt },
    { status: 'DELIVERY_IN_PROGRESS', label: 'En Route to NGO Shelter', done: ['DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.deliveryStartedAt },
    { status: 'DELIVERED', label: 'Food Delivered & Confirmed', done: ['DELIVERED', 'COMPLETED'].includes(item.status), time: item.completedAt || item.deliveredAt }
  ];

  const getActionButtonText = () => {
    switch (item.status) {
      case 'ACCEPTED':
      case 'PICKUP_ASSIGNED': return 'Start Pickup Route';
      case 'PICKUP_IN_PROGRESS': return 'Confirm Food Picked Up';
      case 'PICKED_UP': return 'Start Delivery to NGO';
      case 'DELIVERY_IN_PROGRESS': return 'Confirm Delivery at NGO';
      case 'DELIVERED': return 'Mark Assignment Completed';
      default: return 'Completed';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-bold text-[#4A2523] hover:underline"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to Assignments</span>
      </button>

      {/* Main Container */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 space-y-8">
        
        {/* Title & Action Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DED1] pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#746B66]">Route #{item.id}</span>
              <Badge status={item.status} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#4A2523]">{item.eventName}</h1>
            <p className="text-sm text-[#746B66] mt-1">{item.foodType} • {item.quantity}</p>
          </div>

          {['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED'].includes(item.status) && (
            <button
              onClick={handleNextStatusStep}
              className="px-6 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-bold rounded-fc-md hover:bg-[#351816] transition-colors flex items-center space-x-2 shadow-md self-start sm:self-center"
            >
              <FiCheckCircle className="w-5 h-5 text-[#D7A94C]" />
              <span>{getActionButtonText()}</span>
            </button>
          )}
        </div>
        {actionError && <p className="text-sm text-[#B84C46]" role="alert">{actionError}</p>}

        {/* Grid: Map & Operational Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Styled Route Map Mockup */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Map Mockup Area */}
            <div className="relative bg-[#F7F2E9] border border-[#E7DED1] rounded-fc-xl h-80 p-6 overflow-hidden flex flex-col justify-between">
              
              {/* Map Canvas Styling */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4A2523_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Distance Info Banner */}
              <div className="relative z-10 bg-[#FFFDF8]/95 backdrop-blur-md border border-[#E7DED1] p-3 rounded-fc-lg flex items-center justify-between text-xs text-[#2D2422]">
                <div className="flex items-center space-x-2">
                  <FiNavigation className="w-4 h-4 text-[#D7A94C]" />
                  <span className="font-bold text-[#4A2523]">Distance: 3.4 km</span>
                </div>
                <span className="text-[#746B66]">Est. Travel: ~12 mins</span>
              </div>

              {/* Simulated Map Visual Route */}
              <div className="relative z-10 my-auto flex items-center justify-between px-6">
                
                {/* Donor Venue Marker */}
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#4A2523] text-[#D7A94C] flex items-center justify-center mx-auto shadow-md border-2 border-[#FFFDF8]">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#4A2523] block max-w-[100px] truncate">{item.pickupLocation?.address || 'Event Venue'}</span>
                  <span className="text-[10px] text-[#746B66] block">Pickup</span>
                </div>

                {/* Animated Transport Path */}
                <div className="flex-1 mx-4 relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-[#D7A94C]" />
                  <div className="absolute p-2 bg-[#FFFDF8] rounded-full border border-[#E7DED1] shadow-sm text-[#4A2523]">
                    <FiTruck className="w-5 h-5 animate-pulse" />
                  </div>
                </div>

                {/* NGO Marker */}
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#5F8F65] text-[#FFF9F0] flex items-center justify-center mx-auto shadow-md border-2 border-[#FFFDF8]">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#4A2523] block max-w-[100px] truncate">{item.ngoName || 'Hope Shelter'}</span>
                  <span className="text-[10px] text-[#746B66] block">Delivery</span>
                </div>

              </div>

              {/* Bottom Instructions */}
              <div className="relative z-10 bg-[#FFFDF8]/90 p-2.5 rounded-fc-md border border-[#E7DED1] text-[11px] text-[#746B66] text-center">
                Press "<strong className="text-[#4A2523]">{getActionButtonText()}</strong>" above as you complete each route milestone.
              </div>

            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FFFDF8] border border-[#E7DED1] p-4 rounded-fc-lg space-y-1">
                <span className="font-bold text-[#4A2523] block">1. Pickup Address (Event Venue)</span>
                <p className="text-[#2D2422]">{item.pickupLocation?.address}, {item.pickupLocation?.city}</p>
                <p className="text-[#746B66] pt-1">Contact: {item.donorName} ({item.donorPhone})</p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#E7DED1] p-4 rounded-fc-lg space-y-1">
                <span className="font-bold text-[#4A2523] block">2. Delivery Address (NGO Hub)</span>
                <p className="text-[#2D2422]">{item.ngoName}</p>
                <p className="text-[#746B66]">{item.ngoAddress || '14 Heritage Road, Mangalore'}</p>
              </div>
            </div>

          </div>

          {/* Right Column: Timeline Tracking */}
          <div className="lg:col-span-5 bg-[#F8EFE1]/60 border border-[#E8D8C1] rounded-fc-xl p-6 space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#4A2523] border-b border-[#E8D8C1] pb-3">
              Route Progress Timeline
            </h3>

            <div className="space-y-6 relative pl-4 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8D8C1]">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start space-x-4">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                    step.done ? 'bg-[#5F8F65] text-[#FFF9F0]' : 'bg-[#E7DED1] text-[#746B66]'
                  }`}>
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className={`font-bold ${step.done ? 'text-[#4A2523]' : 'text-[#746B66]'}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-[11px] text-[#746B66] mt-0.5">
                        {new Date(step.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default VolunteerTracking;
