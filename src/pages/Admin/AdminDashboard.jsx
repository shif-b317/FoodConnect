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
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

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

  const metricDetails = {
    posts: { title: 'All Donation Posts', description: 'Every donation post recorded on the platform.' },
    verified_ngos: { title: 'Verified NGOs', description: 'Organizations approved by an administrator.' },
    pending_review: { title: 'NGOs Pending Review', description: 'NGO accounts awaiting administrator review.' },
    volunteers: { title: 'Registered Volunteers', description: 'Active volunteer accounts registered on the platform.' },
    completed: { title: 'Completed Donation Workflows', description: 'Donation workflows marked completed.' },
  };

  const loadDetails = async (type) => {
    setSelectedMetric(type);
    setDetailsLoading(true);
    setError('');
    try {
      const response = await apiRequest(`/admin/details?type=${type}`);
      setDetails(response.data.items || []);
    } catch (requestError) {
      setDetails([]);
      setError(requestError.message || 'Could not load the selected details.');
    } finally {
      setDetailsLoading(false);
    }
  };

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
        <MetricBlock icon={FiBox} value={metrics.totalDonations} label="Total Posts" subtitle="Platform donations" onClick={() => loadDetails('posts')} selected={selectedMetric === 'posts'} />
        <MetricBlock icon={FiShield} value={counts.verified} label="Verified NGOs" subtitle="Approved organizations" onClick={() => loadDetails('verified_ngos')} selected={selectedMetric === 'verified_ngos'} />
        <MetricBlock icon={FiUsers} value={counts.pending} label="Pending Review" subtitle="NGO applications" onClick={() => loadDetails('pending_review')} selected={selectedMetric === 'pending_review'} />
        <MetricBlock icon={FiUsers} value={metrics.registeredVolunteers} label="Volunteers" subtitle="Registered accounts" onClick={() => loadDetails('volunteers')} selected={selectedMetric === 'volunteers'} />
        <MetricBlock icon={FiCheckCircle} value={`${metrics.completionRate}%`} label="Completion Rate" subtitle="Completed donation workflows" onClick={() => loadDetails('completed')} selected={selectedMetric === 'completed'} />
      </div>

      {selectedMetric && (
        <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 space-y-5">
          <div className="border-b border-[#E7DED1] pb-4">
            <h2 className="text-xl font-serif font-bold text-[#4A2523]">{metricDetails[selectedMetric].title}</h2>
            <p className="text-xs text-[#746B66] mt-1">{metricDetails[selectedMetric].description}</p>
          </div>
          {detailsLoading ? (
            <p className="text-sm text-[#746B66] py-4">Loading details…</p>
          ) : details.length === 0 ? (
            <p className="text-sm text-[#746B66] py-4">No records found.</p>
          ) : (
            <div className="divide-y divide-[#E7DED1]">
              {details.map((item) => (
                <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                  {selectedMetric === 'posts' || selectedMetric === 'completed' ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="font-serif font-bold text-[#4A2523]">{item.eventName}</h3>
                        <Badge status={item.status} />
                      </div>
                      <p className="text-xs text-[#746B66] mt-1">Posted by {item.donorName} · {item.foodType} · {item.quantity}</p>
                      <p className="text-xs text-[#746B66] mt-1">Estimated meals: {item.estimatedMeals ?? 'Not provided'}{item.ngoName ? ` · NGO: ${item.ngoName}` : ''}{item.volunteerName ? ` · Volunteer: ${item.volunteerName}` : ''}</p>
                    </>
                  ) : selectedMetric === 'volunteers' ? (
                    <>
                      <h3 className="font-serif font-bold text-[#4A2523]">{item.name}</h3>
                      <p className="text-xs text-[#746B66] mt-1">{item.email}{item.phone ? ` · ${item.phone}` : ''}</p>
                      <p className="text-xs text-[#746B66] mt-1">Registered {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'date unavailable'}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif font-bold text-[#4A2523]">{item.organization || 'Unnamed organization'}</h3>
                        <Badge status={item.verificationStatus} />
                      </div>
                      <p className="text-xs text-[#746B66] mt-1">Registration number: {item.registrationNumber || 'Not provided'} · Contact: {item.name} · {item.email}</p>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

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
