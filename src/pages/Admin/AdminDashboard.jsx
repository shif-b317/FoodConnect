import React from 'react';
import { useApp } from '../../context/AppContext';
import MetricBlock from '../../components/common/MetricBlock';
import Badge from '../../components/common/Badge';
import { initialNgos } from '../../data/mockData';
import { FiShield, FiUsers, FiBox, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { donations } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Platform Administration</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">FOOD CONNECT Oversight</h1>
        <p className="text-sm text-[#746B66] mt-1">Manage verified NGOs, monitor active logistics, and view system metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <MetricBlock icon={FiBox} value={donations.length} label="Total Posts" subtitle="Platform donations" />
        <MetricBlock icon={FiShield} value={initialNgos.length} label="Verified NGOs" subtitle="Active shelters" />
        <MetricBlock icon={FiUsers} value="840" label="Registered Volunteers" subtitle="Active network" />
        <MetricBlock icon={FiCheckCircle} value="98.5%" label="Delivery Success" subtitle="Completion rate" />
      </div>

      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#4A2523] border-b border-[#E7DED1] pb-3">Registered NGO Verification Status</h2>

        <div className="divide-y divide-[#E7DED1]">
          {initialNgos.map((ngo) => (
            <div key={ngo.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-base text-[#4A2523]">{ngo.organizationName}</span>
                  <Badge status={ngo.verificationStatus} />
                </div>
                <p className="text-xs text-[#746B66]">{ngo.registrationNumber} • {ngo.address}</p>
                <p className="text-xs text-[#2D2422]">Contact: {ngo.contactPerson} ({ngo.email})</p>
              </div>

              <span className="px-3 py-1 bg-[#E8F0E6] text-[#5F8F65] border border-[#C7DFC4] rounded-fc-sm text-xs font-bold self-start sm:self-center">
                Verified Hub
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
