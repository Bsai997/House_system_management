import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutApi, setAuthFailureHandler, getTabToken, clearTabToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Called by API interceptor on 401 to sync React state
  const clearUser = useCallback(() => setUser(null), []);

  useEffect(() => {
    setAuthFailureHandler(clearUser);
    return () => setAuthFailureHandler(null);
  }, [clearUser]);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    // Each tab has its own token in sessionStorage.
    // No token = fresh tab → show landing page.
    if (!getTabToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Token exists → validate it against the server
    await loadUser();
  };

  const loadUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      setUser(null);
      clearTabToken();
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (userData) => {
    // Token is stored by Login page via setTabToken
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore logout API errors
    }
    clearTabToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
