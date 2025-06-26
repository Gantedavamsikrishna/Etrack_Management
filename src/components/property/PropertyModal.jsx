// import React, { useState } from 'react';
// import { createPortal } from 'react-dom';
// import { Button } from '../ui/Button';
// import { X, Monitor, Keyboard, Mouse, Fan, Lightbulb, Wifi, AirVent } from 'lucide-react';
// import { cn } from '../../utils/cn';

// const propertyIcons = {
//   "monitor": <Monitor className="h-8 w-8" />,
//   "keyboard": <Keyboard className="h-8 w-8" />,
//   "mouse": <Mouse className="h-8 w-8" />,
//   "fan": <Fan className="h-8 w-8" />,
//   "light": <Lightbulb className="h-8 w-8" />,
//   "wifi-router": <Wifi className="h-8 w-8" />,
//   "ac": <AirVent className="h-8 w-8" />,
// };

// export const PropertyModal = ({ property, onClose, onEdit, enableEdit = false }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     status: property.status || 'working',
//     id: property.id || '',
//     location: property.deviceLocation || 
//               (property.floorName && property.wingName && property.roomName 
//                 ? `${property.floorName} / ${property.wingName} / ${property.roomName}`
//                 : ''),
//   });

//   console.log('PropertyModal property:', property); // Debug prop

