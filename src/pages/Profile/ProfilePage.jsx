import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import { FiCheck, FiShield } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [registrationNumber, setRegistrationNumber] = useState(user?.registrationNumber || '');
  const [verificationEvidenceUrl, setVerificationEvidenceUrl] = useState(user?.verificationEvidenceUrl || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    const profile = { name, phone };
    if (user?.role !== 'ngo') profile.organization = organization;
    else {
      profile.organization = organization;
      profile.registrationNumber = registrationNumber;
      profile.verificationEvidenceUrl = verificationEvidenceUrl;
    }
    const result = await updateProfile(profile);
    setSaving(false);
    if (result.success) setSaved(true);
    else setError(result.error || 'Could not update your profile.');
  };

  const ngoDetailsChanged = user?.role === 'ngo' && (organization !== user.organization || registrationNumber !== user.registrationNumber || verificationEvidenceUrl !== user.verificationEvidenceUrl);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Account Settings</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">User & Organization Profile</h1>
      </div>

      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
        <div className="flex items-center space-x-4 border-b border-[#E7DED1] pb-6">
          <div className="w-16 h-16 rounded-full bg-[#4A2523] text-[#FFF9F0] font-serif font-bold text-2xl flex items-center justify-center">{name.charAt(0) || '?'}</div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#4A2523]">{user?.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-[#746B66]">{user?.email}</span>
              <Badge status={user?.role?.toUpperCase() || 'DONOR'} />
              {user?.role === 'ngo' && <Badge status={user.verificationStatus} />}
            </div>
          </div>
        </div>

        {saved && <div role="status" className="p-3 bg-[#E8F0E6] text-[#5F8F65] border border-[#C7DFC4] text-xs font-medium rounded-fc-md flex items-center space-x-2"><FiCheck className="w-4 h-4" /><span>Profile details updated successfully.</span></div>}
        {error && <div role="alert" className="p-3 bg-[#F5E3E0] text-[#B84C46] border border-[#ECC9C5] text-xs rounded-fc-md">{error}</div>}
        {ngoDetailsChanged && <div className="p-3 bg-[#F8EBCB] text-[#805D20] border border-[#E8D8C1] text-xs rounded-fc-md flex items-start gap-2"><FiShield className="w-4 h-4 shrink-0" /><span>Changing NGO name or registration number sends the application back for verification.</span></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-bold text-[#4A2523] mb-1">Full Name</label>
              <input id="profile-name" type="text" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]" />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-xs font-bold text-[#4A2523] mb-1">Phone Number</label>
              <input id="profile-phone" type="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]" />
            </div>
          </div>

          <div>
            <label htmlFor="profile-organization" className="block text-xs font-bold text-[#4A2523] mb-1">Organization / Venue Name</label>
            <input id="profile-organization" type="text" required={user?.role === 'ngo'} maxLength={150} value={organization} onChange={(event) => setOrganization(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]" />
          </div>

          {user?.role === 'ngo' && <div>
            <label htmlFor="profile-registration" className="block text-xs font-bold text-[#4A2523] mb-1">Government Registration Number</label>
            <input id="profile-registration" type="text" required maxLength={80} value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]" />
          </div>}
          {user?.role === 'ngo' && <div>
            <label htmlFor="profile-evidence" className="block text-xs font-bold text-[#4A2523] mb-1">Registration Document Link (HTTPS)</label>
            <input id="profile-evidence" type="url" pattern="https://.*" value={verificationEvidenceUrl} onChange={(event) => setVerificationEvidenceUrl(event.target.value)} placeholder="https://drive.google.com/..." className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422]" />
          </div>}

          <div>
            <label htmlFor="profile-email" className="block text-xs font-bold text-[#4A2523] mb-1">Email (Primary Account)</label>
            <input id="profile-email" type="email" disabled value={user?.email || ''} className="w-full px-3.5 py-2.5 bg-[#F7F2E9] border border-[#E7DED1] rounded-fc-md text-sm text-[#746B66] cursor-not-allowed" />
          </div>

          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md hover:bg-[#351816] disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
