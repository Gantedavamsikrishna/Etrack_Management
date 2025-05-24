
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../components/ui/Card";
// import { X } from "lucide-react";
// import { cn } from "../utils/cn";

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
//       status: "Active",
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
//       status: "Inactive",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     status: "",
//     joined: "",
//     bio: "",
//     avatar: "",
//   });

//   // Validation state
//   const [errors, setErrors] = useState({});

//   // Validate fields and set errors
//   const validate = () => {
//     const newErrors = {};
//     if (!newAdmin.name.trim()) newErrors.name = "Name is required";
//     if (!newAdmin.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newAdmin.email)
//     ) {
//       newErrors.email = "Invalid email address";
//     }
//     return newErrors;
//   };

//   // Handle input change + validate field on the fly
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));

//     // Validate just this field
//     setErrors((prev) => {
//       const newErrors = { ...prev };
//       if (name === "name" && !value.trim()) {
//         newErrors.name = "Name is required";
//       } else if (name === "name") {
//         delete newErrors.name;
//       }
//       if (name === "email") {
//         if (!value.trim()) {
//           newErrors.email = "Email is required";
//         } else if (
//           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
//         ) {
//           newErrors.email = "Invalid email address";
//         } else {
//           delete newErrors.email;
//         }
//       }
//       return newErrors;
//     });
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewAdmin((prev) => ({ ...prev, avatar: imageUrl }));
//     }
//   };

//   const handleAddAdmin = () => {
//     const formErrors = validate();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }
//     setAdmins((prev) => [...prev, { ...newAdmin, id: Date.now() }]);
//     setNewAdmin({
//       name: "",
//       email: "",
//       phone: "",
//       role: "",
//       status: "",
//       joined: "",
//       bio: "",
//       avatar: "",
//     });
//     setErrors({});
//     setShowAddForm(false);
//   };

//   const isFormValid = () => {
//     const validationErrors = validate();
//     return Object.keys(validationErrors).length === 0;
//   };

//   return (
//     <div className="px-4 py-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Admin Details
//         </h1>
//         {!showAddForm && (
//           <Card
//             className="p-2 px-4 cursor-pointer"
//             onClick={() => setShowAddForm(true)}
//           >
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
//               + Add Admin User
//             </span>
//           </Card>
//         )}
//       </div>

//       {showAddForm && (
//         <div className="mt-8">
//           <Card className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
//             <CardHeader className="flex justify-between items-center">
//               <CardTitle>Add New Admin</CardTitle>
//               <button
//                 onClick={() => {
//                   setShowAddForm(false);
//                   setErrors({});
//                 }}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium block mb-1">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newAdmin.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter full name"
//                     className={cn(
//                       "w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2",
//                       errors.name
//                         ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900"
//                         : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//                     )}
//                   />
//                   {errors.name && (
//                     <p className="mt-1 text-xs text-red-500">{errors.name}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={newAdmin.email}
//                     onChange={handleInputChange}
//                     placeholder="example@domain.com"
//                     className={cn(
//                       "w-full px-3 py-2 rounded-md border text-sm",
//                       errors.email
//                         ? "border-red-500 bg-red-50 dark:bg-red-900"
//                         : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//                     )}
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-xs text-red-500">{errors.email}</p>
//                   )}
//                 </div>
//                 {/* The rest of the inputs unchanged */}
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     value={newAdmin.phone}
//                     onChange={handleInputChange}
//                     placeholder="+1 (555) 123-4567"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Role</label>
//                   <input
//                     type="text"
//                     name="role"
//                     value={newAdmin.role}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Super Admin"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Status</label>
//                   <input
//                     type="text"
//                     name="status"
//                     value={newAdmin.status}
//                     onChange={handleInputChange}
//                     placeholder="Active or Inactive"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Joined</label>
//                   <input
//                     type="date"
//                     name="joined"
//                     value={newAdmin.joined}
//                     onChange={handleInputChange}
//                     placeholder="YYYY-MM-DD"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="text-sm font-medium block mb-1">
//                     Edit Profile (Choose file)
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full text-sm text-gray-700 dark:text-gray-300"
//                   />
//                   {newAdmin.avatar && (
//                     <img
//                       src={newAdmin.avatar}
//                       alt="Preview"
//                       className="mt-2 w-24 h-24 rounded-full object-cover border"
//                     />
//                   )}
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="text-sm font-medium block mb-1">Bio</label>
//                   <textarea
//                     name="bio"
//                     value={newAdmin.bio}
//                     onChange={handleInputChange}
//                     placeholder="Short description about admin..."
//                     rows={3}
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm resize-none"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <button
//                 onClick={handleAddAdmin}
//                 disabled={!isFormValid()}
//                 className={cn(
//                   "px-3 sm:px-4 py-1.5 text-xs sm:text-sm border-white/20 transform transition-all duration-300 ease-in-out",
//                   isFormValid()
//                     ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
//                     : "bg-white/20 text-white/50 cursor-not-allowed"
//                 )}
//               >
//                 Add Admin
//               </button>
//             </CardFooter>
//           </Card>
//         </div>
//       )}

