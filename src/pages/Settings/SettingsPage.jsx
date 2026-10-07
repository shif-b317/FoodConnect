import React, { useState } from 'react';
import { FiBell, FiShield, FiLock, FiCheck } from 'react-icons/fi';

const SettingsPage = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Preferences</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">Platform Settings</h1>
      </div>

      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#4A2523] border-b border-[#E7DED1] pb-3">Notification Settings</h2>

        {saved && (
          <div className="p-3 bg-[#E8F0E6] text-[#5F8F65] border border-[#C7DFC4] text-xs font-medium rounded-fc-md flex items-center space-x-2">
            <FiCheck className="w-4 h-4" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <div className="space-y-4 text-xs text-[#2D2422]">
          <label className="flex items-center justify-between p-4 bg-[#F8EFE1]/50 border border-[#E8D8C1] rounded-fc-lg cursor-pointer">
            <div>
              <span className="font-bold text-[#4A2523] block text-sm">Email Notifications</span>
              <span className="text-[#746B66]">Receive updates when donations are accepted or assignments updated.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="accent-[#4A2523] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-[#F8EFE1]/50 border border-[#E8D8C1] rounded-fc-lg cursor-pointer">
            <div>
              <span className="font-bold text-[#4A2523] block text-sm">SMS & Pickup Reminders</span>
              <span className="text-[#746B66]">Receive urgent SMS dispatches when volunteers arrive for pickup.</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="accent-[#4A2523] w-4 h-4"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-[#E7DED1]">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
