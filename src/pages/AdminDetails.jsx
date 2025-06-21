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
  const [loading, setLoading] = useState(true); // <-- new loading state
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
    setLoading(true); // start loading
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
    setLoading(false); // stop loading
  };

  // ... handleInputChange, handleClear, handleAddAdmin unchanged ...

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Details
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedAdmin(null);
            setShowPassword(false);
          }}
          className="cursor-pointer rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-gray-800 dark:text-white backdrop-blur-sm shadow-md hover:bg-white/20 transition"
        >
          + Add Admin User
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="h-[520px] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <WifiLoader className="scale-[2]" />
            <p
              className="text-gray-700 dark:text-gray-200 text-xl font-semibold mt-6"
              style={{ color: "red" }}
            >
              Hey bro, wait a second, fetching data from DB...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 mt-4">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <Card
                key={admin._id}
                onClick={() => setSelectedAdmin(admin)}
                className="flex items-center gap-4 p-4 cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white shadow-md hover:shadow-lg"
              >
                <img
                  src={`${API_BASE}/adminImage/${admin.adminImage}`}
                  onError={(e) => (e.target.src = defaultAvatar)}
                  alt={admin.adminName}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-lg font-semibold">{admin.adminName}</h3>
                  <p className="text-sm">ID: {admin.adminId}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-white/70">No admins found.</p>
          )}
        </div>
      )}

      {/* Add Admin form + Selected admin popup stay as you had them */}
    </div>
  );
};

export default AdminDetails;
