


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

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddAdmin = () => {
//     if (!newAdmin.name || !newAdmin.email) return;
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
//     setShowAddForm(false);
//   };

//   return (
//     <div className="px-4 py-6">
//       {/* Page Header */}
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


//       {showAddForm ? (
//   <div className="mt-8">
//     <Card className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
//       <CardHeader className="flex justify-between items-center">
//         <CardTitle>Add New Admin</CardTitle>
//         <button
//           onClick={() => setShowAddForm(false)}
//           className="text-gray-500 hover:text-red-500"
//         >
//           <X className="h-5 w-5" />
//         </button>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm font-medium block mb-1">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={newAdmin.name}
//               onChange={handleInputChange}
//               placeholder="Enter full name"
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium block mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={newAdmin.email}
//               onChange={handleInputChange}
//               placeholder="example@domain.com"
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium block mb-1">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={newAdmin.phone}
//               onChange={handleInputChange}
//               placeholder="+1 (555) 123-4567"
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium block mb-1">Role</label>
//             <input
//               type="text"
//               name="role"
//               value={newAdmin.role}
//               onChange={handleInputChange}
//               placeholder="e.g., Super Admin"
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium block mb-1">Status</label>
//             <input
//               type="text"
//               name="status"
//               value={newAdmin.status}
//               onChange={handleInputChange}
//               placeholder="Active or Inactive"
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium block mb-1">Joined</label>
//             <input
//               type="date"
//               name="joined"
//               value={newAdmin.joined}
//               onChange={handleInputChange}
//               placeholder="YYYY-MM-DD"
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="text-sm font-medium block mb-1">Avatar URL</label>
//             <input
//               type="text"
//               name="avatar"
//               value={newAdmin.avatar}
//               onChange={handleInputChange}
//               placeholder="https://..."
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label className="text-sm font-medium block mb-1">Bio</label>
//             <textarea
//               name="bio"
//               value={newAdmin.bio}
//               onChange={handleInputChange}
//               placeholder="Short description about admin..."
//               rows={3}
//               className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm resize-none"
//             />
//           </div>
//         </div>
//       </CardContent>
//       <CardFooter>
//         <button
//           onClick={handleAddAdmin}
//           className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
//         >
//           Add Admin
//         </button>
//       </CardFooter>
//     </Card>
//   </div>
// ) : null}

// {!showAddForm && (
//   <div className="grid gap-6 md:grid-cols-2 mt-8">
//     {admins.map((admin) => (
//       <Card
//         key={admin.id}
//         onClick={() => setSelectedAdmin(admin)}
//         hover
//         className="flex items-center space-x-4 p-4 cursor-pointer backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl shadow-md hover:shadow-lg transition"
//       >
//         <img
//           src={admin.avatar || defaultAvatar}
//           alt={`${admin.name}'s avatar`}
//           className="w-14 h-14 rounded-full object-cover border"
//         />
//         <div>
//           <h3 className="text-lg font-semibold">{admin.name}</h3>
//           <p className="text-sm text-white/70">{admin.role}</p>
//           <span
//             className={cn(
//               "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
//               admin.status === "Active"
//                 ? "bg-green-600 text-white"
//                 : "bg-red-600 text-white"
//             )}
//           >
//             {admin.status}
//           </span>
//         </div>
//       </Card>
//     ))}
//   </div>
// )}



//       {/* Admin Detail Modal */}
//       {selectedAdmin && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in">
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
//     avatar: "", // Will hold the image preview URL (base64 or object URL)
//   });

//   // Handle text input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle image file input change
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Create a local URL to preview the image
//       const imageUrl = URL.createObjectURL(file);
//       setNewAdmin((prev) => ({ ...prev, avatar: imageUrl }));
//     }
//   };

//   const handleAddAdmin = () => {
//     if (!newAdmin.name || !newAdmin.email) return;
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
//     setShowAddForm(false);
//   };

//   return (
//     <div className="px-4 py-6">
//       {/* Page Header */}
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

//       {showAddForm ? (
//         <div className="mt-8">
//           <Card className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
//             <CardHeader className="flex justify-between items-center">
//               <CardTitle>Add New Admin</CardTitle>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newAdmin.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter full name"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={newAdmin.email}
//                     onChange={handleInputChange}
//                     placeholder="example@domain.com"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//                   />
//                 </div>
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

//                 {/* File input for avatar */}
//                 <div className="md:col-span-2">
//                   <label className="text-sm font-medium block mb-1">Edit Profile (Choose file)</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full text-sm text-gray-700 dark:text-gray-300"
//                   />
//                   {/* Preview chosen image */}
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
//                 className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
//               >
//                 Add Admin
//               </button>
//             </CardFooter>
//           </Card>
//         </div>
//       ) : null}

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

//       {/* Admin Detail Modal */}
//       {selectedAdmin && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in">
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

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewAdmin((prev) => ({ ...prev, avatar: imageUrl }));
//     }
//   };

//   const handleAddAdmin = () => {
//     if (!newAdmin.name || !newAdmin.email) return;
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
//     setShowAddForm(false);
//   };

//   return (
//     <div className="px-4 py-6">
//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Admin Details
//         </h1>
//         {!showAddForm && (
//           <button
//             onClick={() => setShowAddForm(true)}
//             className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
//           >
//             + Add Admin User
//           </button>
//         )}
//       </div>

//       {showAddForm && (
//         <div className="mt-8">
//           <Card className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
//             <CardHeader className="flex justify-between items-center">
//               <CardTitle>Add New Admin</CardTitle>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* ... form inputs as is ... */}
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newAdmin.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter full name"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 {/* Repeat for all other inputs unchanged... */}
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={newAdmin.email}
//                     onChange={handleInputChange}
//                     placeholder="example@domain.com"
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
//                   />
//                 </div>
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
//                   <label className="text-sm font-medium block mb-1">Edit Profile (Choose file)</label>
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
//                 className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
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

//       {/* Admin Detail Modal */}
//       {selectedAdmin && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in">
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











import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

const AdminDetails = () => {
  const [admins, setAdmins] = useState([
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
      status: "Active",
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
      status: "Inactive",
      joined: "2023-03-10",
      bio: "Carla is responsible for building security and access control.",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    joined: "",
    bio: "",
    avatar: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Validate fields and set errors
  const validate = () => {
    const newErrors = {};
    if (!newAdmin.name.trim()) newErrors.name = "Name is required";
    if (!newAdmin.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newAdmin.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    return newErrors;
  };

  // Handle input change + validate field on the fly
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));

    // Validate just this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "name" && !value.trim()) {
        newErrors.name = "Name is required";
      } else if (name === "name") {
        delete newErrors.name;
      }
      if (name === "email") {
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          newErrors.email = "Invalid email address";
        } else {
          delete newErrors.email;
        }
      }
      return newErrors;
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewAdmin((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleAddAdmin = () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setAdmins((prev) => [...prev, { ...newAdmin, id: Date.now() }]);
    setNewAdmin({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "",
      joined: "",
      bio: "",
      avatar: "",
    });
    setErrors({});
    setShowAddForm(false);
  };

  const isFormValid = () => {
    const validationErrors = validate();
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Details
        </h1>
        {!showAddForm && (
          <Card
            className="p-2 px-4 cursor-pointer"
            onClick={() => setShowAddForm(true)}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
              + Add Admin User
            </span>
          </Card>
        )}
      </div>

      {showAddForm && (
        <div className="mt-8">
          <Card className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Add New Admin</CardTitle>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setErrors({});
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={cn(
                      "w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2",
                      errors.name
                        ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    placeholder="example@domain.com"
                    className={cn(
                      "w-full px-3 py-2 rounded-md border text-sm",
                      errors.email
                        ? "border-red-500 bg-red-50 dark:bg-red-900"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                {/* The rest of the inputs unchanged */}
                <div>
                  <label className="text-sm font-medium block mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={newAdmin.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={newAdmin.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Super Admin"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={newAdmin.status}
                    onChange={handleInputChange}
                    placeholder="Active or Inactive"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Joined</label>
                  <input
                    type="date"
                    name="joined"
                    value={newAdmin.joined}
                    onChange={handleInputChange}
                    placeholder="YYYY-MM-DD"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">
                    Edit Profile (Choose file)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-700 dark:text-gray-300"
                  />
                  {newAdmin.avatar && (
                    <img
                      src={newAdmin.avatar}
                      alt="Preview"
                      className="mt-2 w-24 h-24 rounded-full object-cover border"
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={newAdmin.bio}
                    onChange={handleInputChange}
                    placeholder="Short description about admin..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm resize-none"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button
                onClick={handleAddAdmin}
                disabled={!isFormValid()}
                className={cn(
                  "px-3 sm:px-4 py-1.5 text-xs sm:text-sm border-white/20 transform transition-all duration-300 ease-in-out",
                  isFormValid()
                    ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                )}
              >
                Add Admin
              </button>
            </CardFooter>
          </Card>
        </div>
      )}

      {!showAddForm && (
        <div className="grid gap-6 md:grid-cols-2 mt-8">
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
                <p className="text-sm text-white/70">{admin.role}</p>
                <span
                  className={cn(
                    "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
                    admin.status === "Active"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  )}
                >
                  {admin.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedAdmin && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in"
          onClick={() => setSelectedAdmin(null)}
        >
          <div
            className="relative w-full max-w-md p-6 rounded-2xl bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400"
              onClick={() => setSelectedAdmin(null)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-4">
              <img
                src={selectedAdmin.avatar || defaultAvatar}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover mx-auto border"
              />
              <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
              <p className="text-sm text-white/80">{selectedAdmin.role}</p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-white/70">Email</h4>
                <p>{selectedAdmin.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white/70">Phone</h4>
                <p>{selectedAdmin.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white/70">Status</h4>
                <p>{selectedAdmin.status}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white/70">Joined</h4>
                <p>{selectedAdmin.joined}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white/70">Bio</h4>
                <p className="italic">{selectedAdmin.bio}</p>
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































// import React, { useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "../components/ui/Card";
// import { X } from "lucide-react";
// import { cn } from "../utils/cn";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     // ... your existing admins ...
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);

//   const [newAdmin, setNewAdmin] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     status: "Active",
//     joined: "",
//     bio: "",
//     avatar: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddAdmin = () => {
//     if (!newAdmin.name || !newAdmin.email) {
//       alert("Please fill in at least name and email.");
//       return;
//     }
//     const newAdminData = {
//       ...newAdmin,
//       id: admins.length + 1,
//     };
//     setAdmins((prev) => [...prev, newAdminData]);
//     setNewAdmin({
//       name: "",
//       email: "",
//       phone: "",
//       role: "",
//       status: "Active",
//       joined: "",
//       bio: "",
//       avatar: "",
//     });
//     setShowAddForm(false);
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar is assumed to be here or outside this component */}
//       <main className="flex-1 p-6 relative">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Admin Details</h1>
//           <Card
//             className="p-2 px-4 cursor-pointer select-none"
//             onClick={() => setShowAddForm(true)}
//             hover
//           >
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
//               + Add Admin User
//             </span>
//           </Card>
//         </div>

//         {/* Admin Cards */}
//         <div className="grid gap-6 md:grid-cols-2">
//           {admins.map((admin) => (
//             <Card
//               key={admin.id}
//               onClick={() => setSelectedAdmin(admin)}
//               hover
//               className="flex items-center space-x-4 p-4 cursor-pointer"
//             >
//               <img
//                 src={admin.avatar || defaultAvatar}
//                 alt={`${admin.name}'s avatar`}
//                 className="w-14 h-14 rounded-full object-cover border"
//               />
//               <div>
//                 <h3 className="text-lg font-semibold">{admin.name}</h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{admin.role}</p>
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

//         {/* Admin Detail Modal */}
//         {selectedAdmin && (
//           <div
//             className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//             onClick={() => setSelectedAdmin(null)}
//           >
//             <Card
//               className="relative max-w-md w-full text-gray-900 dark:text-gray-100"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <CardHeader className="flex justify-between items-center">
//                 <CardTitle>{selectedAdmin.name}</CardTitle>
//                 <button
//                   onClick={() => setSelectedAdmin(null)}
//                   className="text-gray-600 dark:text-gray-400 hover:text-red-500"
//                   aria-label="Close details"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center mb-4">
//                   <img
//                     src={selectedAdmin.avatar || defaultAvatar}
//                     alt="avatar"
//                     className="w-24 h-24 rounded-full object-cover mx-auto border"
//                   />
//                   <p className="mt-2 font-semibold">{selectedAdmin.role}</p>
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div>
//                     <strong>Email:</strong> {selectedAdmin.email}
//                   </div>
//                   <div>
//                     <strong>Phone:</strong> {selectedAdmin.phone}
//                   </div>
//                   <div>
//                     <strong>Status:</strong> {selectedAdmin.status}
//                   </div>
//                   <div>
//                     <strong>Joined:</strong> {selectedAdmin.joined}
//                   </div>
//                   <div>
//                     <strong>Bio:</strong> <em>{selectedAdmin.bio}</em>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <button
//                   onClick={() => setSelectedAdmin(null)}
//                   className="w-full py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//                 >
//                   Close
//                 </button>
//               </CardFooter>
//             </Card>
//           </div>
//         )}

//         {/* Add Admin Form as full page content (not modal overlay) */}
//         {showAddForm && (
//           <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4 overflow-auto">
//             <Card className="w-full max-w-xl rounded-xl shadow-lg">
//               <CardHeader className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>Add New Admin</CardTitle>
//                   <CardDescription>Fill in details for new admin user</CardDescription>
//                 </div>
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="text-gray-600 dark:text-gray-400 hover:text-red-500"
//                   aria-label="Close add admin form"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </CardHeader>

//               <CardContent>
//                 {/* Form inputs styled consistently */}
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleAddAdmin();
//                   }}
//                   className="space-y-4"
//                 >
//                   {[
//                     { name: "name", label: "Name", type: "text" },
//                     { name: "email", label: "Email", type: "email" },
//                     { name: "phone", label: "Phone", type: "tel" },
//                     { name: "role", label: "Role", type: "text" },
//                     { name: "joined", label: "Joined Date", type: "date" },
//                     { name: "avatar", label: "Avatar URL", type: "url" },
//                   ].map(({ name, label, type }) => (
//                     <div key={name} className="flex flex-col">
//                       <label
//                         htmlFor={name}
//                         className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
//                       >
//                         {label}
//                       </label>
//                       <input
//                         id={name}
//                         name={name}
//                         type={type}
//                         value={newAdmin[name]}
//                         onChange={handleInputChange}
//                         className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder={`Enter ${label.toLowerCase()}`}
//                       />
//                     </div>
//                   ))}

//                   <div className="flex flex-col">
//                     <label
//                       htmlFor="status"
//                       className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
//                     >
//                       Status
//                     </label>
//                     <select
//                       id="status"
//                       name="status"
//                       value={newAdmin.status}
//                       onChange={handleInputChange}
//                       className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>

//                   <div className="flex flex-col">
//                     <label
//                       htmlFor="bio"
//                       className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
//                     >
//                       Bio
//                     </label>
//                     <textarea
//                       id="bio"
//                       name="bio"
//                       rows={3}
//                       value={newAdmin.bio}
//                       onChange={handleInputChange}
//                       className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                       placeholder="Enter bio"
//                     />
//                   </div>

//                   <div className="flex justify-end space-x-3 pt-2">
//                     <button
//                       type="button"
//                       onClick={() => setShowAddForm(false)}
//                       className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </main>
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
//   CardDescription,
//   CardFooter,
// } from "../components/ui/Card";
// import { cn } from "../utils/cn";
// import { X } from "lucide-react";

// const defaultAvatar = "https://www.svgrepo.com/show/382106/user-avatar-default.svg";

// const AdminDetails = () => {
//   const [admins, setAdmins] = useState([
//     {
//       id: 1,
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       phone: "123-456-7890",
//       role: "Super Admin",
//       status: "Active",
//       joined: "2024-01-15",
//       bio: "Loves clean dashboards and UI consistency.",
//       avatar: "",
//     },
//     {
//       id: 2,
//       name: "Bob Smith",
//       email: "bob@example.com",
//       phone: "987-654-3210",
//       role: "Building Admin",
//       status: "Active",
//       joined: "2023-08-22",
//       bio: "Manages property-level issues and logistics.",
//       avatar: "",
//     },
//   ]);

//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     status: "Active",
//     joined: "",
//     bio: "",
//     avatar: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddAdmin = () => {
//     setAdmins((prev) => [...prev, { ...newAdmin, id: Date.now() }]);
//     setNewAdmin({
//       name: "",
//       email: "",
//       phone: "",
//       role: "",
//       status: "Active",
//       joined: "",
//       bio: "",
//       avatar: "",
//     });
//     setShowAddForm(false);
//   };

//   return (
//     <div className="p-4 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Details</h1>
//         <Card
//           className="p-2 px-4 cursor-pointer"
//           onClick={() => setShowAddForm(true)}
//         >
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
//             + Add Admin User
//           </span>
//         </Card>
//       </div>

//       {/* Admin Cards */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {admins.map((admin) => (
//           <Card
//             key={admin.id}
//             onClick={() => setSelectedAdmin(admin)}
//             hover
//             className="flex items-center space-x-4 p-4"
//           >
//             <img
//               src={admin.avatar || defaultAvatar}
//               alt={`${admin.name} avatar`}
//               className="w-14 h-14 rounded-full object-cover border"
//             />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{admin.name}</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-300">{admin.role}</p>
//               <span className={cn(
//                 "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
//                 admin.status === "Active" ? "bg-green-600 text-white" : "bg-red-600 text-white"
//               )}>
//                 {admin.status}
//               </span>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Admin Detail Modal */}
//       {selectedAdmin && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//               onClick={() => setSelectedAdmin(null)}
//             >
//               <X className="h-5 w-5" />
//             </button>
//             <div className="text-center space-y-4">
//               <img
//                 src={selectedAdmin.avatar || defaultAvatar}
//                 className="w-24 h-24 rounded-full mx-auto border object-cover"
//               />
//               <h2 className="text-xl font-bold">{selectedAdmin.name}</h2>
//               <p className="text-sm text-gray-500">{selectedAdmin.role}</p>
//             </div>
//             <div className="mt-6 space-y-3 text-sm">
//               <p><strong>Email:</strong> {selectedAdmin.email}</p>
//               <p><strong>Phone:</strong> {selectedAdmin.phone}</p>
//               <p><strong>Status:</strong> {selectedAdmin.status}</p>
//               <p><strong>Joined:</strong> {selectedAdmin.joined}</p>
//               <p><strong>Bio:</strong> <i>{selectedAdmin.bio}</i></p>
//             </div>
//             <button
//               onClick={() => setSelectedAdmin(null)}
//               className="mt-6 w-full py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Admin Modal Form */}
//       {showAddForm && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <Card className="w-full max-w-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white relative">
//             <CardHeader>
//               <CardTitle>Add New Admin</CardTitle>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {[
//                 ["name", "Full Name"],
//                 ["email", "Email"],
//                 ["phone", "Phone Number"],
//                 ["role", "Role"],
//                 ["status", "Status (Active/Inactive)"],
//                 ["joined", "Joining Date"],
//                 ["bio", "Short Bio"],
//                 ["avatar", "Avatar URL"],
//               ].map(([name, label]) => (
//                 <div key={name} className="space-y-1">
//                   <label className="block text-sm font-medium">{label}</label>
//                   <input
//                     type="text"
//                     name={name}
//                     value={newAdmin[name]}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//             </CardContent>
//             <CardFooter>
//               <button
//                 onClick={handleAddAdmin}
//                 className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
//               >
//                 Add Admin
//               </button>
//             </CardFooter>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDetails;




