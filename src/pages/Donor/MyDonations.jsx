import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { FiEye, FiSearch, FiFilter } from 'react-icons/fi';

const MyDonations = () => {
  const { donations } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = donations.filter(d => {
    const matchesSearch = d.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || d.foodType.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && d.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DED1] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">History & Status</span>
          <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">My Surplus Donations</h1>
        </div>
        <button
          onClick={() => navigate('/donor/donate')}
          className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816]"
        >
          Post New Donation
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <FiSearch className="w-4 h-4 text-[#958B85] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event or food type..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#F7F2E9] border border-[#E7DED1] rounded-fc-md text-xs text-[#2D2422] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-[#746B66] font-medium shrink-0 flex items-center gap-1">
            <FiFilter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'AVAILABLE', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-fc-sm capitalize transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-[#4A2523] text-[#FFF9F0]'
                  : 'bg-[#F7F2E9] text-[#746B66] hover:text-[#4A2523]'
              }`}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No donations found"
          description="Try clearing your search filters or create a new surplus donation post."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-5 space-y-4 flex flex-col justify-between">
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
                    <p className="text-xs text-[#2D2422] font-medium">{item.foodType}</p>
                    <p className="text-xs text-[#746B66] mt-1">{item.quantity} ({item.estimatedMeals} meals)</p>
                  </div>
                </div>

                <div className="bg-[#F8EFE1]/50 p-3 rounded-fc-md text-xs space-y-1 text-[#2D2422]">
                  <p><span className="font-bold text-[#4A2523]">Location:</span> {item.pickupLocation?.address}</p>
                  <p><span className="font-bold text-[#4A2523]">Pickup Window:</span> {item.pickupWindow?.date} ({item.pickupWindow?.from} - {item.pickupWindow?.to})</p>
                  {item.ngoName && <p className="text-[#557A8A] font-semibold">Accepted by: {item.ngoName}</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7DED1] flex justify-between items-center">
                <span className="text-[11px] text-[#958B85]">
                  Posted: {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => navigate(`/donor/donations/${item.id}`)}
                  className="px-3.5 py-1.5 border border-[#4A2523] text-[#4A2523] text-xs font-medium rounded-fc-md hover:bg-[#F8EFE1] flex items-center space-x-1"
                >
                  <FiEye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyDonations;
