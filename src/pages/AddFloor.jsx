// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
// import { X } from 'lucide-react';
// import { cn } from '../utils/cn';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddFloor = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [floorName, setFloorName] = useState('');
//   const [leftWing, setLeftWing] = useState(['']);
//   const [rightWing, setRightWing] = useState(['']);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const firstInputRef = useRef(null);

//   useEffect(() => {
//     if (!user) navigate('/login');
//     if (firstInputRef.current) firstInputRef.current.focus();
//   }, [user, navigate]);

//   const handleWingChange = (wing, setWing, index, value) => {
//     const updated = [...wing];
//     updated[index] = value;
//     setWing(updated);
//   };

//   const handleAddBay = (setWing) => {
//     setWing((prev) => [...prev, '']);
//   };

//   const handleClearBay = (wing, setWing, index) => {
//     const updated = wing.filter((_, i) => i !== index);
//     setWing(updated.length > 0 ? updated : ['']); // Ensure at least one input remains
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!floorName.trim()) {
//       toast.error('Floor name is required', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//       return;
//     }

//     const payload = {
//       floorName,
//       wings: [
//         {
//           wingName: 'Left Wing',
//           rooms: leftWing.filter(Boolean),
//         },
//         {
//           wingName: 'Right Wing',
//           rooms: rightWing.filter(Boolean),
//         },
//         {
//           wingName: 'Corridor',
//           rooms: ['Front Side', 'Back Side'],
//         },
//       ].filter((wing) => wing.rooms.length > 0),
//     };

//     setIsSubmitting(true);

//     try {
//       const res = await fetch('https://etrack-backend.onrender.com/floor/createDynamicFloor', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success('Floor created successfully!', {
//           position: 'top-right',
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         // Reset form
//         setFloorName('');
//         setLeftWing(['']);
//         setRightWing(['']);
//       } else {
//         toast.error(data.message || 'Failed to add floor', {
//           position: 'top-right',
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       }
//     } catch (err) {
//       toast.error('An error occurred. Please try again.', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderWingInputs = (wing, setWing, label) => (
//     <div className="flex-1">
//       <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">{label}</label>
//       {wing.map((bay, idx) => (
//         <div key={idx} className="flex items-center mb-2">
//           <input
//             type="text"
//             value={bay}
//             onChange={(e) => handleWingChange(wing, setWing, idx, e.target.value)}
//             className="w-full px-3 py-2 rounded-md bg-white/30 dark:bg-white/10 border border-gray-300/70 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-primary-500"
//             placeholder={`Enter ${label.toLowerCase()} room ${idx + 1}`}
//             disabled={isSubmitting}
//           />
//           <button
//             type="button"
//             onClick={() => handleClearBay(wing, setWing, idx)}
//             className="ml-2 p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
//             aria-label={`Remove ${label} room ${idx + 1}`}
//             disabled={isSubmitting}
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={() => handleAddBay(setWing)}
//         className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
//         disabled={isSubmitting}
//       >
//         + Add Room
//       </button>
//     </div>
//   );

