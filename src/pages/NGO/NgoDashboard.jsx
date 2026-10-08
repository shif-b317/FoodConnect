import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import MetricBlock from '../../components/common/MetricBlock';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { FiShield, FiBox, FiCheckCircle, FiCheck, FiEye, FiSearch, FiMapPin, FiAlertCircle } from 'react-icons/fi';

const NgoDashboard = () => {
  const { user } = useAuth();
  const { donations, acceptDonation } = useApp();
  const navigate = useNavigate();

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const availableDonations = donations.filter(d => d.status === 'AVAILABLE');
  const acceptedByMe = donations.filter(d => d.ngoId === user?.uid);
  const completedDeliveries = acceptedByMe.filter(d => d.status === 'COMPLETED' || d.status === 'DELIVERED');

  const handleOpenAcceptModal = (item) => {
    setSelectedDonation(item);
    setActionError('');
    setModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedDonation) return;
    const res = await acceptDonation(selectedDonation.id);

    if (res.success) {
      setModalOpen(false);
      navigate(`/ngo/donations/${selectedDonation.id}`);
    } else {
      setActionError(res.error);
    }
  };

  if (user?.verificationStatus !== 'VERIFIED') {
    const rejected = user?.verificationStatus === 'REJECTED';
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
          <FiShield className="w-10 h-10 text-[#D7A94C] mx-auto" />
          <Badge status={rejected ? 'REJECTED' : 'PENDING'} />
          <h1 className="text-3xl font-serif font-bold text-[#4A2523]">
            {rejected ? 'NGO application needs an update' : 'NGO verification is in review'}
          </h1>
          <p className="text-sm text-[#746B66] max-w-xl mx-auto">
            {rejected
              ? 'Your organization cannot accept donations until the application is approved. Review the admin note and contact FOOD CONNECT support if you need to resubmit.'
              : 'Your organization can explore FOOD CONNECT after an admin verifies its registration details. Donation acceptance will be enabled once approved.'}
          </p>
          {user?.registrationNumber && <p className="text-xs text-[#746B66]">Registration number: {user.registrationNumber}</p>}
          {user?.verificationNote && (
            <div className="text-sm text-[#4A2523] bg-[#F8EFE1] border border-[#E8D8C1] rounded-fc-md p-4 text-left">
              <strong>Review note:</strong> {user.verificationNote}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">NGO Dashboard</span>
            <Badge status={user.verificationStatus} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#4A2523]">
            {user?.organization || 'Hope Shelter & Community Kitchen'}
          </h1>
          <p className="text-sm text-[#746B66] mt-1">
            Registration no: {user.registrationNumber || 'Not provided'}
          </p>
        </div>

        <Link
          to="/ngo/nearby-donations"
          className="px-5 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors shadow-sm self-start sm:self-center"
        >
          Discover Nearby Food
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricBlock icon={FiBox} value={availableDonations.length} label="Available Nearby Surplus" subtitle="Ready for acceptance" />
        <MetricBlock icon={FiShield} value={acceptedByMe.length} label="Active Accepted Posts" subtitle="In pickup/transit" />
        <MetricBlock icon={FiCheckCircle} value={completedDeliveries.length} label="Completed Distributions" subtitle="Meals served" />
      </div>

      {/* Section 1: Available Nearby Donations Feed */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7DED1] pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#4A2523]">Available Surplus Food Near You</h2>
            <p className="text-xs text-[#746B66]">Event hosts with prepared meals ready for NGO pickup</p>
          </div>
          <Link to="/ngo/nearby-donations" className="text-xs font-bold text-[#4A2523] hover:underline">
            View All ({availableDonations.length})
          </Link>
        </div>

        {availableDonations.length === 0 ? (
          <EmptyState
            title="No available surplus food currently"
            description="All posted event donations in your city have been claimed. Check back shortly for new postings."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableDonations.map((item) => (
              <div key={item.id} className="bg-[#F8EFE1]/40 border border-[#E8D8C1] rounded-fc-lg p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#746B66]">#{item.id}</span>
                    <Badge status={item.status} />
                  </div>

                  <div className="flex space-x-3">
                    <img
                      src={item.imageUrl}
                      alt={item.eventName}
                      className="w-16 h-16 rounded-fc-md object-cover border border-[#E7DED1] shrink-0"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
                      <p className="text-xs text-[#2D2422] font-semibold">{item.foodType}</p>
                      <p className="text-xs text-[#746B66]">{item.quantity} ({item.estimatedMeals} meals)</p>
                    </div>
                  </div>

                  <div className="text-xs text-[#2D2422] space-y-1 bg-[#FFFDF8] p-3 rounded-fc-md border border-[#E7DED1]">
                    <p className="flex items-center gap-1"><FiMapPin className="text-[#D7A94C]" /> {item.pickupLocation?.address}</p>
                    <p><span className="font-semibold text-[#4A2523]">Preparation:</span> {item.preparationTime}</p>
                    <p><span className="font-semibold text-[#4A2523]">Pickup Window:</span> Today ({item.pickupWindow?.from} - {item.pickupWindow?.to})</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8D8C1] flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/ngo/donations/${item.id}`)}
                    className="text-xs font-medium text-[#746B66] hover:text-[#4A2523] underline"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenAcceptModal(item)}
                    className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] transition-colors flex items-center space-x-1"
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                    <span>Accept Donation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Active Accepted Donations List */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#4A2523] border-b border-[#E7DED1] pb-3">
          Accepted Donations Progress
        </h2>

        {acceptedByMe.length === 0 ? (
          <p className="text-sm text-[#746B66] text-center py-6">You have not accepted any active donations yet.</p>
        ) : (
          <div className="divide-y divide-[#E7DED1]">
            {acceptedByMe.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-[#746B66]">#{item.id}</span>
                    <Badge status={item.status} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
                  <p className="text-xs text-[#2D2422]">{item.foodType} • {item.quantity}</p>
                  {item.volunteerName ? (
                    <p className="text-xs text-[#5F8F65] font-semibold">
                      Volunteer Transport: {item.volunteerName} ({item.volunteerPhone})
                    </p>
                  ) : (
                    <p className="text-xs text-[#B98228]">Awaiting Volunteer Assignment...</p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/ngo/donations/${item.id}`)}
                  className="px-4 py-2 border border-[#4A2523] text-[#4A2523] text-xs font-medium rounded-fc-md hover:bg-[#F8EFE1] shrink-0 self-start md:self-center"
                >
                  Track Donation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accept Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Donation Acceptance"
      >
        {selectedDonation && (
          <div className="space-y-4 text-sm text-[#2D2422]">
            <p>
              Are you sure your organization <span className="font-bold text-[#4A2523]">{user?.organization || 'Hope Shelter'}</span> wishes to accept <span className="font-bold text-[#4A2523]">{selectedDonation.eventName}</span>?
            </p>

            <div className="bg-[#F8EFE1] p-4 rounded-fc-md border border-[#E8D8C1] text-xs space-y-1">
              <p><span className="font-bold">Food Summary:</span> {selectedDonation.foodType}</p>
              <p><span className="font-bold">Quantity:</span> {selectedDonation.quantity} (~{selectedDonation.estimatedMeals} meals)</p>
              <p><span className="font-bold">Pickup Address:</span> {selectedDonation.pickupLocation?.address}</p>
            </div>

            {actionError && (
              <div className="p-3 bg-[#F5E3E0] border border-[#ECC9C5] text-[#B84C46] text-xs rounded-fc-md flex items-center space-x-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-3 border-t border-[#E7DED1]">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-[#E7DED1] text-[#746B66] text-xs font-medium rounded-fc-md hover:bg-[#F7F2E9]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAccept}
                className="px-5 py-2 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816]"
              >
                Confirm & Accept Donation
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default NgoDashboard;