//   const formatType = (type) => {
//     return type
//       ? type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
//       : 'Unknown';
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = () => {
//     const updatedProperty = {
//       ...property,
//       ...formData,
//       deviceLocation: formData.location, // Ensure deviceLocation is updated
//     };
//     console.log('Saving updated property:', updatedProperty); // Debug save
//     if (onEdit) {
//       onEdit(updatedProperty);
//     }
//     setIsEditing(false);
//   };

//   // Derive location display
//   const displayLocation = property.floorName && property.wingName && property.roomName
//     ? `${property.floorName} / ${property.wingName} / ${property.roomName}`
//     : property.deviceLocation || formData.location || 'N/A';

//   const modalContent = (
//     <>
//       {enableEdit && (
//         <style>
//           {`
//             .field-container {
//               transition: all 0.3s ease-in-out;
//             }
//             .field-container select,
//             .field-container input,
//             .field-container div,
//             .field-container p {
//               transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
//             }
//             .field-container select,
//             .field-container input {
//               opacity: ${isEditing ? 1 : 0};
//               transform: ${isEditing ? 'translateY(0)' : 'translateY(10px)'};
//             }
//             .field-container div,
//             .field-container p {
//               opacity: ${isEditing ? 0 : 1};
//               transform: ${isEditing ? 'translateY(-10px)' : 'translateY(0)'};
//               position: ${isEditing ? 'absolute' : 'static'};
//             }
//           `}
//         </style>
//       )}
//       <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 bg-black/60 animate-fade-in">
//         <div 
//           className={cn(
//             "relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-6",
//             "shadow-lg shadow-black/10 dark:shadow-white/10",
//             "bg-white/10 dark:bg-white/10 backdrop-blur-md",
//             "border border-white/20 ring-1 ring-white/20",
//             "text-white transition-colors duration-300",
//             "max-h-[90vh] overflow-auto"
//           )}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex justify-between items-center border-b border-white/20 pb-3">
//             <h2 className="text-lg sm:text-xl font-semibold">
//               Property Details
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-white/80 hover:text-white hover:bg-white/20 rounded-md p-1 transition-colors duration-200"
//               aria-label="Close"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
          
//           <div className="pt-4 pb-2 sm:pb-4 space-y-4 sm:space-y-6">
//             <div className="flex items-center justify-start mb-4 sm:mb-6">
//               <div className={cn(
//                 "p-3 sm:p-4 rounded-full mr-3 sm:mr-4",
//                 (isEditing ? formData.status : property.status) === 'working' 
//                   ? 'bg-green-100/20 dark:bg-green-900/20 text-green-400' 
//                   : 'bg-red-100/20 dark:bg-red-900/20 text-red-400'
//               )}>
//                 {propertyIcons[property.type] || <Monitor className="h-8 w-8" />}
//               </div>
              
//               <div>
//                 <h3 className="text-base sm:text-lg font-medium">
//                   {formatType(property.type)}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-white/80">
//                   {property.brand || 'Unknown'} {property.model || 'Unknown'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="space-y-3 sm:space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
//                     Brand
//                   </h4>
//                   <p className="text-sm sm:text-base">{property.brand || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
//                     Model
//                   </h4>
//                   <p className="text-sm sm:text-base">{property.model || 'N/A'}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 {property.purchaseDate && (
//                   <div>
//                     <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
//                       Purchase Date
//                     </h4>
//                     <p className="text-sm sm:text-base">{property.purchaseDate}</p>
//                   </div>
//                 )}
//                 <div className={cn(enableEdit && "field-container")}>
//                   <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
//                     Status
//                   </h4>
//                   {enableEdit && isEditing ? (
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       className="border border-white/20 rounded p-2 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:ring-2 focus:ring-blue-400"
//                     >
//                       <option value="working">Working</option>
//                       <option value="not_working">Not Working</option>
//                     </select>
//                   ) : (
//                     <div className={cn(
//                       "inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium w-full max-w-[120px] sm:max-w-[140px]",
//                       (isEditing ? formData.status : property.status) === 'working' 
//                         ? 'bg-green-100/20 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
//                         : 'bg-red-100/20 text-red-600 dark:bg-red-900/20 dark:text-red-400'
//                     )}>
//                       {(isEditing ? formData.status : property.status) === 'working' ? 'Working' : 'Not Working'}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className={cn(enableEdit && "field-container")}>
//                 <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
//                   Barcode
//                 </h4>
//                 {enableEdit && isEditing ? (
//                   <input
//                     type="text"
//                     name="id"
//                     value={formData.id}
//                     onChange={handleInputChange}
//                     className="border border-white/20 rounded p-2 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:ring-2 focus:ring-green-400"
//                   />
//                 ) : (
//                   <p className="text-sm sm:text-base">{property.id || 'N/A'}</p>
//                 )}
//               </div>

//               <div className={cn(enableEdit && "field-container")}>
//                 <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
//                   Location
//                 </h4>
//                 {enableEdit && isEditing ? (
//                   <input
//                     type="text"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleInputChange}
//                     className="border border-white/20 rounded p-2 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:ring-2 focus:ring-green-400"
//                   />
//                 ) : (
//                   <p className="text-sm sm:text-base">{displayLocation}</p>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className={cn(
//             "border-t border-white/20 flex",
//             enableEdit ? "justify-between pt-4 pb-2 sm:pb-4" : "justify-end pt-4 pb-2 sm:pb-4"
//           )}>
//             {enableEdit && isEditing ? (
//               <>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setIsEditing(false)}
//                   className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleSave}
//                   className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
//                 >
//                   Save
//                 </Button>
//               </>
//             ) : (
//               <>
//                 {enableEdit && (
//                   <Button 
//                     variant="outline" 
//                     onClick={handleEdit}
//                     className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
//                   >
//                     Edit
//                   </Button>
//                 )}
//                 <Button 
//                   variant="outline" 
//                   onClick={onClose}
//                   className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
//                 >
//                   Done
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   return createPortal(modalContent, document.body);
// };

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import {
  Monitor,
  Keyboard,
  Mouse,
  Fan,
  Lightbulb,
  Wifi,
  AirVent,
  Printer,
  Scan,
  Speaker,
  Mic,
  Cpu,
  Laptop,
  BatteryCharging,
  Network,
  LayoutDashboard,
  Presentation,
  Camera,
  Fingerprint,
  Tv,
  Plug,
  Cable,
  AlarmClock,
  Gamepad,
  HelpCircle,
  ChevronDown,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Axios from 'axios';

const propertyIcons = {
  monitor: <Monitor className="h-8 w-8" />,
  keyboard: <Keyboard className="h-8 w-8" />,
  mouse: <Mouse className="h-8 w-8" />,
  fan: <Fan className="h-8 w-8" />,
  light: <Lightbulb className="h-8 w-8" />,
  'wifi-router': <Wifi className="h-8 w-8" />,
  ac: <AirVent className="h-8 w-8" />,
  projector: <Presentation className="h-8 w-8" />,
  printer: <Printer className="h-8 w-8" />,
  scanner: <Scan className="h-8 w-8" />,
  speaker: <Speaker className="h-8 w-8" />,
  microphone: <Mic className="h-8 w-8" />,
  cpu: <Cpu className="h-8 w-8" />,
  laptop: <Laptop className="h-8 w-8" />,
  ups: <BatteryCharging className="h-8 w-8" />,
  inverter: <BatteryCharging className="h-8 w-8" />,
  'network-switch': <Network className="h-8 w-8" />,
  whiteboard: <LayoutDashboard className="h-8 w-8" />,
  smartboard: <LayoutDashboard className="h-8 w-8" />,
  podium: <Presentation className="h-8 w-8" />,
  cctv: <Camera className="h-8 w-8" />,
  'biometric-scanner': <Fingerprint className="h-8 w-8" />,
  tv: <Tv className="h-8 w-8" />,
  'power-strip': <Plug className="h-8 w-8" />,
  'extension-box': <Plug className="h-8 w-8" />,
  'network-cable': <Cable className="h-8 w-8" />,
  'hdmi-cable': <Cable className="h-8 w-8" />,
  'vga-cable': <Cable className="h-8 w-8" />,
  'remote-control': <Gamepad className="h-8 w-8" />,
  'alarm-system': <AlarmClock className="h-8 w-8" />,
  'access-point': <Wifi className="h-8 w-8" />,
  default: <HelpCircle className="h-8 w-8" />,
};

export const PropertyModal = ({ property, onClose, onEdit, enableEdit = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: property.status || 'working',
    id: property.id || '',
    floorId: property.floorId || '',
    hallId: property.hallId || '',
    roomId: property.roomId || '',
  });
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const axiosInstance = Axios.create({
    baseURL: 'https://etrack-backend.onrender.com/floor',
  });

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axiosInstance.get('/getAllFloors');
        console.log('Fetched floors:', response.data);
        const floorsArray = Array.isArray(response.data) ? response.data : [];
        setFloors(floorsArray);
      } catch (err) {
        console.error('Error fetching floors:', err);
        setError(err.response?.data?.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchFloors();
  }, []);

  const halls = formData.floorId
    ? floors.find((f) => f._id === formData.floorId)?.wings || []
    : [];
  const rooms = formData.hallId
    ? halls.find((h) => h._id === formData.hallId)?.rooms || []
    : [];

  const formatType = (type) => {
    return type
      ? type
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Unknown';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'floorId') {
      setFormData((prev) => ({ ...prev, floorId: value, hallId: '', roomId: '' }));
    } else if (name === 'hallId') {
      setFormData((prev) => ({ ...prev, hallId: value, roomId: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    const floor = floors.find((f) => f._id === formData.floorId);
    const hall = halls.find((h) => h._id === formData.hallId);
    const room = rooms.find((r) => r._id === formData.roomId);

    const updatedProperty = {
      ...property,
      ...formData,
      floorName: floor ? floor.floorName : property.floorName || 'Unknown',
      hallName: hall ? hall.wingName : property.hallName || 'Unknown',
      roomName: room ? room.roomName : property.roomName || 'Unknown',
      deviceLocation:
        floor && hall && room
          ? `${floor.floorName}/${hall.wingName}/${room.roomName}`
          : property.deviceLocation || 'Unknown',
    };
    console.log('Saving updated property:', updatedProperty);
    if (onEdit) {
      onEdit(updatedProperty);
    }
    setIsEditing(false);
  };

  const displayLocation =
    property.deviceLocation ||
    (property.floorName && property.hallName && property.roomName
      ? `${property.floorName}/${property.hallName}/${property.roomName}`
      : 'N/A');

  const modalContent = (
    <>
      <style>
        {`
          .modal-content::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          .modal-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
            max-height: 80vh;
            overflow-y: auto;
            overscroll-behavior: contain;
          }
          .modal-content * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .modal-content *::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          select.custom-select option {
            background-color: #E5E7EB;
            color: #111827;
          }
          select.custom-select option:hover {
            background-color: #D1D5DB;
          }
          .custom-border {
            border: 1px solid rgba(209, 213, 219, 0.4) !important;
          }
          @media (prefers-color-scheme: dark) {
            select.custom-select option {
              background-color: #1F2937;
              color: #FFFFFF;
            }
            select.custom-select option:hover {
              background-color: #374151;
            }
            .custom-border {
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
          }
        `}
      </style>
      <div
        className="fixed inset-0 z-[200] bg-gray-800/60 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'relative w-full max-w-md rounded-2xl p-6 modal-content',
            'shadow-lg shadow-black/10 dark:shadow-white/10',
            'bg-gray-200/30 dark:bg-white/10 backdrop-blur-md',
            'border border-gray-300/40 dark:border-white/20 ring-1 ring-gray-300/40 dark:ring-white/20',
            'text-gray-900 dark:text-white transition-colors duration-300',
            'flex flex-col'
          )}
        >
          <div className="flex justify-between items-center border-b border-gray-300/40 dark:border-white/20 pb-4">
            <h2 className="text-xl font-bold">Property Details</h2>
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-300/20 dark:hover:bg-white/20 rounded-md p-1 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 pt-4 pb-4 overflow-y-auto">
            <div className="flex items-center justify-start mb-6">
              <div
                className={cn(
                  'p-4 rounded-full mr-4',
                  (isEditing ? formData.status : property.status) === 'working'
                    ? 'bg-green-100/20 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-red-100/20 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                )}
              >
                {propertyIcons[property.type] || propertyIcons.default}
              </div>
              <div>
                <h3 className="text-lg font-medium">{formatType(property.type)}</h3>
                <p className="text-sm text-gray-600 dark:text-white/80">
                  {property.brand || 'Unknown'} {property.model || 'Unknown'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Brand
                  </h4>
                  <p className="text-sm sm:text-base">{property.brand || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Model
                  </h4>
                  <p className="text-sm sm:text-base">{property.model || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.purchaseDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                      Purchase Date
                    </h4>
                    <p className="text-sm sm:text-base">{property.purchaseDate || 'N/A'}</p>
                  </div>
                )}
                <div className={cn(enableEdit && 'field-container')}>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Status
                  </h4>
                  {enableEdit && isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out pr-10"
                    >
                      <option value="working">Working</option>
                      <option value="not_working">Not Working</option>
                    </select>
                  ) : (
                    <div
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium w-full max-w-[120px] sm:max-w-[140px]',
                        (isEditing ? formData.status : property.status) === 'working'
                          ? 'bg-green-100/20 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100/20 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      )}
                    >
                      {(isEditing ? formData.status : property.status) === 'working'
                        ? 'Working'
                        : 'Not Working'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                  Barcode
                </h4>
                <p className="text-sm sm:text-base">{property.id || 'N/A'}</p>
              </div>

              <div className="field-container">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                  Location
                </h4>
                {!isEditing ? (
                  <p className="read-only text-sm sm:text-base">{displayLocation}</p>
                ) : (
                  <div className="edit-mode-grid space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                        Floor
                      </h4>
                      <div className="relative">
                        <select
                          name="floorId"
                          value={formData.floorId}
                          onChange={handleInputChange}
                          className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out pr-10"
                          disabled={loading}
                        >
                          <option value="">Select Floor</option>
                          {floors.map((floor) => (
                            <option key={floor._id} value={floor._id}>
                              {floor.floorName || 'Unnamed Floor'}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                        Wing
                      </h4>
                      <div className="relative">
                        <select
                          name="hallId"
                          value={formData.hallId}
                          onChange={handleInputChange}
                          className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out disabled:opacity-70 pr-10"
                          disabled={!formData.floorId || loading}
                        >
                          <option value="">Select Wing</option>
                          {halls.map((wing) => (
                            <option key={wing._id} value={wing._id}>
                              {wing.wingName || 'Unnamed Wing'}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                        Room
                      </h4>
                      <div className="relative">
                        <select
                          name="roomId"
                          value={formData.roomId}
                          onChange={handleInputChange}
                          className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out disabled:opacity-70 pr-10"
                          disabled={!formData.hallId || loading}
                        >
                          <option value="">Select Room</option>
                          {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                              {room.roomName || 'Unnamed Room'}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300/40 dark:border-white/20 flex justify-end pt-4 gap-2">
            {enableEdit && isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm bg-gray-100/20 dark:bg-white/10 hover:bg-gray-200/30 dark:hover:bg-white/20 text-gray-900 dark:text-white border-gray-300/40 dark:border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
                  disabled={
                    loading ||
                    (enableEdit &&
                      isEditing &&
                      (!formData.floorId || !formData.hallId || !formData.roomId))
                  }
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                {enableEdit && (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="px-4 py-2 text-sm bg-gray-100/20 dark:bg-white/10 hover:bg-gray-200/30 dark:hover:bg-white/20 text-gray-900 dark:text-white border-gray-300/40 dark:border-white/20 transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-gray-100/20 dark:bg-white/10 hover:bg-gray-200/30 dark:hover:bg-white/20 text-gray-900 dark:text-white border-gray-300/40 dark:border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return createPortal(modalContent, document.body);
};