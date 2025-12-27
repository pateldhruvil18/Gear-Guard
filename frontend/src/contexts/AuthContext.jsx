import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('gearguard_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Verify token is still valid
      if (parsedUser.token) {
        authApi.getCurrentUser()
          .then((response) => {
            setUser({ ...parsedUser, ...response.data.user });
          })
          .catch(() => {
            // Token invalid, clear user
            localStorage.removeItem('gearguard_user');
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      if (response.data.success && response.data.user && response.data.user.token) {
        const userData = {
          id: response.data.user.id || response.data.user._id,
          _id: response.data.user.id || response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          avatar: response.data.user.avatar,
          token: response.data.user.token,
        };
        
        // Save to localStorage first (synchronous)
        localStorage.setItem('gearguard_user', JSON.stringify(userData));
        
        // Then set user state (asynchronous, but localStorage is already set)
        setUser(userData);
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password, role, skills = []) => {
    try {
      const response = await authApi.register({ name, email, password, role, skills });
      if (response.data.success) {
        const userData = response.data.user;
        // Set user and token for successful registration
        if (userData && userData.token) {
          setUser(userData);
          localStorage.setItem('gearguard_user', JSON.stringify(userData));
        }
        return { 
          success: true, 
          user: userData,
          message: response.data.message,
        };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gearguard_user');
  };

  const isManager = () => user?.role === 'manager';
  const isTechnician = () => user?.role === 'technician';
  const isUser = () => user?.role === 'user';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isManager,
    isTechnician,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

