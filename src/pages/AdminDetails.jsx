import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";
import { X, Upload, Eye, EyeOff } from "lucide-react"; // Icons
import { cn } from "../utils/cn";

const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

const AdminDetails = () => {
  const [admins, setAdmins] = useState([
    {
      id: 101,
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "secret123",
      role: "Super Admin",
      phone: "+1 (555) 123-4567",
      status: "Active",
      joined: "2023-01-15",
      bio: "Alice oversees all building operations and user management.",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 102,
      name: "Bob Smith",
      email: "bob@example.com",
      password: "bobpass456",
      role: "Building Admin",
      phone: "+1 (555) 987-6543",
      status: "Active",
      joined: "2022-07-22",
      bio: "Bob manages day-to-day inventory and maintenance requests.",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 103,
      name: "Carla Reyes",
      email: "carla.reyes@example.com",
      password: "carla789",
      role: "Security Admin",
      phone: "+1 (555) 765-4321",
      status: "Inactive",
      joined: "2023-03-10",
      bio: "Carla is responsible for building security and access control.",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    phone: "",
    profileFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileFile") {
      setFormData((prev) => ({ ...prev, profileFile: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      id: "",
      email: "",
      password: "",
      phone: "",
      profileFile: null,
    });
    setShowPassword(false);
  };

  const handleAddAdmin = () => {
    if (
      !formData.name ||
      !formData.id ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("Please fill all fields except Profile.");
      return;
    }

    const newAdmin = {
      id: Number(formData.id),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "Building Admin",
      phone: formData.phone,
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
      bio: "",
      avatar: formData.profileFile
        ? URL.createObjectURL(formData.profileFile)
        : defaultAvatar,
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setShowForm(false);
    handleClear();
  };

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
          }}
          className="cursor-pointer rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white backdrop-blur-sm shadow-md hover:bg-white/20 transition"
        >
          + Add Admin User
        </button>
      </div>

      {/* Add Admin Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="relative max-w-lg w-full p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button top-right */}
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400"
              onClick={() => setShowForm(false)}
              aria-label="Close Add Admin Form"
            >
              <X className="h-6 w-6" />
            </button>

            <CardHeader>
              <CardTitle>Add Admin User</CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddAdmin();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1 font-semibold" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="id">
                    Admin ID
                  </label>
                  <input
                    id="id"
                    name="id"
                    type="number"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Admin ID"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Password with eye icon */}
                <div className="relative">
                  <label
                    className="block mb-1 font-semibold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 pr-10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-10 right-3 text-white hover:text-white/80"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Phone"
                    required
                  />
                </div>
                {/* Profile Upload with Upload icon */}
                <div>
                  <label
                    className="block mb-1 font-semibold"
                    htmlFor="profileFile"
                  >
                    Profile Upload
                  </label>
                  <label
                    htmlFor="profileFile"
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-white/30 px-3 py-2 text-white hover:bg-white/20 transition"
                  >
                    <Upload className="h-5 w-5" />
                    {formData.profileFile
                      ? formData.profileFile.name
                      : "Attach file"}
                  </label>
                  <input
                    type="file"
                    id="profileFile"
                    name="profileFile"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition"
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition"
                  >
                    Add Admin
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show cards only if form not visible */}
      {!showForm && (
        <div className="grid gap-6 md:grid-cols-2 mt-4">
          {admins.map((admin) => (
            <Card
              key={admin.id}
              onClick={() => setSelectedAdmin(admin)}
              hover
              className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              <img
  src={admin.avatar || defaultAvatar}
  alt={`${admin.name}'s avatar`}
  className="w-14 h-14 rounded-full object-cover border"
/>

              <div>
                <h3 className="text-lg font-semibold">{admin.name}</h3>
                <p className="text-sm text-white/70">ID: {admin.id}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Modal popup for admin details */}
      {selectedAdmin && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
          onClick={() => setSelectedAdmin(null)}
        >
          <div
            className={cn(
              "relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-6",
              "shadow-lg shadow-black/10 dark:shadow-white/10",
              "bg-white/10 dark:bg-white/10 backdrop-blur-md",
              "border border-white/20 ring-1 ring-white/20",
              "text-white transition-colors duration-300",
              "max-h-[90vh] overflow-auto"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400"
              onClick={() => setSelectedAdmin(null)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <img
                src={selectedAdmin.avatar || defaultAvatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover mx-auto border"
              />
              <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
              <p className="text-sm text-white/80">ID: {selectedAdmin.id}</p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-white/70">Email</h4>
                <p>{selectedAdmin.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white/70">Password</h4>
                <p className="tracking-widest">••••••••</p>
              </div>
              <div>
                <h4 className="font-semibold text-white/70">Phone</h4>
                <p>{selectedAdmin.phone}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedAdmin(null)}
              className="w-full mt-6 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105  duration-300 rounded-lg"
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