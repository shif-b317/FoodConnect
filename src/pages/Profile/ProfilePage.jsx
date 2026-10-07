import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import { FiUser, FiMail, FiPhone, FiHome, FiCheck } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Shifali Rao');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 11223');
  const [organization, setOrganization] = useState(user?.organization || 'Grand Celebrations Co.');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Account Settings</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">User & Organization Profile</h1>
      </div>

      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
        <div className="flex items-center space-x-4 border-b border-[#E7DED1] pb-6">
          <div className="w-16 h-16 rounded-full bg-[#4A2523] text-[#FFF9F0] font-serif font-bold text-2xl flex items-center justify-center">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#4A2523]">{name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-[#746B66]">{user?.email}</span>
              <Badge status={user?.role?.toUpperCase() || 'DONOR'} />
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-[#E8F0E6] text-[#5F8F65] border border-[#C7DFC4] text-xs font-medium rounded-fc-md flex items-center space-x-2">
            <FiCheck className="w-4 h-4" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A2523] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A2523] mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A2523] mb-1">Organization / Venue Name</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A2523] mb-1">Email (Primary Account)</label>
            <input
              type="email"
              disabled
              value={user?.email || 'shifali@foodconnect.org'}
              className="w-full px-3.5 py-2.5 bg-[#F7F2E9] border border-[#E7DED1] rounded-fc-md text-sm text-[#746B66] cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816]"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
