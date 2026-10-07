import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

const AcceptedDonations = () => {
  const { donations } = useApp();
  const navigate = useNavigate();

  const acceptedList = donations.filter(d => 
    d.status !== 'AVAILABLE' && d.status !== 'CANCELLED'
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">NGO Inventory</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">Accepted Donations History</h1>
        <p className="text-sm text-[#746B66] mt-1">Manage and view active or completed donations claimed by your organization.</p>
      </div>

      {acceptedList.length === 0 ? (
        <EmptyState
          title="No accepted donations yet"
          description="You have not claimed any surplus food postings."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {acceptedList.map((item) => (
            <div key={item.id} className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#746B66]">#{item.id}</span>
                <Badge status={item.status} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#4A2523]">{item.eventName}</h3>
              <p className="text-xs text-[#2D2422]">{item.foodType} • {item.quantity}</p>
              <div className="pt-2 border-t border-[#E7DED1] flex justify-between items-center">
                <span className="text-[11px] text-[#746B66]">Accepted: {new Date(item.acceptedAt || item.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => navigate(`/ngo/donations/${item.id}`)}
                  className="px-3 py-1.5 border border-[#4A2523] text-[#4A2523] text-xs font-medium rounded-fc-md hover:bg-[#F8EFE1]"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedDonations;
