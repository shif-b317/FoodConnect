import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiLock, FiCheck } from 'react-icons/fi';

const SettingsPage = () => {
  const { user, updateNotificationPreferences, changePassword } = useAuth();
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(user?.notificationPreferences?.email ?? true);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const savePreferences = async () => {
    setBusy(true);
    setError('');
    const result = await updateNotificationPreferences({ email: emailAlerts });
    setBusy(false);
    if (result.success) setSaved(true);
    else setError(result.error || 'Could not save preferences.');
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    const result = await changePassword(currentPassword, newPassword);
    setBusy(false);
    if (result.success) navigate('/login', { replace: true });
    else setError(result.error || 'Could not change your password.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[#E7DED1] pb-5"><span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Preferences</span><h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">Platform Settings</h1></div>

      <section className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#4A2523] border-b border-[#E7DED1] pb-3 flex items-center gap-2"><FiBell /> Notification Settings</h2>
        {saved && <div role="status" className="p-3 bg-[#E8F0E6] text-[#5F8F65] border border-[#C7DFC4] text-xs font-medium rounded-fc-md flex items-center space-x-2"><FiCheck className="w-4 h-4" /><span>Settings saved successfully.</span></div>}
        {error && <div role="alert" className="p-3 bg-[#F5E3E0] text-[#B84C46] border border-[#ECC9C5] text-xs rounded-fc-md">{error}</div>}
        <label className="flex items-center justify-between p-4 bg-[#F8EFE1]/50 border border-[#E8D8C1] rounded-fc-lg cursor-pointer">
          <div><span className="font-bold text-[#4A2523] block text-sm">Email Notifications</span><span className="text-xs text-[#746B66]">Receive direct updates when your donation or NGO application changes.</span></div>
          <input type="checkbox" checked={emailAlerts} onChange={(event) => { setEmailAlerts(event.target.checked); setSaved(false); }} className="accent-[#4A2523] w-4 h-4" />
        </label>
        <p className="text-xs text-[#746B66]">In-app notifications remain enabled. SMS delivery is not configured.</p>
        <button type="button" disabled={busy} onClick={savePreferences} className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] disabled:opacity-60">{busy ? 'Saving…' : 'Save Preferences'}</button>
      </section>

      <section className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#4A2523] border-b border-[#E7DED1] pb-3 flex items-center gap-2"><FiLock /> Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div><label htmlFor="current-password" className="block text-xs font-bold text-[#4A2523] mb-1">Current Password</label><input id="current-password" type="password" required autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label htmlFor="new-password" className="block text-xs font-bold text-[#4A2523] mb-1">New Password</label><input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm" /></div>
            <div><label htmlFor="confirm-password" className="block text-xs font-bold text-[#4A2523] mb-1">Confirm New Password</label><input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm" /></div>
          </div>
          <button type="submit" disabled={busy} className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] disabled:opacity-60">{busy ? 'Updating…' : 'Change Password'}</button>
        </form>
      </section>
    </div>
  );
};

export default SettingsPage;
