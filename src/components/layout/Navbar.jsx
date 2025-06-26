import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import axios from "axios";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";
import { cn } from "../../utils/cn";
// import { toast } from 'react-toastify';
// import { useReports } from "../../context/ReportsContext";

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  // const { addConfirmedAlert, removeConfirmedAlert } = useReports();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const menuRef = useRef(null);
  const alertsModalRef = useRef(null);

  // Clear localStorage on logout
  const handleLogout = () => {
    localStorage.removeItem("confirmedAlerts");
    localStorage.removeItem("confirmedAlertIds");
    logout();
    setShowUserMenu(false);
  };

  const fetchAlerts = async () => {
    if (!user) {
      console.log("No user, skipping fetchAlerts");
      return;
    }
  };

  useEffect(() => {
    if (!user) return;

    socket.emit("register", "admin");

    socket.on("reportAlert", (data) => {
      console.log("📨 New real-time report received:", data);

      const newAlert = {
        message: ` ${data.deviceBarcode} `,
        status: data.deviceStatus || "unknown",
        time: new Date().toISOString(),
        device: `${data.deviceName} `,
        type:
          data.deviceStatus === "not-working" ||
          data.deviceStatus === "critical"
            ? "critical"
            : "warning",
        read: false,
      };

      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    });

    return () => {
      socket.off("reportAlert");
    };
  }, [user]);

  const handleConfirmAlert = (alert) => {
    if (!user) {
      // toast.error('Please log in to confirm alerts');
      return;
    }
    console.log("Confirming alert:", alert._id);
    addConfirmedAlert(alert);
    setAlerts((prev) => prev.filter((a) => a._id !== alert._id)); // Remove from modal
    // toast.success('Alert confirmed and moved to Reports');
  };

  const handleRemoveAlert = async (id) => {
    if (!user) {
      toast.error("Please log in to delete alerts");
      return;
    }
    try {
      console.log("Deleting alert:", id);
      const response = await axios.delete(
        `https://etrack-backend.onrender.com/report/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Delete API Response:", response.data);
      setAlerts((prev) => prev.filter((alert) => alert._id !== id));
      removeConfirmedAlert(id);
      setConfirmDeleteId(null);
      // toast.success('Alert deleted successfully');
    } catch (error) {
      console.error("Error deleting alert:", error);
      // toast.error(error.response?.data?.message || 'Failed to delete alert');
    }
  };

  const unreadCount = alerts.length; // All alerts are unread until confirmed

  const toggleAlerts = () => {
    setShowAlerts((prev) => {
      console.log(`Toggling alerts modal, new state: ${!prev}`);
      return !prev;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        alertsModalRef.current &&
        !alertsModalRef.current.contains(event.target)
      ) {
        setShowAlerts(false);
        console.log("Closing alerts modal due to click outside");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const defaultProfileDetails = [
    {
      id: "email",
      label: "Email",
      value: user?.email || "No email",
      icon: <Mail className="h-5 w-5 text-white dark:text-gray-300" />,
    },
    {
      id: "username",
      label: "Username",
      value: user?.username || "No username",
      icon: <User className="h-5 w-5 text-white dark:text-gray-300" />,
    },
    {
      id: "role",
      label: "Role",
      value: user?.role || "No role",
      icon: <Briefcase className="h-5 w-5 text-white dark:text-gray-300" />,
    },
  ];

  const profileDetails = hoveredField
    ? [
        defaultProfileDetails.find((item) => item.id === hoveredField),
        ...defaultProfileDetails.filter((item) => item.id !== hoveredField),
      ]
    : defaultProfileDetails;

  return (
    <nav
      className={cn(
        "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      )}
    >
      <div className="max-w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => {
              console.log("Toggling sidebar, isSidebarOpen:", isSidebarOpen);
              onToggleSidebar();
            }}
            className={cn(
              "p-1 sm:p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-2 hover:border-primary-500 dark:hover:border-primary-400 mr-2 sm:mr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
            )}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>

          <div className="flex items-center">
            <Laptop2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 dark:text-primary-400" />
            <span
              className={cn(
                "ml-1 sm:ml-2 text-lg sm:text-xl font-semibold text-gray-800 dark:text-white",
                "hidden sm:inline-block"
              )}
            >
              Etrack
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />

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
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <span className="hidden md:inline-block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name || "Unknown User"}
                </span>
              </button>

              {showUserMenu && (
                <div
                  className={cn(
                    "absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-[120] animate-fade-in"
                  )}
                >
                  <div className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                    <p className="font-medium">{user.name || "Unknown User"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email || "No email"}
                    </p>
                  </div>

                  <button
                    className={cn(
                      "flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-100 dark:hover:bg-primary-600 hover:text-gray-900 dark:hover:text-white"
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
                      "flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-100 dark:hover:bg-primary-600 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={handleLogout}
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

      {showProfile && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 animate-[fadeIn_0.3s_ease-out]">
          <div
            className={cn(
              "relative w-full max-w-md rounded-2xl p-6 overflow-hidden",
              "bg-gradient-to-br from-white/15 to-white/5 dark:from-gray-800/8 dark:to-gray-900/3 backdrop-blur-[20px]",
              "border border-white/40 dark:border-gray-500/40 shadow-xl shadow-black/10 dark:shadow-white/5",
              "font-sans text-white dark:text-gray-100 transition-all duration-300"
            )}
            style={{
              fontFamily:
                '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-50 blur-[30px]" />
            <div className="absolute inset-0 border border-white/50 dark:border-gray-400/50 rounded-2xl" />

            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 p-2 rounded-full text-white dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/30 hover:text-white dark:hover:text-white transition-all duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center space-y-3 mb-6">
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-transform duration-300 hover:scale-105">
                {user.name ? user.name.charAt(0) : "U"}
                <div className="absolute inset-0 rounded-full border-2 border-white/40 dark:border-gray-600/40" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-white dark:text-white">
                {user.name || "Unknown User"}
              </h2>
              <p className="text-sm text-gray-200 dark:text-gray-400 font-medium">
                {user.role || "Unknown Role"}
              </p>
            </div>

            <div className="space-y-3">
              {profileDetails.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg bg-white/20 dark:bg-gray-800/15 border border-white/40 dark:border-gray-500/30 shadow-sm",
                    "hover:bg-white/30 dark:hover:bg-gray-800/25 hover:border-white/60 dark:hover:border-gray-400/60 transition-all duration-300"
                  )}
                  onMouseEnter={() => setHoveredField(item.id)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  {item.icon}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white dark:text-gray-100">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-200 dark:text-gray-300 truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

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

      {showAlerts && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]"
          onClick={() => setShowAlerts(false)}
        >
          <div
            ref={alertsModalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 border border-white/20 rounded-xl p-5 max-w-md w-full text-white"
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
              <h2 className="text-xl flex items-center">
                <Bell className="mr-2" /> Alerts
              </h2>
              <button
                onClick={() => {
                  setShowAlerts(false);
                  console.log("Closing alerts modal via close button");
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="max-h-80 overflow-y-auto space-y-4 pr-2"
              style={{ scrollbarWidth: "none" }}
            >
              <style>{`.max-h-80::-webkit-scrollbar { display: none; }`}</style>
              {alertsLoading ? (
                <p className="text-center text-gray-300 text-sm font-semibold">
                  Loading alerts...
                </p>
              ) : alertsError ? (
                <p className="text-center text-red-400 text-sm font-semibold">
                  {alertsError}
                </p>
              ) : alerts.length === 0 ? (
                <p className="text-center text-gray-300 text-sm font-semibold">
                  No alerts available.
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert._id}
                    className="p-3 bg-white/10 border border-white/20 rounded flex justify-between"
                  >
                    <div className="w-[90%]">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-300">
                        {new Date(alert.time).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-xs">
                        <span>Status: </span>
                        <span
                          className={
                            alert.status === "resolved"
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {alert.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-300">
                        Device: {alert.deviceBarcode || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleConfirmAlert(alert)}
                        className="p-1 rounded-full hover:bg-white/20"
                        aria-label="Confirm alert"
                      >
                        <Check className="text-green-400 h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(alert._id)}
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
                onClick={() => {
                  setShowAlerts(false);
                  console.log("Closing alerts modal via footer button");
                }}
                className="text-white bg-white/20 hover:bg-white/30"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[210] bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this alert?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setConfirmDeleteId(null)}
                className="text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveAlert(confirmDeleteId)}
                className="text-white bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
