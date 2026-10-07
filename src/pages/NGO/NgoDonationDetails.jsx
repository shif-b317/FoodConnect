import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { FiArrowLeft, FiCheck, FiMapPin, FiPhone, FiShield, FiTruck, FiAlertCircle } from 'react-icons/fi';

const NgoDonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donations, acceptDonation } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const item = donations.find(d => d.id === id);

  if (!item) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Donation Record Not Found</h2>
        <button onClick={() => navigate('/ngo/dashboard')} className="px-4 py-2 bg-[#4A2523] text-white text-xs font-bold rounded">
          Back to NGO Dashboard
        </button>
      </div>
    );
  }

  const handleConfirmAccept = async () => {
    const res = await acceptDonation(item.id);

    if (res.success) {
      setModalOpen(false);
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-bold text-[#4A2523] hover:underline"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to Overview</span>
      </button>

      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DED1] pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#746B66]">Ref #{item.id}</span>
              <Badge status={item.status} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#4A2523]">{item.eventName}</h1>
            <p className="text-sm text-[#746B66] mt-1">{item.eventType} • Posted by {item.donorName}</p>
          </div>

          {item.status === 'AVAILABLE' && (
            <button
              onClick={() => { setErrorMsg(''); setModalOpen(true); }}
              className="px-6 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-bold rounded-fc-md hover:bg-[#351816] transition-colors flex items-center space-x-2 shadow-sm self-start sm:self-center"
            >
              <FiCheck className="w-4 h-4" />
              <span>Accept Donation</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-fc-lg overflow-hidden border border-[#E7DED1] h-64">
              <img src={item.imageUrl} alt={item.eventName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xl text-[#4A2523]">Surplus Food Details</h3>
              <p className="text-sm text-[#2D2422] leading-relaxed">{item.description}</p>
              
              <div className="grid grid-cols-2 gap-4 bg-[#F8EFE1]/50 p-4 rounded-fc-lg border border-[#E8D8C1] text-xs">
                <div>
                  <span className="font-bold text-[#4A2523] block">Food Category</span>
                  <span className="text-[#2D2422]">{item.foodType}</span>
                </div>
                <div>
                  <span className="font-bold text-[#4A2523] block">Quantity</span>
                  <span className="text-[#2D2422]">{item.quantity} (~{item.estimatedMeals} meals)</span>
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

            <div className="space-y-3 pt-2">
              <h4 className="font-serif font-bold text-base text-[#4A2523] flex items-center space-x-2">
                <FiShield className="w-4 h-4 text-[#5F8F65]" />
                <span>Food Safety & Packaging Confirmation</span>
              </h4>
              <div className="bg-[#FFFDF8] border border-[#E7DED1] p-4 rounded-fc-md text-xs space-y-1.5 text-[#2D2422]">
                <p><span className="font-bold text-[#4A2523]">Temperature Protocol:</span> {item.foodSafetyInfo?.temperatureMaintained || 'Kept hot above 60°C'}</p>
                <p><span className="font-bold text-[#4A2523]">Container Type:</span> {item.foodSafetyInfo?.containerType || 'Sealed food-grade urns'}</p>
                <p><span className="font-bold text-[#4A2523]">Allergen Notice:</span> {item.foodSafetyInfo?.allergens || 'Standard Vegetarian'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8EFE1] border border-[#E8D8C1] rounded-fc-xl p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#4A2523] border-b border-[#E8D8C1] pb-2">
                Pickup & Logistics Info
              </h3>

              <div className="text-xs space-y-3 text-[#2D2422]">
                <div>
                  <span className="font-bold text-[#4A2523] block mb-0.5">Donor Venue Address:</span>
                  <p className="flex items-start gap-1"><FiMapPin className="text-[#D7A94C] shrink-0 mt-0.5" /> {item.pickupLocation?.address}, {item.pickupLocation?.city}</p>
                </div>

                <div>
                  <span className="font-bold text-[#4A2523] block mb-0.5">Donor Phone Contact:</span>
                  <p className="flex items-center gap-1"><FiPhone className="text-[#D7A94C]" /> {item.donorName} ({item.donorPhone})</p>
                </div>

                {item.volunteerName ? (
                  <div className="p-3 bg-[#E8F0E6] rounded-fc-md border border-[#C7DFC4] text-[#5F8F65]">
                    <span className="font-bold block flex items-center gap-1"><FiTruck /> Assigned Volunteer:</span>
                    <p>{item.volunteerName} ({item.volunteerPhone || '+91 98989 89898'})</p>
                  </div>
                ) : (
                  <div className="p-3 bg-[#F8EBCB] rounded-fc-md border border-[#E8D8C1] text-[#B98228]">
                    <span className="font-bold block">Logistics Status:</span>
                    <p>Upon NGO acceptance, a volunteer will be dispatched for pickup.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Acceptance">
        <div className="space-y-4 text-sm text-[#2D2422]">
          <p>Accept <span className="font-bold text-[#4A2523]">{item.eventName}</span> for redistribution?</p>
          {errorMsg && (
            <div className="p-3 bg-[#F5E3E0] text-[#B84C46] text-xs rounded-fc-md flex items-center space-x-2">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          <div className="pt-4 flex justify-end space-x-3">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border text-xs">Cancel</button>
            <button onClick={handleConfirmAccept} className="px-5 py-2 bg-[#4A2523] text-white text-xs font-bold">Confirm & Accept</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default NgoDonationDetails;
