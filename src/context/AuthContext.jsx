import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('etrack-user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        setError('Invalid session data. Please log in again.');
        localStorage.removeItem('etrack-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://etrack-backend.onrender.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: email, adminPassword: password }),
      });

      const data = await response.json();
      console.log('Login API response:', data);

      if (response.ok && data.message === 'Login successful') {
        // Store comprehensive user data including name and role
        const userData = {
          email: email,
          name: data.adminName || email.split('@')[0], // Fallback to email prefix if name not provided
          role: 'Admin', // Explicitly set role as Admin
        };
        setUser(userData);
        localStorage.setItem('etrack-user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Invalid email or password');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error during login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('etrack-user');
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};