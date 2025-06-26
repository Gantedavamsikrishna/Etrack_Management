import React, { createContext, useState, useEffect, useContext } from 'react';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [confirmedAlerts, setConfirmedAlerts] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('confirmedAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when confirmedAlerts changes
  useEffect(() => {
    localStorage.setItem('confirmedAlerts', JSON.stringify(confirmedAlerts));
  }, [confirmedAlerts]);

  const addConfirmedAlert = (alert) => {
    console.log('Adding confirmed alert:', alert._id);
    setConfirmedAlerts((prev) => {
      // Avoid duplicates
      if (prev.some((a) => a._id === alert._id)) {
        return prev;
      }
      return [...prev, alert];
    });
  };

  const removeConfirmedAlert = (id) => {
    console.log('Removing confirmed alert:', id);
    setConfirmedAlerts((prev) => prev.filter((alert) => alert._id !== id));
  };

  return (
    <ReportsContext.Provider value={{ confirmedAlerts, addConfirmedAlert, removeConfirmedAlert }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};