//   const renderCorridorRooms = () => (
//     <div className="flex-1">
//       <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">Corridor (Predefined)</label>
//       <div className="mb-2">
//         <p className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300/70 dark:border-white/20">
//           Front Side
//         </p>
//       </div>
//       <div className="mb-2">
//         <p className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300/70 dark:border-white/20">
//           Back Side
//         </p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="px-4 py-6 dark:bg-gray-900 min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-black dark:text-white">
//           Add New Floor
//         </h1>
//       </div>
//       <Card className="bg-white/30 dark:bg-white/10 backdrop-blur-lg border border-gray-300/70 dark:border-white/20 rounded-xl">
//         <CardContent className="p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
//                 Floor Name
//               </label>
//               <input
//                 ref={firstInputRef}
//                 type="text"
//                 value={floorName}
//                 onChange={(e) => setFloorName(e.target.value)}
//                 className="w-full px-4 py-2 bg-white/30 dark:bg-white/10 rounded-lg border border-gray-300/70 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-primary-500"
//                 placeholder="e.g., Floor 1"
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div className="flex gap-4">
//               {renderWingInputs(leftWing, setLeftWing, 'Left Wing')}
//               {renderCorridorRooms()}
//               {renderWingInputs(rightWing, setRightWing, 'Right Wing')}
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={cn(
//                   'px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700',
//                   isSubmitting && 'opacity-50 cursor-not-allowed'
//                 )}
//               >
//                 {isSubmitting ? 'Adding...' : 'Add Floor'}
//               </button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AddFloor;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFloor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [floorName, setFloorName] = useState('');
  const [leftWing, setLeftWing] = useState(['']);
  const [rightWing, setRightWing] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (!user) navigate('/login');
    if (firstInputRef.current) firstInputRef.current.focus();
  }, [user, navigate]);

  const handleWingChange = (wing, setWing, index, value) => {
    const updated = [...wing];
    updated[index] = value;
    setWing(updated);
  };

  const handleAddBay = (setWing) => {
    setWing((prev) => [...prev, '']);
  };

const handleClearBay = (wing, setWing, index) => {
    const updated = wing.filter((_, i) => i !== index);
    setWing(updated.length > 0 ? updated : ['']); // Ensure at least one input remains
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!floorName.trim()) {
      toast.error('Floor name is required', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const payload = {
      floorName,
      wings: [
        {
          wingName: 'Left Wing',
          rooms: leftWing.filter(Boolean),
        },
        {
          wingName: 'Right Wing',
          rooms: rightWing.filter(Boolean),
        },
        {
          wingName: 'Corridor',
          rooms: ['Front Side', 'Back Side'],
        },
      ].filter((wing) => wing.rooms.length > 0),
    };

    setIsSubmitting(true);

    try {
      const res = await fetch('https://etrack-backend.onrender.com/floor/createDynamicFloor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
     if (res.ok) {
  toast.success('Floor created successfully!', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  setFloorName('');
  setLeftWing(['']);
  setRightWing(['']);
  window.dispatchEvent(new CustomEvent('floorDataUpdated'));
}else {
        toast.error(data.message || 'Failed to add floor', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWingInputs = (wing, setWing, label) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">{label}</label>
      {wing.map((bay, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            type="text"
            value={bay}
            onChange={(e) => handleWingChange(wing, setWing, idx, e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-white/30 dark:bg-white/10 border border-gray-300/70 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder={`Enter ${label.toLowerCase()} room ${idx + 1}`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => handleClearBay(wing, setWing, idx)}
            className="ml-2 p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            aria-label={`Remove ${label} room ${idx + 1}`}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddBay(setWing)}
        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        disabled={isSubmitting}
      >
        + Add Room
      </button>
    </div>
  );

const renderCorridorRooms = () => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
      Corridor (Predefined)
    </label>
    <div className="mb-2">
      <p className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300/70 dark:border-white/20">
        Front Side
      </p>
    </div>
    <div className="mb-2">
      <p className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300/70 dark:border-white/20">
        Back Side
      </p>
    </div>
  </div>
);

  return (
    <div className="px-4 py-6 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Add New Floor
        </h1>
      </div>
      <Card className="bg-white/30 dark:bg-white/10 backdrop-blur-lg border border-gray-300/70 dark:border-white/20 rounded-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                Floor Name
              </label>
              <input
                ref={firstInputRef}
                type="text"
                value={floorName}
                onChange={(e) => setFloorName(e.target.value)}
                className="w-full px-4 py-2 bg-white/30 dark:bg-white/10 rounded-lg border border-gray-300/70 dark:border-white/20 text-black dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Floor 1"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-4">
              {renderWingInputs(leftWing, setLeftWing, 'Left Wing')}
              {renderCorridorRooms()}
              {renderWingInputs(rightWing, setRightWing, 'Right Wing')}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700',
                  isSubmitting && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Adding...' : 'Add Floor'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default AddFloor;