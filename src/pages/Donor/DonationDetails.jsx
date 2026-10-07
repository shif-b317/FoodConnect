import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import { FiArrowLeft, FiCheckCircle, FiClock, FiMapPin, FiPhone, FiShield, FiTruck, FiUser, FiXCircle } from 'react-icons/fi';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donations, cancelDonation } = useApp();

  const item = donations.find(d => d.id === id);

  if (!item) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Donation Record Not Found</h2>
        <p className="text-sm text-[#746B66]">The requested donation reference ID #{id} does not exist.</p>
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="px-4 py-2 bg-[#4A2523] text-white text-xs font-bold rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Lifecycle Steps Determination
  const steps = [
    { key: 'CREATED', label: 'Donation Posted', done: true, time: item.createdAt },
    { key: 'AVAILABLE', label: 'Available to Verified NGOs', done: true, time: item.createdAt },
    { key: 'ACCEPTED', label: 'Accepted by NGO', done: ['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.acceptedAt },
    { key: 'PICKUP_ASSIGNED', label: 'Volunteer Assigned for Transport', done: ['PICKUP_ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.assignmentAcceptedAt },
    { key: 'PICKED_UP', label: 'Food Picked Up from Venue', done: ['PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED'].includes(item.status), time: item.pickedUpAt },
    { key: 'DELIVERED', label: 'Delivered to NGO & Meals Served', done: ['DELIVERED', 'COMPLETED'].includes(item.status), time: item.completedAt || item.deliveredAt }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-bold text-[#4A2523] hover:underline"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Container */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DED1] pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#746B66]">Reference #{item.id}</span>
              <Badge status={item.status} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#4A2523]">{item.eventName}</h1>
            <p className="text-sm text-[#746B66] mt-1">{item.eventType} • Posted by {item.donorName}</p>
          </div>

          {item.status === 'AVAILABLE' && (
            <button
              onClick={async () => {
                const result = await cancelDonation(item.id);
                if (result.success) navigate('/donor/dashboard');
              }}
              className="px-4 py-2 bg-[#F5E3E0] text-[#B84C46] border border-[#ECC9C5] text-xs font-bold rounded-fc-md hover:bg-[#ECC9C5] self-start sm:self-center"
            >
              Cancel Donation Post
            </button>
          )}
        </div>

        {/* Grid: Details & Lifecycle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Food Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-fc-lg overflow-hidden border border-[#E7DED1] h-64">
              <img
                src={item.imageUrl}
                alt={item.eventName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xl text-[#4A2523]">Surplus Food Information</h3>
              <p className="text-sm text-[#2D2422] leading-relaxed">{item.description}</p>
              
              <div className="grid grid-cols-2 gap-4 bg-[#F8EFE1]/50 p-4 rounded-fc-lg border border-[#E8D8C1] text-xs">
                <div>
                  <span className="font-bold text-[#4A2523] block">Cuisine & Dishes</span>
                  <span className="text-[#2D2422]">{item.foodType}</span>
                </div>
                <div>
                  <span className="font-bold text-[#4A2523] block">Quantity & Meals</span>
                  <span className="text-[#2D2422]">{item.quantity} ({item.estimatedMeals} meals)</span>
                </div>
                <div>
                  <span className="font-bold text-[#4A2523] block">Preparation Time</span>
                  <span className="text-[#2D2422]">{item.preparationTime}</span>
                </div>
                <div>
                  <span className="font-bold text-[#4A2523] block">Pickup Window</span>
                  <span className="text-[#2D2422]">{item.pickupWindow?.date} ({item.pickupWindow?.from} - {item.pickupWindow?.to})</span>
                </div>
              </div>
            </div>

            {/* Location & Safety */}
            <div className="space-y-3 pt-2">
              <h4 className="font-serif font-bold text-base text-[#4A2523] flex items-center space-x-2">
                <FiMapPin className="w-4 h-4 text-[#D7A94C]" />
                <span>Pickup Address & Contacts</span>
              </h4>
              <div className="bg-[#FFFDF8] border border-[#E7DED1] p-4 rounded-fc-md text-xs space-y-1.5 text-[#2D2422]">
                <p><span className="font-bold text-[#4A2523]">Address:</span> {item.pickupLocation?.address}, {item.pickupLocation?.city}</p>
                <p><span className="font-bold text-[#4A2523]">Donor Contact:</span> {item.donorName} ({item.donorPhone})</p>
              </div>
            </div>

            {/* NGO & Volunteer Info when assigned */}
            {(item.ngoName || item.volunteerName) && (
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-base text-[#4A2523]">Assigned Logistics Partners</h4>
                <div className="bg-[#E4EDF0]/50 border border-[#C3D7DF] p-4 rounded-fc-md text-xs space-y-2 text-[#2D2422]">
                  {item.ngoName && (
                    <div className="flex items-center space-x-2 text-[#557A8A]">
                      <FiShield className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="font-bold block">Accepting Verified NGO:</span>
                        <span>{item.ngoName} ({item.ngoAddress || 'Mangalore'})</span>
                      </div>
                    </div>
                  )}
                  {item.volunteerName && (
                    <div className="flex items-center space-x-2 text-[#4A2523] pt-1 border-t border-[#C3D7DF]">
                      <FiTruck className="w-4 h-4 text-[#D7A94C] shrink-0" />
                      <div>
                        <span className="font-bold block">Assigned Pickup Volunteer:</span>
                        <span>{item.volunteerName} ({item.volunteerPhone || '+91 98989 89898'})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Lifecycle Timeline */}
          <div className="lg:col-span-5 bg-[#F8EFE1]/60 border border-[#E8D8C1] rounded-fc-xl p-6 space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#4A2523] border-b border-[#E8D8C1] pb-3">
              Donation Lifecycle
            </h3>

            <div className="space-y-6 relative pl-4 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8D8C1]">
              {steps.map((step, idx) => (
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
                        {new Date(step.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8D8C1] text-xs text-[#746B66] space-y-2">
              <p className="font-semibold text-[#4A2523]">Live Status Notice:</p>
              <p>This timeline updates automatically as NGOs accept the donation and volunteers execute pickup & delivery.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DonationDetails;
