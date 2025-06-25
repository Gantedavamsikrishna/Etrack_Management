import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { X, Upload, Eye, EyeOff } from "lucide-react";
import { cn } from "../utils/cn";
import axios from "axios";
import WifiLoader from "../utils/Loader.jsx";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const defaultAvatar =
  "https://www.svgrepo.com/show/382106/user-avatar-default.svg";
const API_BASE = "https://etrack-backend.onrender.com";

const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    adminId: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/get`);
      const data = res.data;
      if (Array.isArray(data.admins)) {
        setAdmins(data.admins);
      } else {
        console.warn("Unexpected response:", data);
        setAdmins([]);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setAdmins([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleClear = () => {
    setFormData({
      adminId: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      adminImage: null,
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!formData.adminId || !formData.adminName || !formData.adminEmail || !formData.adminPassword) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
        toastId: 'validation-error'
      });
      return;
    }

    const data = new FormData();
    data.append("adminId", formData.adminId);
    data.append("adminName", formData.adminName);
    data.append("adminEmail", formData.adminEmail);
    data.append("adminPassword", formData.adminPassword);
    if (formData.adminImage) {
      data.append("adminImage", formData.adminImage);
    }

    try {
      await axios.post(`${API_BASE}/admin/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Admin added successfully!", {
        position: "top-right",
        autoClose: 4000,
        toastId: 'admin-add-success'
      });
      fetchAdmins();
      setShowForm(false);
      handleClear();
    } catch (err) {
      console.error("Failed to add admin:", err);
      toast.error("Failed to add admin.", {
        position: "top-right",
        autoClose: 3000,
        toastId: 'admin-add-error'
      });
    }
  };

  // Handle Escape key for both modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showForm) {
          setShowForm(false);
          handleClear();
        } else if (selectedAdmin) {
          setSelectedAdmin(null);
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showForm, selectedAdmin]);

  return (
    <>
      <style>
        {`
          .modal-overlay {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        `}
      </style>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover
        pauseOnFocusLoss={false}
        draggable
        limit={3}
        style={{ zIndex: 10000, top: '20px', right: '20px' }}
      />
      <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {loading ? (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="h-[520px] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <WifiLoader className="scale-[2]" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Admin Details
              </h1>
              <button
                onClick={() => {
                  setShowForm(true);
                  setSelectedAdmin(null);
                  setShowPassword(false);
                }}
                className="cursor-pointer rounded-xl bg-white/30 dark:bg-white/10 border border-white/50 dark:border-white/20 px-4 py-2 text-black dark:text-white backdrop-blur-lg shadow-md hover:bg-white/40 dark:hover:bg-white/20 transition"
              >
                + Add Admin User
              </button>
            </div>
            {/* Admin Cards */}
            <div className="grid gap-8 md:grid-cols-2 mt-4">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <Card
                    key={admin._id}
                    onClick={() => setSelectedAdmin(admin)}
                    className="flex items-center gap-4 p-6 m-2 cursor-pointer bg-white/30 dark:bg-white/10 backdrop-blur-lg border border-gray-300/70 dark:border-white/20 rounded-xl text-black dark:text-white shadow-lg hover:shadow-xl"
                  >
                    <img
                      src={`${API_BASE}/adminImage/${admin.adminImage}`}
                      onError={(e) => (e.target.src = defaultAvatar)}
                      alt={admin.adminName}
                      className="w-14 h-14 rounded-full object-cover border border-gray-300/70 dark:border-white/40"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{admin.adminName}</h3>
                      <p className="text-sm text-gray-700 dark:text-white/70">
                        ID: {admin.adminId}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-700 dark:text-white/70">
                  No admins found.
                </p>
              )}
            </div>
          </>
        )}

        {/* Add Admin Modal */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md modal-overlay flex items-center justify-center z-[1000]"
            onClick={() => {
              setShowForm(false);
              handleClear();
            }}
          >
            <div
              className="bg-white/30 dark:bg-gray-800/20 backdrop-blur-lg rounded-3xl border border-white/50 dark:border-white/20 p-6 w-full max-w-md shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Add Admin User
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    handleClear();
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-white/50 dark:border-white/20 bg-white/10 dark:bg-gray-800/10 text-black dark:text-white p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-white/50 dark:border-white/20 bg-white/10 dark:bg-gray-800/10 text-black dark:text-white p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-white/50 dark:border-white/20 bg-white/10 dark:bg-gray-800/10 text-black dark:text-white p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-white/50 dark:border-white/20 bg-white/10 dark:bg-gray-800/10 text-black dark:text-white p-2 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="adminImage"
                      onChange={handleInputChange}
                      className="hidden"
                      id="adminImage"
                      accept="image/*"
                    />
                    <label
                      htmlFor="adminImage"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-white/30 dark:bg-gray-800/30 border border-white/50 dark:border-white/20 rounded-md text-sm text-black dark:text-white hover:bg-white/40 dark:hover:bg-gray-800/40"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Image
                    </label>
                    {formData.adminImage && (
                      <span className="ml-2 text-sm text-gray-800 dark:text-gray-300">
                        {formData.adminImage.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 bg-white/30 dark:bg-gray-800/30 border border-white/50 dark:border-white/20 text-black dark:text-white rounded-md hover:bg-white/40 dark:hover:bg-gray-800/40"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-md hover:from-indigo-700 hover:to-teal-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admin Details Modal */}
        {selectedAdmin && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md modal-overlay flex items-center justify-center z-[1000]"
            onClick={() => setSelectedAdmin(null)}
          >
            <div
              className="bg-white/30 dark:bg-gray-800/20 backdrop-blur-lg rounded-3xl border border-white/50 dark:border-white/20 p-6 w-full max-w-md shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Admin Details
                </h2>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={`${API_BASE}/adminImage/${selectedAdmin.adminImage}`}
                    onError={(e) => (e.target.src = defaultAvatar)}
                    alt={selectedAdmin.adminName}
                    className="w-24 h-24 rounded-full object-cover border border-white/50 dark:border-white/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Admin ID
                  </label>
                  <p className="mt-1 text-black dark:text-white">{selectedAdmin.adminId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Name
                  </label>
                  <p className="mt-1 text-black dark:text-white">{selectedAdmin.adminName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Email
                  </label>
                  <p className="mt-1 text-black dark:text-white">{selectedAdmin.adminEmail}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedAdmin(null)}
                    className="px-4 py-2 bg-white/30 dark:bg-gray-800/30 border border-white/50 dark:border-white/20 text-black dark:text-white rounded-md hover:bg-white/40 dark:hover:bg-gray-800/40"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDetails;