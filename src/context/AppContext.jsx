import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest, normalizeDonation } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState({ mealsServed: 0, completedDeliveries: 0, eventsConnected: 0, partnerNgos: 0, activeVolunteers: 0 });
  const [loading, setLoading] = useState(Boolean(user));

  const refreshData = useCallback(async () => {
    if (!user) {
      setDonations([]);
      setNotifications([]);
      setLoading(false);
      return;
    }
    try {
      const [donationResponse, notificationResponse] = await Promise.all([
        apiRequest('/donations?limit=100'),
        apiRequest('/notifications'),
      ]);
      setDonations((donationResponse.data.items || []).map(normalizeDonation));
      setNotifications(notificationResponse.data.items || []);
    } catch (error) {
      console.error('Could not refresh FOOD CONNECT data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    apiRequest('/impact', { token: null })
      .then((response) => { if (active) setImpactMetrics(response.data); })
      .catch((error) => console.error('Could not load FOOD CONNECT impact metrics:', error.message));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setLoading(Boolean(user));
    refreshData();
    if (!user) return undefined;
    const interval = window.setInterval(refreshData, 15000);
    return () => window.clearInterval(interval);
  }, [user, refreshData]);

  const runMutation = async (path, options, resultKey = 'donation') => {
    try {
      const response = await apiRequest(path, options);
      const item = response.data?.[resultKey];
      if (resultKey === 'donation' && item) {
        const savedDonation = normalizeDonation(item);
        setDonations((current) => current.some((donation) => donation.id === savedDonation.id)
          ? current.map((donation) => donation.id === savedDonation.id ? savedDonation : donation)
          : [savedDonation, ...current]);
      }
      await refreshData();
      return { success: true, ...(item ? { [resultKey]: resultKey === 'donation' ? normalizeDonation(item) : item } : {}) };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const createDonation = (data) => runMutation('/donations', { method: 'POST', body: data });
  const acceptDonation = (id) => runMutation(`/donations/${id}/accept`, { method: 'POST' });
  const acceptAssignment = (id) => runMutation(`/donations/${id}/assign-volunteer`, { method: 'POST' });
  const updateDonationStatus = (id, status) => runMutation(`/donations/${id}/status`, { method: 'PATCH', body: { status } });
  const cancelDonation = (id, reason = 'Cancelled by donor') => runMutation(`/donations/${id}/cancel`, { method: 'POST', body: { reason } });

  const markNotificationRead = async (id) => {
    const result = await runMutation(`/notifications/${id}/read`, { method: 'PATCH' }, 'notification');
    if (!result.success) console.error(result.error);
  };

  const markAllNotificationsRead = async () => {
    const result = await runMutation('/notifications/read-all', { method: 'PATCH' }, null);
    if (!result.success) console.error(result.error);
  };

  return (
    <AppContext.Provider value={{
      donations, notifications, impactMetrics, loading, refreshData,
      createDonation, acceptDonation, acceptAssignment, updateDonationStatus,
      cancelDonation, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
