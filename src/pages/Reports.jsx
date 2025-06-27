import React, { useState, useEffect, useRef } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import socket from '../socket';

export const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/report/get', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const confirmedReports = data.filter((r) => r.status === 'confirmed');
        setReports(confirmedReports);
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
  }, [user, navigate]);

  // Optionally listen to WebSocket updates
  useEffect(() => {
    socket.on('reportConfirmed', (report) => {
      setReports((prev) => [report, ...prev]);
    });
    return () => socket.off('reportConfirmed');
  }, []);

  const handleDeleteReport = async (id) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3000/report/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setReports((prev) => prev.filter((r) => r._id !== id));
        toast.success('Report deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete report');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete report');
    }
  };

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
          No confirmed reports available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-4 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                    Device Status: {report.deviceStatus}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Confirmation Status: {report.status}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Time:{' '}
                    {new Date(report.createdAt).toLocaleString('en-IN', {
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
    </div>
  );
};
