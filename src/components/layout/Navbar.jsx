import React, { useState, useEffect, useRef } from 'react';
import {
  Laptop2,
  LogOut,
  Menu,
  User,
  X,
  Mail,
  Briefcase,
  Bell,
  Check,
  Trash2,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const menuRef = useRef(null);

  // Mock alerts data with read status
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      message: 'Monitor in Server Room is not working',
      date: '2025-06-22T14:00:00Z',
      type: 'critical',
      read: false,
    },
    {
      id: 2,
      message: 'WiFi Router in IOT Lab needs maintenance',
      date: '2025-06-22T13:30:00Z',
      type: 'warning',
      read: false,
    },
    {
      id: 3,
      message: 'AC in CEO Cabin is functioning normally',
      date: '2025-06-22T12:00:00Z',
      type: 'info',
      read: false,
    },
    {
      id: 4,
      message: 'Security Camera in Lobby is offline',
      date: '2025-06-22T11:45:00Z',
      type: 'critical',
      read: false,
    },
    {
      id: 5,
      message: 'Printer in Office 2B low on toner',
      date: '2025-06-22T10:30:00Z',
      type: 'warning',
      read: false,
    },
    {
      id: 6,
      message: 'Backup generator test completed successfully',
      date: '2025-06-22T09:00:00Z',
      type: 'info',
      read: false,
    },
    {
      id: 7,
      message: 'Light in Conference Room 3A is flickering',
      date: '2025-06-22T08:30:00Z',
      type: 'warning',
      read: false,
    },
    {
      id: 8,
      message: 'Mouse in Room 4B is unresponsive',
      date: '2025-06-22T07:45:00Z',
      type: 'critical',
      read: false,
    },
    {
      id: 9,
      message: 'Fan in Hall 5C is operational',
      date: '2025-06-22T07:00:00Z',
      type: 'info',
      read: false,
    },
    {
      id: 10,
      message: 'Keyboard in IT Lab 2 needs replacement',
      date: '2025-06-22T06:30:00Z',
      type: 'warning',
      read: false,
    },
  ]);

  // Calculate the number of unread alerts
  const unreadCount = alerts.filter((alert) => !alert.read).length;

  // Function to mark all alerts as read
  const handleMarkAllAsRead = () => {
    console.log('Marking all alerts as read');
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => ({ ...alert, read: true }))
    );
  };

  // Function to remove a single alert
  const handleRemoveAlert = (id) => {
    console.log(`Removing alert with id: ${id}`);
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  // Toggle alerts modal
  const toggleAlerts = () => {
    console.log(`Toggling alerts modal, current state: ${showAlerts}`);
    setShowAlerts((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Profile details array
  const defaultProfileDetails = [
    {
      id: 'email',
      label: 'Email',
      value: user.email || 'No email',
      icon: <Mail className="h-5 w-5 text-white dark:text-gray-300" />,
    },
    {
      id: 'username',
      label: 'Username',
      value: user.username || 'No username',
      icon: <User className="h-5 w-5 text-white dark:text-gray-300" />,
    },
    {
      id: 'role',
      label: 'Role',
      value: user.role || 'No role',
      icon: <Briefcase className="h-5 w-5 text-white dark:text-gray-300" />,
    },
  ];

  // Reorder profile details based on hovered field
  const profileDetails = hoveredField
    ? [
        defaultProfileDetails.find((item) => item.id === hoveredField),
        ...defaultProfileDetails.filter((item) => item.id !== hoveredField),
      ]
    : defaultProfileDetails;

  return (
    <nav
      className={cn(
        'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 fixed top-0 left-0 right-0 z-[100] transition-all duration-300'
      )}
    >
      <div className="max-w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => {
              console.log('Toggling sidebar, isSidebarOpen:', isSidebarOpen);
              onToggleSidebar();
            }}
            className={cn(
              'p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-2 hover:border-primary-500 dark:hover:border-primary-400 mr-2 sm:mr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden'
            )}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>

          <div className="flex items-center">
            <Laptop2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 dark:text-primary-400" />
            <span
              className={cn(
                'ml-1 sm:ml-2 text-lg sm:text-xl font-semibold text-gray-800 dark:text-white',
                'hidden sm:inline-block'
              )}
            >
              Etrack
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />

          {/* Alert Icon */}
          <button
            onClick={toggleAlerts}
            className="relative p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="View alerts"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center space-x-1 sm:space-x-2 focus:outline-none"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm sm:text-base">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden md:inline-block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name || 'Unknown User'}
                </span>
              </button>

              {showUserMenu && (
                <div
                  className={cn(
                    'absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-[120] animate-fade-in'
                  )}
                >
                  <div className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                    <p className="font-medium">{user.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || 'No email'}</p>
                  </div>

                  <button
                    className={cn(
                      'flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-primary-600 hover:text-gray-900 dark:hover:text-white'
                    )}
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfile(true);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>

                  <button
                    className={cn(
                      'flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-primary-600 hover:text-gray-900 dark:hover:text-white'
                    )}
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<User className="h-3 w-3 sm:h-4 sm:w-4" />}
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Profile Modal with Enhanced Visibility in Light Theme */}
      {showProfile && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 animate-[fadeIn_0.3s_ease-out]">
          <div
            className={cn(
              'relative w-full max-w-md rounded-2xl p-6 overflow-hidden',
              'bg-gradient-to-br from-white/15 to-white/5 dark:from-gray-800/8 dark:to-gray-900/3 backdrop-blur-[20px]',
              'border border-white/40 dark:border-gray-500/40 shadow-xl shadow-black/10 dark:shadow-white/5',
              'font-sans text-white dark:text-gray-100 transition-all duration-300'
            )}
            style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            {/* Ultra-Glassy Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-50 blur-[30px]" />
            <div className="absolute inset-0 border border-white/50 dark:border-gray-400/50 rounded-2xl" />

            {/* Close Button */}
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 p-2 rounded-full text-white dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30 hover:text-white dark:hover:text-white transition-all duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-3 mb-6">
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-transform duration-300 hover:scale-105">
                {user.name ? user.name.charAt(0) : 'U'}
                <div className="absolute inset-0 rounded-full border-2 border-white/40 dark:border-gray-600/40" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-white dark:text-white">{user.name || 'Unknown User'}</h2>
              <p className="text-sm text-gray-200 dark:text-gray-400 font-medium">{user.role || 'Unknown Role'}</p>
            </div>

            {/* Profile Details with Reordering and Border on Hover */}
            <div className="space-y-3">
              {profileDetails.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg bg-white/20 dark:bg-gray-800/15 border border-white/40 dark:border-gray-500/30 shadow-sm',
                    'hover:bg-white/30 dark:hover:bg-gray-800/25 hover:border-white/60 dark:hover:border-gray-400/60 transition-all duration-200'
                  )}
                  onMouseEnter={() => setHoveredField(item.id)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  {item.icon}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white dark:text-gray-100">{item.label}</p>
                    <p className="text-sm text-gray-200 dark:text-gray-300 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowProfile(false)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Modal with Enhanced Visibility in Light Theme */}
      {showAlerts && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div
            className={cn(
              'relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl p-6',
              'bg-gradient-to-br from-white/15 to-white/5 dark:from-gray-800/8 dark:to-gray-900/3 backdrop-blur-[20px]',
              'border border-white/40 dark:border-gray-500/40 shadow-lg shadow-black/10 dark:shadow-white/5',
              'text-gray-950 dark:text-white transition-colors duration-300'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassy Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-50 blur-[30px]" />
            <div className="absolute inset-0 border border-white/50 dark:border-gray-400/50 rounded-2xl" />

            {/* Header with Centered Icon */}
            <div className="flex items-center justify-center mb-5 border-b border-white/20 dark:border-gray-600/20 pb-4">
              <Bell className="h-8 w-8 text-gray-950 dark:text-white mr-2" />
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Alerts</h2>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                console.log('Closing alerts modal');
                setShowAlerts(false);
              }}
              className="absolute top-3 right-3 text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white hover:bg-white/30 dark:hover:bg-gray-800/30 rounded-md p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Alerts List */}
            <div
              className="max-h-80 overflow-y-auto space-y-4"
              style={{
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE and Edge
              }}
            >
              <style>
                {`
                  .max-h-80::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, and Opera */
                  }
                `}
              </style>
              {alerts.length === 0 ? (
                <p className="text-center text-gray-700 dark:text-gray-400 text-sm font-semibold">No alerts available!</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'flex items-start p-4 rounded-lg border border-white/20 dark:border-gray-600/20',
                      alert.read ? 'bg-white/15 dark:bg-gray-800/10' : 'bg-white/20 dark:bg-gray-800/15 font-semibold'
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                        {new Date(alert.date).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'Asia/Kolkata',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          alert.type === 'critical' && 'bg-red-500/20 text-red-600 dark:text-red-400',
                          alert.type === 'warning' && 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
                          alert.type === 'info' && 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </span>
                      <button
                        onClick={() => handleRemoveAlert(alert.id)}
                        className="p-1 rounded-full text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
                        aria-label="Delete alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-between items-center border-t border-white/20 dark:border-gray-600/20 pt-4">
              <div>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 text-sm font-semibold bg-white/20 dark:bg-gray-800/15 hover:bg-white/30 dark:hover:bg-gray-700/25 text-gray-900 dark:text-white border-white/20 dark:border-gray-600/20 transition-all duration-300 ease-in-out"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Closing alerts modal via footer button');
                  setShowAlerts(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-white/20 dark:bg-gray-800/15 hover:bg-white/30 dark:hover:bg-gray-700/25 text-gray-900 dark:text-white border-white/20 dark:border-gray-600/20 transition-all duration-300 ease-in-out"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};