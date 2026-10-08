import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import MetricBlock from '../../components/common/MetricBlock';
import Badge from '../../components/common/Badge';
import { FiShield, FiUsers, FiBox, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [status, setStatus] = useState('PENDING');
  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });
  const [metrics, setMetrics] = useState({ totalDonations: 0, registeredVolunteers: 0, completionRate: 0 });
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  const refreshApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [response, metricsResponse] = await Promise.all([
        apiRequest(`/admin/ngos?status=${status}`),
        apiRequest('/admin/metrics'),
      ]);
      setApplications(response.data.items || []);
      setCounts(response.data.counts || { pending: 0, verified: 0, rejected: 0 });
      setMetrics(metricsResponse.data);
    } catch (requestError) {
      setError(requestError.message || 'Could not load NGO applications.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { refreshApplications(); }, [refreshApplications]);

  const reviewApplication = async (ngoId, nextStatus) => {
    const note = notes[ngoId] || '';
    if (nextStatus === 'REJECTED' && !note.trim()) {
      setError('Add a short review note before rejecting an application.');
      return;
    }
    setBusyId(ngoId);
    setError('');
    try {
      await apiRequest(`/admin/ngos/${ngoId}/verification`, {
        method: 'PATCH',
        body: { status: nextStatus, note },
      });
      await refreshApplications();
    } catch (requestError) {
      setError(requestError.message || 'Could not update the NGO application.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-[#E7DED1] pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Platform Administration</span>
        <h1 className="text-3xl font-serif font-bold text-[#4A2523] mt-1">FOOD CONNECT Oversight</h1>
        <p className="text-sm text-[#746B66] mt-1">Review NGO registration details before enabling donation acceptance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <MetricBlock icon={FiBox} value={metrics.totalDonations} label="Total Posts" subtitle="Platform donations" />
        <MetricBlock icon={FiShield} value={counts.verified} label="Verified NGOs" subtitle="Approved organizations" />
        <MetricBlock icon={FiUsers} value={counts.pending} label="Pending Review" subtitle="NGO applications" />
        <MetricBlock icon={FiUsers} value={metrics.registeredVolunteers} label="Volunteers" subtitle="Registered accounts" />
        <MetricBlock icon={FiCheckCircle} value={`${metrics.completionRate}%`} label="Completion Rate" subtitle="Completed donation workflows" />
      </div>

      <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DED1] pb-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#4A2523]">NGO Applications</h2>
            <p className="text-xs text-[#746B66] mt-1">Check the organization and government registration number before approval.</p>
          </div>
          <label className="text-xs font-bold text-[#4A2523]">
            Show{' '}
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="ml-1 p-2 border border-[#E7DED1] rounded-fc-md bg-[#FFFDF8]">
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
              <option value="ALL">All</option>
            </select>
          </label>
        </div>

        {error && <div role="alert" className="p-3 bg-[#F5E3E0] border border-[#ECC9C5] text-[#B84C46] text-sm rounded-fc-md">{error}</div>}
        {loading ? (
          <p className="text-sm text-[#746B66] py-4">Loading applications…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-[#746B66] py-4">No {status === 'ALL' ? '' : `${status.toLowerCase()} `}NGO applications found.</p>
        ) : (
          <div className="divide-y divide-[#E7DED1]">
            {applications.map((ngo) => (
              <article key={ngo.id} className="py-5 first:pt-0 last:pb-0 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-[#4A2523]">{ngo.organization || 'Unnamed organization'}</h3>
                      <Badge status={ngo.verificationStatus} />
                    </div>
                    <p className="text-xs text-[#746B66]">Registration number: {ngo.registrationNumber || 'Not provided'}</p>
                    {ngo.verificationEvidenceUrl && <a href={ngo.verificationEvidenceUrl} target="_blank" rel="noreferrer" className="inline-block text-xs font-bold text-[#557A8A] underline">Open registration evidence</a>}
                    <p className="text-xs text-[#746B66]">Contact: {ngo.name} · {ngo.email}{ngo.phone ? ` · ${ngo.phone}` : ''}</p>
                    <p className="text-[11px] text-[#958B85]">Applied {ngo.createdAt ? new Date(ngo.createdAt).toLocaleDateString() : 'date unavailable'}</p>
                    {ngo.verificationNote && <p className="text-xs text-[#4A2523]">Previous review note: {ngo.verificationNote}</p>}
                  </div>
                  {ngo.verificationStatus === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <button type="button" disabled={busyId === ngo.id} onClick={() => reviewApplication(ngo.id, 'VERIFIED')} className="px-4 py-2 bg-[#4A2523] text-[#FFF9F0] text-xs font-bold rounded-fc-md disabled:opacity-50">
                        {busyId === ngo.id ? 'Saving…' : 'Approve'}
                      </button>
                    </div>
                  )}
                </div>
                {ngo.verificationStatus === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      maxLength={1000}
                      value={notes[ngo.id] || ''}
                      onChange={(event) => setNotes((current) => ({ ...current, [ngo.id]: event.target.value }))}
                      placeholder="Review note (required to reject)"
                      aria-label={`Review note for ${ngo.organization || ngo.name}`}
                      className="flex-1 px-3 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm"
                    />
                    <button type="button" disabled={busyId === ngo.id} onClick={() => reviewApplication(ngo.id, 'REJECTED')} className="px-4 py-2 border border-[#ECC9C5] text-[#B84C46] text-xs font-bold rounded-fc-md disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
