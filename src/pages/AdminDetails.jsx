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

const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";
const API_BASE = "https://etrack-backend.onrender.com";

const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);
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
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "adminImage") {
      setFormData((prev) => ({ ...prev, adminImage: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClear = () => {
    setFormData({
      adminId: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      adminImage: null,
    });
    setShowPassword(false);
  };

  const handleAddAdmin = async () => {
    const { adminId, adminName, adminEmail, adminPassword, adminImage } = formData;

    if (!adminId || !adminName || !adminEmail || !adminPassword) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("adminId", adminId);
    data.append("adminName", adminName);
    data.append("adminEmail", adminEmail);
    data.append("adminPassword", adminPassword);
    if (adminImage) {
      data.append("adminImage", adminImage);
    }

    try {
      await axios.post(`${API_BASE}/admin/create`, data);
      fetchAdmins();
      setShowForm(false);
      handleClear();
    } catch (err) {
      console.error("Error creating admin:", err);
      alert("Failed to create admin.");
    }
  };

  return (
    <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
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

      {/* Add Admin Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-2 sm:p-4"
          onClick={() => setShowForm(false)}
        >
          <Card
            className={cn(
              "relative w-full max-w-md p-6 rounded-2xl bg-white/30 dark:bg-white/10 backdrop-blur-lg border border-white/50 dark:border-white/20 ring-1 ring-white/50 dark:ring-white/20 text-black dark:text-white shadow-md"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/20 rounded-md p-1"
              onClick={() => setShowForm(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Add Admin User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                {[
                  { name: "adminId", type: "number", label: "Admin ID" },
                  { name: "adminName", label: "Name" },
                  { name: "adminEmail", type: "email", label: "Email" },
                  { name: "adminPassword", type: "password", label: "Password" },
                ].map(({ name, type = "text", label }) => (
                  <div key={name} className="relative mb-4">
                    <label className="block mb-1 text-gray-800 dark:text-white/80">{label}</label>
                    <input
                      name={name}
                      type={
                        name === "adminPassword"
                          ? showPassword
                            ? "text"
                            : "password"
                          : type
                      }
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-white/50 dark:border-white/20 bg-white/50 dark:bg-transparent text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={label}
                      required
                    />
                    {name === "adminPassword" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-9 right-3 text-gray-600 dark:text-white"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                ))}

                <div className="mb-4">
                  <label className="block mb-1 text-gray-800 dark:text-white/80">Profile Image</label>
                  <label
                    htmlFor="adminImage"
                    className="flex items-center gap-2 px-3 py-2 border border-white/50 dark:border-white/20 rounded-md cursor-pointer hover:bg-white/20 dark:hover:bg-white/10 text-black dark:text-white bg-white/50 dark:bg-transparent"
                  >
                    <Upload size={16} />
                    {formData.adminImage?.name || "Upload image"}
                  </label>
                  <input
                    type="file"
                    id="adminImage"
                    name="adminImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAdmin}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Cards */}
      {!showForm && (
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
                  <p className="text-sm text-gray-700 dark:text-white/70">ID: {admin.adminId}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-700 dark:text-white/70">No admins found.</p>
          )}
        </div>
      )}

      {/* Admin Details Popup */}
      {selectedAdmin && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedAdmin(null)}
        >
          <div
            className="relative w-full max-w-md p-6 m-2 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-lg border border-gray-300/70 dark:border-white/20 text-black dark:text-white shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/20"
              onClick={() => setSelectedAdmin(null)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <img
                src={`${API_BASE}/adminImage/${selectedAdmin.adminImage}`}
                onError={(e) => (e.target.src = defaultAvatar)}
                alt="avatar"
                className="w-24 h-24 rounded-full mx-auto object-cover border border-gray-300/70 dark:border-white/40"
              />
              <h2 className="text-xl font-bold">{selectedAdmin.adminName}</h2>
              <p className="text-gray-700 dark:text-white/70">ID: {selectedAdmin.adminId}</p>
            </div>

            <div className="mt-6 text-sm space-y-2">
              <div><strong className="text-gray-800 dark:text-white/80">Email:</strong> {selectedAdmin.adminEmail}</div>
              <div><strong className="text-gray-800 dark:text-white/80">Password:</strong> ••••••••</div>
            </div>

            <button
              className="w-full mt-4 px-4 py-2 rounded-md bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-black dark:text-white"
              onClick={() => setSelectedAdmin(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetails;