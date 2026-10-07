import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { FiCheck, FiMapPin, FiTruck } from 'react-icons/fi';

const AvailableAssignments = () => {
  const { donations, acceptAssignment } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const availableList = donations.filter(d => d.status === 'ACCEPTED' && !d.volunteerId);

  const handleAccept = async (donationId) => {
    const res = await acceptAssignment(donationId);
    if (res.success) {
      navigate(`/volunteer/tracking/${donationId}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Volunteer Route Assignments</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">Available Pickup Assignments</h1>
        <p className="text-sm text-[#746B66] mt-1">Select an open pickup route to transport surplus cooked food from event venues to NGO shelters.</p>
      </div>

      {availableList.length === 0 ? (
        <EmptyState
          title="No open assignments"
          description="All accepted donations currently have assigned pickup volunteers."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableList.map((item) => (
            <div key={item.id} className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#746B66]">#{item.id}</span>
                  <Badge status={item.status} />
                </div>
                <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
                <p className="text-xs text-[#2D2422] font-semibold">{item.foodType} • {item.quantity}</p>

                <div className="bg-[#F8EFE1]/50 p-3 rounded-fc-md text-xs space-y-1.5 text-[#2D2422] border border-[#E8D8C1]">
                  <p className="flex items-start gap-1"><FiMapPin className="text-[#D7A94C] shrink-0 mt-0.5" /> <strong>Pickup Address:</strong> {item.pickupLocation?.address}</p>
                  <p className="flex items-start gap-1"><FiTruck className="text-[#557A8A] shrink-0 mt-0.5" /> <strong>Deliver To NGO:</strong> {item.ngoName}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7DED1] flex items-center justify-between">
                <span className="text-[11px] text-[#746B66]">Pickup Window: {item.pickupWindow?.from} - {item.pickupWindow?.to}</span>
                <button
                  onClick={() => handleAccept(item.id)}
                  className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] flex items-center space-x-1"
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
  );
};

export default AvailableAssignments;
