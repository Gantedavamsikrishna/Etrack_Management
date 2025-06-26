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

  // Fetch admins
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
      await axios.post(`${API_BASE}/admin/create`, data, {
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative overflow-hidden login-container">
        {/* Main Content */}
        <div className="relative z-10 px-4 py-6">
          {loading ? (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
              <div className="h-[520px] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <WifiLoader className="scale-[2]" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Details
                </h1>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setSelectedAdmin(null);
                    setShowPassword(false);
                  }}
                  className="cursor-pointer rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
                      className="flex items-center gap-4 p-6 m-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <img
                        src={`${API_BASE}/adminImage/${admin.adminImage}`}
                        onError={(e) => (e.target.src = defaultAvatar)}
                        alt={admin.adminName}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{admin.adminName}</h3>
                        <p className="text-sm text-gray-800 dark:text-gray-300">
                          ID: {admin.adminId}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-800 dark:text-gray-300">
                    No admins found.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Add Admin Modal */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]"
            onClick={() => {
              setShowForm(false);
              handleClear();
            }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-600 p-6 w-full max-w-md shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
              <form onSubmit={handleAddAdmin} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 pr-10"
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
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
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
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
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
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]"
            onClick={() => setSelectedAdmin(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-600 p-6 w-full max-w-md shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img
                    src={`${API_BASE}/adminImage/${selectedAdmin.adminImage}`}
                    onError={(e) => (e.target.src = defaultAvatar)}
                    alt={selectedAdmin.adminName}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Admin ID
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedAdmin.adminId}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Name
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedAdmin.adminName}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-teal-700 dark:text-teal-300">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedAdmin.adminEmail}</p>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedAdmin(null)}
                    className="px-4 py-2 bg-white dark:bg-teal-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
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