//       {!showAddForm && (
//         <div className="grid gap-6 md:grid-cols-2 mt-8">
//           {admins.map((admin) => (
//             <Card
//               key={admin.id}
//               onClick={() => setSelectedAdmin(admin)}
//               hover
//               className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//             >
//               <img
//                 src={admin.avatar || defaultAvatar}
//                 alt={`${admin.name}'s avatar`}
//                 className="w-14 h-14 rounded-full object-cover border"
//               />
//               <div>
//                 <h3 className="text-lg font-semibold">{admin.name}</h3>
//                 <p className="text-sm text-white/70">{admin.role}</p>
//                 <span
//                   className={cn(
//                     "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
//                     admin.status === "Active"
//                       ? "bg-green-600 text-white"
//                       : "bg-red-600 text-white"
//                   )}
//                 >
//                   {admin.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {selectedAdmin && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
//           onClick={() => setSelectedAdmin(null)}
//         >
//           <div
//             className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="text-center space-y-4">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover mx-auto border"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-white/80">{selectedAdmin.role}</p>
//             </div>

//             <div className="mt-6 space-y-4 text-sm">
//               <div>
//                 <h4 className="font-semibold text-white/70">Email</h4>
//                 <p>{selectedAdmin.email}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Phone</h4>
//                 <p>{selectedAdmin.phone}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Status</h4>
//                 <p>{selectedAdmin.status}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Joined</h4>
//                 <p>{selectedAdmin.joined}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Bio</h4>
//                 <p className="italic">{selectedAdmin.bio}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;










// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../components/ui/Card";
// import { X } from "lucide-react";
// import { cn } from "../utils/cn";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 1,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       password: "secret123",
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
//       password: "bobpass456",
//       role: "Building Admin",
//       phone: "+1 (555) 987-6543",
//       status: "Active",
//       joined: "2022-07-22",
//       bio: "Bob manages day-to-day inventory and maintenance requests.",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 3,
//       name: "Carla Reyes",
//       email: "carla.reyes@example.com",
//       password: "carla789",
//       role: "Security Admin",
//       phone: "+1 (555) 765-4321",
//       status: "Inactive",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//         Admin Details
//       </h1>

//       {/* Admin Cards */}
//       <div className="grid gap-6 md:grid-cols-2 mt-4">
//         {admins.map((admin) => (
//           <Card
//             key={admin.id}
//             onClick={() => setSelectedAdmin(admin)}
//             hover
//             className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//           >
//             <img
//               src={admin.avatar || defaultAvatar}
//               alt={`${admin.name}'s avatar`}
//               className="w-14 h-14 rounded-full object-cover border"
//             />
//             <div>
//               <h3 className="text-lg font-semibold">{admin.name}</h3>
//               <p className="text-sm text-white/70">ID: {admin.id}</p>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Modal Popup */}
//       {selectedAdmin && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
//           onClick={() => setSelectedAdmin(null)}
//         >
//           <div
//             className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="text-center space-y-2">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover mx-auto border"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-white/80">ID: {selectedAdmin.id}</p>
//             </div>

//             <div className="mt-6 space-y-4 text-sm">
//               <div>
//                 <h4 className="font-semibold text-white/70">Email</h4>
//                 <p>{selectedAdmin.email}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Password</h4>
//                 <p className="tracking-widest">••••••••</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Phone</h4>
//                 <p>{selectedAdmin.phone}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;











// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../components/ui/Card";
// import { X } from "lucide-react";
// import { cn } from "../utils/cn";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 1,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       password: "secret123",
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
//       password: "bobpass456",
//       role: "Building Admin",
//       phone: "+1 (555) 987-6543",
//       status: "Active",
//       joined: "2022-07-22",
//       bio: "Bob manages day-to-day inventory and maintenance requests.",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 3,
//       name: "Carla Reyes",
//       email: "carla.reyes@example.com",
//       password: "carla789",
//       role: "Security Admin",
//       phone: "+1 (555) 765-4321",
//       status: "Inactive",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   return (
//     <div className="px-4 py-6">
//       {/* Header and Add Button */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Admin Details
//         </h1>
//         <Card
//           className="cursor-pointer px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//           onClick={() => alert("Add Admin form goes here")}
//         >
//           + Add Admin User
//         </Card>
//       </div>

//       {/* Admin Cards */}
//       <div className="grid gap-6 md:grid-cols-2 mt-4">
//         {admins.map((admin) => (
//           <Card
//             key={admin.id}
//             onClick={() => setSelectedAdmin(admin)}
//             hover
//             className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//           >
//             <img
//               src={admin.avatar || defaultAvatar}
//               alt={`${admin.name}'s avatar`}
//               className="w-14 h-14 rounded-full object-cover border"
//             />
//             <div>
//               <h3 className="text-lg font-semibold">{admin.name}</h3>
//               <p className="text-sm text-white/70">ID: {admin.id}</p>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Modal Popup */}
//       {selectedAdmin && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
//           onClick={() => setSelectedAdmin(null)}
//         >
//           <div
//             className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="text-center space-y-2">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover mx-auto border"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-white/80">ID: {selectedAdmin.id}</p>
//             </div>

//             <div className="mt-6 space-y-4 text-sm">
//               <div>
//                 <h4 className="font-semibold text-white/70">Email</h4>
//                 <p>{selectedAdmin.email}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Password</h4>
//                 <p className="tracking-widest">••••••••</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Phone</h4>
//                 <p>{selectedAdmin.phone}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;








// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../components/ui/Card";
// import { X } from "lucide-react";
// import { cn } from "../utils/cn";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//  const [admins, setAdmins] = useState([
//   {
//     id: 1,
//     name: "Alice Johnson",
//     email: "alice@example.com",
//     password: "secret123",
//     role: "Super Admin",
//     phone: "+1 (555) 123-4567",
//     status: "Active",
//     joined: "2023-01-15",
//     bio: "Alice oversees all building operations and user management.",
//     avatar: "https://i.pravatar.cc/150?img=32",
//   },
//   {
//     id: 2,
//     name: "Bob Smith",
//     email: "bob@example.com",
//     password: "bobpass456",
//     role: "Building Admin",
//     phone: "+1 (555) 987-6543",
//     status: "Active",
//     joined: "2022-07-22",
//     bio: "Bob manages day-to-day inventory and maintenance requests.",
//     avatar: "https://i.pravatar.cc/150?img=12",
//   },
//   {
//     id: 3,
//     name: "Carla Reyes",
//     email: "carla.reyes@example.com",
//     password: "carla789",
//     role: "Security Admin",
//     phone: "+1 (555) 765-4321",
//     status: "Inactive",
//     joined: "2023-03-10",
//     bio: "Carla is responsible for building security and access control.",
//     avatar: "https://i.pravatar.cc/150?img=45",
//   },
// ]);


