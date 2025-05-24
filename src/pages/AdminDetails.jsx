
// import React, { useState } from "react";
// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 1,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       role: "Super Admin",
//       phone: "+1 (555) 123-4567",
//       status: "Active",
//       joined: "2023-01-15",
//       bio: "Alice oversees all building operations and user management.",
//       avatar: "https://i.pravatar.cc/150?img=32",
//     },
//     {
//       id: 2,
//       name: "Bob Smith",
//       email: "bob@example.com",
//       role: "Building Admin",
//       phone: "+1 (555) 987-6543",
//       status: "Inactive",
//       joined: "2022-07-22",
//       bio: "Bob manages day-to-day inventory and maintenance requests.",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 3,
//       name: "Carla Reyes",
//       email: "carla.reyes@example.com",
//       role: "Security Admin",
//       phone: "+1 (555) 765-4321",
//       status: "Active",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [newAdmin, setNewAdmin] = useState({
//     name: "",
//     email: "",
//     role: "",
//     phone: "",
//     bio: "",
//     avatar: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () =>
//       setNewAdmin((prev) => ({ ...prev, avatar: reader.result }));
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = (e) => {
//     const avatar = newAdmin.avatar || defaultAvatar;
//     e.preventDefault();
//     if (!newAdmin.name || !newAdmin.email) {
//       alert("Name and Email are required!");
//       return;
//     }

//     if (editId !== null) {
//       setAdmins((prev) =>
//         prev.map((admin) =>
//           admin.id === editId
//             ? { ...admin, ...newAdmin, avatar: newAdmin.avatar || admin.avatar }
//             : admin
//         )
//       );
//       setEditId(null);
//     } else {
//       const id = admins.length + 1;
//       const joined = new Date().toISOString().split("T")[0];
//       const avatar =
//         newAdmin.avatar || `https://i.pravatar.cc/150?img=${id + 30}`;
//       setAdmins((prev) => [
//         ...prev,
//         { id, ...newAdmin, status: "Active", joined, avatar },
//       ]);
//     }

//     setNewAdmin({ name: "", email: "", role: "", phone: "", bio: "", avatar: "" });
//     setShowForm(false);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this admin?")) {
//       setAdmins((prev) => prev.filter((admin) => admin.id !== id));
//       if (editId === id) handleCancel();
//     }
//   };

//   const handleEdit = (admin) => {
//     setEditId(admin.id);
//     setNewAdmin({
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//       phone: admin.phone,
//       bio: admin.bio,
//       avatar: admin.avatar,
//     });
//     setShowForm(true);
//   };

//   const handleCancel = () => {
//     setEditId(null);
//     setShowForm(false);
//     setNewAdmin({ name: "", email: "", role: "", phone: "", bio: "", avatar: "" });
//   };

//   return (
//     <div className="px-4 py-6">
//       {/* Header with Button */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Admin Details</h1>
//         {!showForm && (
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Add Admin User
//           </button>
//         )}
//       </div>

//       {/* Form Section */}
//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
//           <div>
//             <label className="block font-semibold mb-1">Profile Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="block w-full border rounded px-3 py-2"
//             />
//             {newAdmin.avatar && (
//               <img
//                 src={newAdmin.avatar}
//                 alt="Preview"
//                 className="mt-2 w-24 h-24 rounded-full border object-cover"
//               />
//             )}
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Name*</label>
//             <input
//               name="name"
//               value={newAdmin.name}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 bg-gray-300"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Email*</label>
//             <input
//               name="email"
//               type="email"
//               value={newAdmin.email}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 bg-gray-300"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Role</label>
//             <input
//               name="role"
//               value={newAdmin.role}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 bg-gray-300"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Phone</label>
//             <input
//               name="phone"
//               value={newAdmin.phone}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 bg-gray-300"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Bio</label>
//             <textarea
//               name="bio"
//               value={newAdmin.bio}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 bg-gray-300"
//               rows={3}
//             />
//           </div>

//           <div className="flex space-x-3">
//             <button
//               type="submit"
//               className={`px-4 py-2 rounded text-white ${
//                 editId !== null ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
//               } transition`}
//             >
//               {editId !== null ? "Update Admin" : "Add Admin"}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Admin Cards */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {admins.map((admin) => (
//           <div
//             key={admin.id}
//             className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex space-x-4 items-start border border-white/20 transition hover:shadow-xl"
//           >
//             <img
//               src={admin.avatar || defaultAvatar}
//               alt={`${admin.name}'s avatar`}
//               className="w-16 h-16 rounded-full object-cover border"
//             />
//             <div className="flex-1">
//               <h2 className="text-lg font-semibold">{admin.name}</h2>
//               <p className="text-sm text-gray-200">{admin.email}</p>
//               <p className="text-sm text-gray-100">Role: {admin.role || "N/A"}</p>
//               <p className="text-sm text-gray-100">Phone: {admin.phone || "N/A"}</p>
//               <p className="text-sm text-gray-100">Status: {admin.status}</p>
//               <p className="text-sm text-gray-100">Joined: {admin.joined}</p>
//               <p className="text-sm mt-1 italic text-gray-300">{admin.bio}</p>
//             </div>
//             <div className="flex flex-col space-y-2">
//               <button
//                 onClick={() => handleEdit(admin)}
//                 className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(admin.id)}
//                 className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDetails;



// import React, { useState } from "react";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 1,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       role: "Super Admin",
//       phone: "+1 (555) 123-4567",
//       status: "Active",
//       joined: "2023-01-15",
//       bio: "Alice oversees all building operations and user management.",
//       avatar: "https://i.pravatar.cc/150?img=32",
//     },
//     {
//       id: 2,
//       name: "Bob Smith",
//       email: "bob@example.com",
//       role: "Building Admin",
//       phone: "+1 (555) 987-6543",
//       status: "Inactive",
//       joined: "2022-07-22",
//       bio: "Bob manages day-to-day inventory and maintenance requests.",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 3,
//       name: "Carla Reyes",
//       email: "carla.reyes@example.com",
//       role: "Security Admin",
//       phone: "+1 (555) 765-4321",
//       status: "Active",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Admin Details</h1>

//       {/* Admin Cards */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {admins.map((admin) => (
//           <div
//             key={admin.id}
//             onClick={() => setSelectedAdmin(admin)}
//             className="cursor-pointer p-4 bg-white/30 backdrop-blur rounded-2xl shadow-md hover:shadow-lg transition flex items-center space-x-4 border border-gray-300"
//           >
//             <img
//               src={admin.avatar || defaultAvatar}
//               alt={`${admin.name}'s avatar`}
//               className="w-16 h-16 rounded-full object-cover border"
//             />
//             <div>
//               <h2 className="text-lg font-semibold">{admin.name}</h2>
//               <p className="text-sm text-gray-600">{admin.role}</p>
//               <p className="text-sm text-gray-800 font-medium">
//                 Status: <span className={admin.status === "Active" ? "text-green-600" : "text-red-600"}>{admin.status}</span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {selectedAdmin && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//           <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               ×
//             </button>
//             <div className="flex items-center space-x-4 mb-4">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-20 h-20 rounded-full object-cover border"
//               />
//               <div>
//                 <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//                 <p className="text-sm text-gray-600">{selectedAdmin.role}</p>
//               </div>
//             </div>
//             <div className="space-y-1 text-sm">
//               <p><strong>Email:</strong> {selectedAdmin.email}</p>
//               <p><strong>Phone:</strong> {selectedAdmin.phone}</p>
//               <p><strong>Status:</strong> {selectedAdmin.status}</p>
//               <p><strong>Joined:</strong> {selectedAdmin.joined}</p>
//               <p><strong>Bio:</strong> <span className="italic">{selectedAdmin.bio}</span></p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;



import React, { useState } from "react";

const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

const AdminDetails = () => {
  const [admins] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Super Admin",
      phone: "+1 (555) 123-4567",
      status: "Active",
      joined: "2023-01-15",
      bio: "Alice oversees all building operations and user management.",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "Building Admin",
      phone: "+1 (555) 987-6543",
      status: "Inactive",
      joined: "2022-07-22",
      bio: "Bob manages day-to-day inventory and maintenance requests.",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 3,
      name: "Carla Reyes",
      email: "carla.reyes@example.com",
      role: "Security Admin",
      phone: "+1 (555) 765-4321",
      status: "Active",
      joined: "2023-03-10",
      bio: "Carla is responsible for building security and access control.",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Details</h1>

      {/* Admin Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {admins.map((admin) => (
          <div
            key={admin.id}
            onClick={() => setSelectedAdmin(admin)}
            className="cursor-pointer p-4 bg-white/30 backdrop-blur rounded-2xl shadow-md border border-gray-300 transition transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-4"
          >
            <img
              src={admin.avatar || defaultAvatar}
              alt={`${admin.name}'s avatar`}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-lg font-semibold">{admin.name}</h2>
              <p className="text-sm text-gray-600">{admin.role}</p>
              <p className="text-sm text-gray-800 font-medium">
                Status:{" "}
                <span
                  className={
                    admin.status === "Active" ? "text-green-600" : "text-red-600"
                  }
                >
                  {admin.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-600 rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
              onClick={() => setSelectedAdmin(null)}
            >
              ×
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={selectedAdmin.avatar || defaultAvatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border mb-3"
              />
              <h2 className="text-2xl font-bold">{selectedAdmin.name}</h2>
              <p className="text-sm text-gray-500">{selectedAdmin.role}</p>
            </div>
            <div className="space-y-4 text-left text-sm">
              <div>
                <h4 className="font-semibold text-white-700">Email</h4>
                <p>{selectedAdmin.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white-700">Phone</h4>
                <p>{selectedAdmin.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white-700">Status</h4>
                <p>{selectedAdmin.status}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white-700">Joined</h4>
                <p>{selectedAdmin.joined}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white-700">Bio</h4>
                <p className="italic">{selectedAdmin.bio}</p>
              </div>
              <button
                className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                onClick={() => setSelectedAdmin(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminDetails;


