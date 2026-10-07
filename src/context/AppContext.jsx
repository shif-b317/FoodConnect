import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest, normalizeDonation } from '../services/api';
import { useAuth } from './AuthContext';
import { initialImpactMetrics } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [impactMetrics] = useState(initialImpactMetrics);
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
    setLoading(Boolean(user));
    refreshData();
    if (!user) return undefined;
    const interval = window.setInterval(refreshData, 15000);
    return () => window.clearInterval(interval);
  }, [user, refreshData]);

  const runMutation = async (path, options, resultKey = 'donation') => {
    try {
      const response = await apiRequest(path, options);
      await refreshData();
      const item = response.data?.[resultKey];
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
