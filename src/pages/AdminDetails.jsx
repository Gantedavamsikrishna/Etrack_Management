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

  const handleAddAdmin = () => {
    // Your add admin logic here
    console.log("Add admin clicked");
  };

  return (
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
    </div>
  );
};

export default AdminDetails;
