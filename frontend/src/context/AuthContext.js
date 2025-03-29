import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = authService.getCurrentUser();
    if (storedUser && storedUser.id) {
      // Ensure the user has all required fields
      setUser({
        ...storedUser,
        // Ensure these fields exist for compatibility
        created_at: storedUser.created_at || new Date().toISOString(),
        updated_at: storedUser.updated_at || new Date().toISOString()
      });
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const { user, error } = await authService.login(identifier, password);
    if (user) {
      // Ensure the user has all required fields
      setUser({
        ...user,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString()
      });
    }
    return { user, error };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (userData) => {
    const { user, error } = await authService.register(userData);
    if (user) {
      // Ensure the user has all required fields
      setUser({
        ...user,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString()
      });
    }
    return { user, error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 