//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     id: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "",
//     avatar: "",
//   });

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleAddAdmin = () => {
//     if (
//       formData.name &&
//       formData.id &&
//       formData.email &&
//       formData.password &&
//       formData.phone &&
//       formData.role
//     ) {
//       setAdmins((prev) => [...prev, { ...formData, status: "Active", joined: new Date().toISOString().split("T")[0], bio: "", }]);
//       setFormData({ name: "", id: "", email: "", password: "", phone: "", role: "", avatar: "" });
//       setShowForm(false);
//     }
//   };

//   const handleClear = () => {
//     setFormData({ name: "", id: "", email: "", password: "", phone: "", role: "", avatar: "" });
//   };

//   return (
//     <div className="px-4 py-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Admin Details
//         </h1>
//         <button
//           onClick={() => setShowForm((prev) => !prev)}
//           className="px-4 py-2 rounded-xl text-white bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition"
//         >
//           + Add Admin User
//         </button>
//       </div>

//       {/* Admin Form */}
//       {showForm && (
//         <Card className="p-6 mb-6 bg-white/10 border border-white/20 text-white backdrop-blur-md rounded-xl shadow-md">
//           <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20"
//             />
//             <input
//               type="text"
//               name="id"
//               placeholder="Admin ID"
//               value={formData.id}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20"
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20"
//             />
//             <input
//               type="text"
//               name="role"
//               placeholder="Role"
//               value={formData.role}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20"
//             />
//             <input
//               type="url"
//               name="avatar"
//               placeholder="Profile URL (optional)"
//               value={formData.avatar}
//               onChange={handleInputChange}
//               className="p-2 rounded-lg bg-white/10 border border-white/20 col-span-1 md:col-span-2"
//             />
//           </div>
//           <div className="flex justify-end gap-4 mt-6">
//             <button
//               onClick={handleClear}
//               className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
//             >
//               Clear
//             </button>
//             <button
//               onClick={handleAddAdmin}
//               className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
//             >
//               Add Admin
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* Admin Cards */}
//       <div className="grid gap-6 md:grid-cols-2 mt-4">
//         {admins.map((admin) => (
//           <Card
//             key={admin.id}
//             onClick={() => setSelectedAdmin(admin)}
//             hover
//             className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//           >
//             <img
//               src={admin.avatar || defaultAvatar}
//               alt={`${admin.name}'s avatar`}
//               className="w-14 h-14 rounded-full object-cover border"
//             />
//             <div>
//               <h3 className="text-lg font-semibold">{admin.name}</h3>
//               <p className="text-sm text-white/70">ID: {admin.id}</p>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Modal Popup */}
//       {selectedAdmin && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
//           onClick={() => setSelectedAdmin(null)}
//         >
//           <div
//             className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="text-center space-y-2">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover mx-auto border"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-white/80">ID: {selectedAdmin.id}</p>
//             </div>

//             <div className="mt-6 space-y-4 text-sm">
//               <div>
//                 <h4 className="font-semibold text-white/70">Email</h4>
//                 <p>{selectedAdmin.email}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Password</h4>
//                 <p className="tracking-widest">••••••••</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Phone</h4>
//                 <p>{selectedAdmin.phone}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;












// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../components/ui/Card";
// import { X, Upload } from "lucide-react";
// import { cn } from "../utils/cn";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 1,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       password: "secret123",
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
//       password: "bobpass456",
//       role: "Building Admin",
//       phone: "+1 (555) 987-6543",
//       status: "Active",
//       joined: "2022-07-22",
//       bio: "Bob manages day-to-day inventory and maintenance requests.",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 3,
//       name: "Carla Reyes",
//       email: "carla.reyes@example.com",
//       password: "carla789",
//       role: "Security Admin",
//       phone: "+1 (555) 765-4321",
//       status: "Inactive",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     id: "",
//     email: "",
//     password: "",
//     phone: "",
//     profileFile: null,
//   });

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "profileFile") {
//       setFormData((prev) => ({ ...prev, profileFile: files[0] || null }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleClear = () => {
//     setFormData({
//       name: "",
//       id: "",
//       email: "",
//       password: "",
//       phone: "",
//       profileFile: null,
//     });
//   };

//   const handleAddAdmin = () => {
//     if (!formData.name || !formData.id || !formData.email || !formData.password || !formData.phone) {
//       alert("Please fill all fields except Profile.");
//       return;
//     }

//     // Create new admin object
//     const newAdmin = {
//       id: Number(formData.id),
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       role: "Building Admin", // or default role
//       phone: formData.phone,
//       status: "Active",
//       joined: new Date().toISOString().split("T")[0],
//       bio: "",
//       avatar: formData.profileFile
//         ? URL.createObjectURL(formData.profileFile)
//         : defaultAvatar,
//     };

//     setAdmins((prev) => [...prev, newAdmin]);
//     setShowForm(false);
//     handleClear();
//   };

//   return (
//     <div className="px-4 py-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Admin Details
//         </h1>
//         <button
//           onClick={() => {
//             setShowForm(true);
//             setSelectedAdmin(null);
//           }}
//           className="cursor-pointer rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white backdrop-blur-sm shadow-md hover:bg-white/20 transition"
//         >
//           + Add Admin User
//         </button>
//       </div>

//       {/* Show form if showForm is true */}
//       {showForm ? (
//         <Card className="max-w-md mx-auto p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md">
//           <CardHeader>
//             <CardTitle>Add Admin User</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddAdmin();
//               }}
//               className="space-y-4"
//             >
//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="name">
//                   Full Name
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Full Name"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="id">
//                   Admin ID
//                 </label>
//                 <input
//                   id="id"
//                   name="id"
//                   type="number"
//                   value={formData.id}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Admin ID"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="email">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Email"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="password">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Password"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="phone">
//                   Phone
//                 </label>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Phone"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="profileFile">
//                   Profile Upload
//                 </label>
//                 <label
//                   htmlFor="profileFile"
//                   className="flex cursor-pointer items-center gap-2 rounded-md border border-white/30 px-3 py-2 text-white hover:bg-white/20 transition"
//                 >
//                   <Upload className="h-5 w-5" />
//                   {formData.profileFile ? formData.profileFile.name : "Choose file"}
//                 </label>
//                 <input
//                   type="file"
//                   id="profileFile"
//                   name="profileFile"
//                   accept="image/*"
//                   onChange={handleInputChange}
//                   className="hidden"
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-between pt-4">
//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="rounded-lg bg-white/20 px-6 py-2 text-white hover:bg-white/30 transition"
//                 >
//                   Clear
//                 </button>

//                 <button
//                   type="submit"
//                   className="rounded-lg bg-white/20 px-6 py-2 text-white hover:bg-white/30 transition"
//                 >
//                   Add Admin
//                 </button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       ) : (
//         // Show cards only if form not visible
//         <div className="grid gap-6 md:grid-cols-2 mt-4">
//           {admins.map((admin) => (
//             <Card
//               key={admin.id}
//               onClick={() => setSelectedAdmin(admin)}
//               hover
//               className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//             >
//               <img
//                 src={admin.avatar || defaultAvatar}
//                 alt={`${admin.name}'s avatar`}
//                 className="w-14 h-14 rounded-full object-cover border"
//               />
//               <div>
//                 <h3 className="text-lg font-semibold">{admin.name}</h3>
//                 <p className="text-sm text-white/70">ID: {admin.id}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Modal Popup for selected admin */}
//       {selectedAdmin && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
//           onClick={() => setSelectedAdmin(null)}
//         >
//           <div
//             className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="text-center space-y-2">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover mx-auto border"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-white/80">ID: {selectedAdmin.id}</p>
//             </div>

//             <div className="mt-6 space-y-4 text-sm">
//               <div>
//                 <h4 className="font-semibold text-white/70">Email</h4>
//                 <p>{selectedAdmin.email}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Password</h4>
//                 <p className="tracking-widest">••••••••</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Phone</h4>
//                 <p>{selectedAdmin.phone}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;





// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../components/ui/Card";
// import { X, Upload, Paperclip } from "lucide-react";  // Added Paperclip icon
// import { cn } from "../utils/cn";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 101,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       password: "secret123",
//       role: "Super Admin",
//       phone: "+1 (555) 123-4567",
//       status: "Active",
//       joined: "2023-01-15",
//       bio: "Alice oversees all building operations and user management.",
//       avatar: "https://i.pravatar.cc/150?img=32",
//     },
//     {
//       id: 102,
//       name: "Bob Smith",
//       email: "bob@example.com",
//       password: "bobpass456",
//       role: "Building Admin",
//       phone: "+1 (555) 987-6543",
//       status: "Active",
//       joined: "2022-07-22",
//       bio: "Bob manages day-to-day inventory and maintenance requests.",
//       avatar: "https://i.pravatar.cc/150?img=12",
//     },
//     {
//       id: 103,
//       name: "Carla Reyes",
//       email: "carla.reyes@example.com",
//       password: "carla789",
//       role: "Security Admin",
//       phone: "+1 (555) 765-4321",
//       status: "Inactive",
//       joined: "2023-03-10",
//       bio: "Carla is responsible for building security and access control.",
//       avatar: "https://i.pravatar.cc/150?img=45",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     id: "",
//     email: "",
//     password: "",
//     phone: "",
//     profileFile: null,
//   });

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "profileFile") {
//       setFormData((prev) => ({ ...prev, profileFile: files[0] || null }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleClear = () => {
//     setFormData({
//       name: "",
//       id: "",
//       email: "",
//       password: "",
//       phone: "",
//       profileFile: null,
//     });
//   };

//   const handleAddAdmin = () => {
//     if (!formData.name || !formData.id || !formData.email || !formData.password || !formData.phone) {
//       alert("Please fill all fields except Profile.");
//       return;
//     }

//     // Create new admin object
//     const newAdmin = {
//       id: Number(formData.id),
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       role: "Building Admin", // or default role
//       phone: formData.phone,
//       status: "Active",
//       joined: new Date().toISOString().split("T")[0],
//       bio: "",
//       avatar: formData.profileFile
//         ? URL.createObjectURL(formData.profileFile)
//         : defaultAvatar,
//     };

//     setAdmins((prev) => [...prev, newAdmin]);
//     setShowForm(false);
//     handleClear();
//   };

//   return (
//     <div className="px-4 py-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Admin Details
//         </h1>
//         <button
//           onClick={() => {
//             setShowForm(true);
//             setSelectedAdmin(null);
//           }}
//           className="cursor-pointer rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-white backdrop-blur-sm shadow-md hover:bg-white/20 transition"
//         >
//           + Add Admin User
//         </button>
//       </div>

//       {/* Show form if showForm is true */}
//       {showForm ? (
//         <Card className="max-w-lg mx-auto p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md">
//           <CardHeader>
//             <CardTitle>Add Admin User</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddAdmin();
//               }}
//               className="space-y-4"
//             >
//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="name">
//                   Full Name
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Full Name"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="id">
//                   Admin ID
//                 </label>
//                 <input
//                   id="id"
//                   name="id"
//                   type="number"
//                   value={formData.id}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Admin ID"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="email">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Email"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="password">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Password"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="phone">
//                   Phone
//                 </label>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-white/30 bg-transparent px-3 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
//                   placeholder="Phone"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold" htmlFor="profileFile">
//                   Profile Upload
//                 </label>
//                 <label
//                   htmlFor="profileFile"
//                   className="flex cursor-pointer items-center gap-2 rounded-md border border-white/30 px-3 py-2 text-white hover:bg-white/20 transition"
//                 >
//                   <Paperclip className="h-5 w-5" />
//                   {formData.profileFile ? formData.profileFile.name : "Attach file"}
//                 </label>
//                 <input
//                   type="file"
//                   id="profileFile"
//                   name="profileFile"
//                   accept="image/*"
//                   onChange={handleInputChange}
//                   className="hidden"
//                 />
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-between pt-4">
//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition"
//                 >
//                   Clear
//                 </button>

//                 <button
//                   type="submit"
//                   className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition"
//                 >
//                   Add Admin
//                 </button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       ) : (
//         // Show cards only if form not visible
//         <div className="grid gap-6 md:grid-cols-2 mt-4">
//           {admins.map((admin) => (
//             <Card
//               key={admin.id}
//               onClick={() => setSelectedAdmin(admin)}
//               hover
//               className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//             >
//               <img
//                 src={admin.avatar || defaultAvatar}
//                 alt={`${admin.name}'s avatar`}
//                 className="w-14 h-14 rounded-full object-cover border"
//               />
//               <div>
//                 <h3 className="text-lg font-semibold">{admin.name}</h3>
//                 <p className="text-sm text-white/70">ID: {admin.id}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Modal Popup for selected admin */}
//       {selectedAdmin && (
//         <div
//           className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
//           onClick={() => setSelectedAdmin(null)}
//         >
//           <div
//             className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>

//             <div className="text-center space-y-2">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 alt="avatar"
//                 className="w-24 h-24 rounded-full object-cover mx-auto border"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-white/80">ID: {selectedAdmin.id}</p>
//             </div>

//             <div className="mt-6 space-y-4 text-sm">
//               <div>
//                 <h4 className="font-semibold text-white/70">Email</h4>
//                 <p>{selectedAdmin.email}</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Password</h4>
//                 <p className="tracking-widest">••••••••</p>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-white/70">Phone</h4>
//                 <p>{selectedAdmin.phone}</p>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;





import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";
import { X, Upload, Eye, EyeOff } from "lucide-react";  // Added Eye and EyeOff icons
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

  // Password visibility toggle state
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

    // Create new admin object
    const newAdmin = {
      id: Number(formData.id),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "Building Admin", // or default role
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

      {/* Show form if showForm is true */}
      {showForm ? (
        <Card className="max-w-lg mx-auto p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md">
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
                <label className="block mb-1 font-semibold" htmlFor="password">
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
                  className="absolute top-1/2 right-3 top-3-translate-y-1/2 text-white hover:text-white/80"
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
                <label className="block mb-1 font-semibold" htmlFor="profileFile">
                  Profile Upload
                </label>
                <label
                  htmlFor="profileFile"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-white/30 px-3 py-2 text-white hover:bg-white/20 transition"
                >
                  <Upload className="h-5 w-5" /> {/* Changed icon here */}
                  {formData.profileFile ? formData.profileFile.name : "Attach file"}
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
      ) : (
        // Show cards only if form not visible
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
              className="mt-6 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
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







