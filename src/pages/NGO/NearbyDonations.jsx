import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { FiSearch, FiMapPin, FiCheck, FiAlertCircle } from 'react-icons/fi';

const NearbyDonations = () => {
  const { donations, acceptDonation } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const availableList = donations.filter(d => 
    d.status === 'AVAILABLE' &&
    (d.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     d.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.pickupLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAccept = (item) => {
    setSelectedDonation(item);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedDonation) return;
    const res = await acceptDonation(selectedDonation.id);

    if (res.success) {
      setModalOpen(false);
      navigate(`/ngo/donations/${selectedDonation.id}`);
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Surplus Discovery</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">Discover Available Surplus Food</h1>
        <p className="text-sm text-[#746B66] mt-1">Browse active postings from events in your city and claim donations for your community kitchen.</p>
      </div>

      {/* Search Input */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] p-4 rounded-fc-lg flex items-center">
        <div className="relative w-full">
          <FiSearch className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event name, cuisine, address or venue..."
            className="w-full pl-10 pr-3.5 py-2 bg-[#F7F2E9] border border-[#E7DED1] rounded-fc-md text-xs text-[#2D2422] focus:outline-none"
          />
        </div>
      </div>

      {/* Available Cards */}
      {availableList.length === 0 ? (
        <EmptyState
          title="No available donations found"
          description="There are currently no unclaimed surplus food postings matching your query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableList.map((item) => (
            <div key={item.id} className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-5 space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#746B66]">#{item.id}</span>
                  <Badge status={item.status} />
                </div>

                <div className="flex space-x-3">
                  <img
                    src={item.imageUrl}
                    alt={item.eventName}
                    className="w-20 h-20 rounded-fc-md object-cover border border-[#E7DED1] shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
                    <p className="text-xs text-[#2D2422] font-semibold">{item.foodType}</p>
                    <p className="text-xs text-[#746B66]">{item.quantity} (~{item.estimatedMeals} meals)</p>
                    <p className="text-xs text-[#5F8F65] font-medium mt-1">Prepared: {item.preparationTime}</p>
                  </div>
                </div>

                <div className="bg-[#F8EFE1]/50 p-3 rounded-fc-md text-xs space-y-1 text-[#2D2422] border border-[#E8D8C1]">
                  <p className="flex items-center gap-1"><FiMapPin className="text-[#D7A94C]" /> {item.pickupLocation?.address}</p>
                  <p><span className="font-bold text-[#4A2523]">Pickup Window:</span> {item.pickupWindow?.date} ({item.pickupWindow?.from} - {item.pickupWindow?.to})</p>
                  <p><span className="font-bold text-[#4A2523]">Safety Info:</span> {item.foodSafetyInfo?.temperatureMaintained}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7DED1] flex items-center justify-between">
                <button
                  onClick={() => navigate(`/ngo/donations/${item.id}`)}
                  className="text-xs font-medium text-[#746B66] hover:text-[#4A2523] underline"
                >
                  View Details & Safety
                </button>
                <button
                  onClick={() => handleOpenAccept(item)}
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Acceptance"
      >
        {selectedDonation && (
          <div className="space-y-4 text-sm text-[#2D2422]">
            <p>
              Confirm acceptance of <span className="font-bold text-[#4A2523]">{selectedDonation.eventName}</span> for <span className="font-bold text-[#4A2523]">{user?.organization || 'Hope Shelter'}</span>?
            </p>
            {errorMsg && (
              <div className="p-3 bg-[#F5E3E0] text-[#B84C46] text-xs rounded-fc-md">
                {errorMsg}
              </div>
            )}
            <div className="pt-4 flex justify-end space-x-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border text-xs">Cancel</button>
              <button onClick={handleConfirmAccept} className="px-4 py-2 bg-[#4A2523] text-white text-xs font-bold">Confirm</button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default NearbyDonations;
