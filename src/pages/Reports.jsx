import React, { useState, useEffect, useRef } from 'react';
import { FileText, Trash2, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportsContext';
import { cn } from '../utils/cn';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';

export const Reports = () => {
  const { user } = useAuth();
  const { confirmedAlerts, removeConfirmedAlert } = useReports();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const reportsModalRef = useRef(null);

  const fetchReports = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://etrack-backend.onrender.com/report/get', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const backendReports = data
          .filter((report) => report.confirmed === true)
          .map((report) => ({
            _id: report._id,
            deviceName: report.deviceName,
            deviceBarcode: report.deviceBarcode,
            deviceStatus: 'confirmed',
            message: report.message || `${report.deviceName} alert`,
            status: report.deviceStatus,
            time: report.createdAt || new Date().toISOString(),
          }));

        const allReports = [
          ...backendReports,
          ...confirmedAlerts.filter(
            (alert) => !backendReports.some((report) => report._id === alert._id)
          ),
        ];

        // Filter out the specific report
        const filteredReports = allReports.filter(
          (report) =>
            !(
              report.deviceName === 'Smoke Detector' &&
              report.deviceBarcode === 'DVC004' &&
              new Date(report.time).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }) === '22 Jun 2025, 5:50 pm'
            )
        );

        setReports(filteredReports);
      } else {
        setError(data.message || 'Failed to fetch reports');
        toast.error(data.message || 'Failed to fetch reports');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch reports');
      toast.error(error.message || 'Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user, navigate, confirmedAlerts]);

  const handleDeleteReport = async (id) => {
    try {
      const isContextAlert = confirmedAlerts.some(
        (alert) => alert._id === id && alert.deviceStatus !== 'confirmed'
      );
      if (isContextAlert) {
        removeConfirmedAlert(id);
        setReports((prevReports) => prevReports.filter((report) => report._id !== id));
        toast.success('Report removed successfully');
      } else {
        const response = await fetch(`https://etrack-backend.onrender.com/report/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setReports((prev) => prev.filter((r) => r._id !== id));
          removeConfirmedAlert(id);
          const savedIds = JSON.parse(localStorage.getItem('confirmedAlertIds') || '[]');
          const updatedIds = savedIds.filter((savedId) => savedId !== id);
          localStorage.setItem('confirmedAlertIds', JSON.stringify(updatedIds));
          toast.success('Report deleted successfully');
        } else {
          toast.error(data.message || 'Failed to delete report');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete report');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportsModalRef.current && !reportsModalRef.current.contains(event.target)) {
        setShowReportsModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4 sm:p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          My Reports
        </h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading reports...</div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      ) : reports.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No confirmed reports or alerts available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className={cn(
                'p-4 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
                'hover:shadow-md transition-shadow duration-200'
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.deviceName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Barcode: {report.deviceBarcode || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: {report.deviceStatus.charAt(0).toUpperCase() + report.deviceStatus.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Time:{' '}
                    {new Date(report.time).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReport(report._id)}
                  className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Delete report"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReportsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div
            ref={reportsModalRef}
            className="bg-white/10 border border-white/20 rounded-xl p-5 max-w-md w-full text-white dark:text-white"
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
              <h2 className="text-xl flex items-center">
                <Bell className="mr-2" />
                Confirmed Alerts
              </h2>
              <button onClick={() => setShowReportsModal(false)} className="hover:text-red-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 pr-2 max-h-80 overflow-y-auto scrollbar-none">
              {confirmedAlerts.length === 0 ? (
                <p className="text-center text-gray-300 dark:text-gray-400 text-sm font-semibold">
                  No confirmed alerts available.
                </p>
              ) : (
                confirmedAlerts.map((alert) => (
                  <div
                    key={alert._id}
                    className="p-3 bg-white/10 border border-white/20 rounded flex justify-between items-center"
                  >
                    <div className="w-[90%]">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-300 dark:text-gray-400">
                        {new Date(alert.time).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                      <p className="text-xs">
                        Status:{' '}
                        <span
                          className={alert.status === 'active' ? 'text-red-400' : 'text-green-400'}
                        >
                          {alert.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-300 dark:text-gray-400">
                        Device: {alert.deviceBarcode || 'N/A'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleDeleteReport(alert._id)}
                        className="p-1 rounded-full hover:bg-white/20"
                        aria-label="Delete alert"
                      >
                        <Trash2 className="text-red-400 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end border-t border-white/20 pt-4">
              <Button
                size="sm"
                onClick={() => setShowReportsModal(false)}
                className="text-white bg-white/20 hover:bg-white/30"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};