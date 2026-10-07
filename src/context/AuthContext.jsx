import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, clearToken, getToken, normalizeUser, setToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        if (active) setLoading(false);
        return;
      }
      try {
        const response = await apiRequest('/auth/me');
        if (active) setUser(normalizeUser(response.data.user));
      } catch {
        clearToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    restoreSession();
    return () => { active = false; };
  }, []);

  const register = async (userData) => {
    try {
      const response = await apiRequest('/auth/register', { method: 'POST', body: userData, token: null });
      setToken(response.data.token);
      setUser(normalizeUser(response.data.user));
      return { success: true, user: normalizeUser(response.data.user) };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiRequest('/auth/login', { method: 'POST', body: { email, password }, token: null });
      setToken(response.data.token);
      const nextUser = normalizeUser(response.data.user);
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  };

  const logout = async () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
