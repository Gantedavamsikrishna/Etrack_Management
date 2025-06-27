import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFloor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('add'); // 'add' or 'edit'
  const [floorNameInput, setFloorNameInput] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [floors, setFloors] = useState([]);
  const [leftWing, setLeftWing] = useState(['']);
  const [rightWing, setRightWing] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const firstInputRef = useRef(null);

  // useEffect(() => {
  //   console.log('User:', user);
  //   if (!user || !user.token) {
  //     console.error('No user or token found');
  //     toast.error('Please log in to continue');
  //     navigate('/login');
  //     return;
  //   }

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
    fetchAllFloors();

    const handleFloorDataUpdated = () => {
      console.log('floorDataUpdated event received');
      fetchAllFloors();
    };
    window.addEventListener('floorDataUpdated', handleFloorDataUpdated);
    return () => window.removeEventListener('floorDataUpdated', handleFloorDataUpdated);
  }, [user, navigate]);

  useEffect(() => {
    console.log('Floors state:', floors);
  }, [floors]);

  const fetchAllFloors = async (retryCount = 0, maxRetries = 2) => {
    try {
      console.log(`Fetching floors (Attempt ${retryCount + 1}/${maxRetries + 1})`);
      console.log('User token:', user?.token ? 'Present' : 'Missing');
      const res = await fetch('http://localhost:3000/floor/getAllFloors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Fetched floors data:', JSON.stringify(data, null, 2));

      if (!res.ok) {
        console.error('Fetch error:', { status: res.status, message: data.message });
        if (res.status === 401 || res.status === 403) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        if (retryCount < maxRetries) {
          console.log(`Retrying fetch (Attempt ${retryCount + 2})`);
          setTimeout(() => fetchAllFloors(retryCount + 1, maxRetries), 1000);
          return;
        }
        throw new Error(data.message || `HTTP error ${res.status}`);
      }

      if (Array.isArray(data)) {
        setFloors(data);
        console.log('Floors set in state:', data.map(floor => floor.floorName));
        if (data.length === 0) {
          toast.info('No floors found. Add a new floor to get started.');
        }
      } else {
        console.warn('Invalid data format:', data);
        setFloors([]);
        toast.warn('Received invalid floor data from server.');
      }
    } catch (err) {
      console.error('Error fetching floors:', err.message);
      toast.error(`Failed to fetch floors: ${err.message}`);
      setFloors([]);
    }
  };

  const fetchFloorData = async (floorName) => {
    try {
      console.log(`Fetching data for floor "${floorName}"`);
      const res = await fetch(`http://localhost:3000/floor/filterByfloors?floorName=${encodeURIComponent(floorName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Fetched floor data:', data);

      if (!res.ok) {
        console.error('Fetch floor data failed:', data);
        if (res.status === 401 || res.status === 403) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error(data.message || 'Failed to fetch floor data');
      }

      if (Array.isArray(data) && data.length > 0 && data[0].floorName) {
        const floorData = data[0];
        setFloorNameInput(floorData.floorName);
        const leftWingData = floorData.wings.find(w => w.wingName === 'Left Wing')?.rooms.map(r => r.roomName) || [''];
        const rightWingData = floorData.wings.find(w => w.wingName === 'Right Wing')?.rooms.map(r => r.roomName) || [''];
        setLeftWing(leftWingData.length > 0 ? leftWingData : ['']);
        setRightWing(rightWingData.length > 0 ? rightWingData : ['']);
        setMode('edit');
        toast.success(`Loaded data for ${floorData.floorName}`);
      } else {
        console.warn('No floor data found for:', floorName);
        toast.error(`No data found for floor: ${floorName}`);
        setMode('add');
        setSelectedFloor('');
        setFloorNameInput('');
        setLeftWing(['']);
        setRightWing(['']);
      }
    } catch (err) {
      console.error('Error fetching floor data:', err.message);
      toast.error(`Error fetching floor ${floorName}: ${err.message}`);
      setMode('add');
      setSelectedFloor('');
    }
  };

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
    setWing(updated.length > 0 ? updated : ['']);
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    if (!floorNameInput.trim()) {
      toast.error('Floor name is required');
      return;
    }

    let payload;
    if (action === 'edit') {
      try {
        const res = await fetch(`http://localhost:3000/floor/filterByfloors?floorName=${encodeURIComponent(selectedFloor)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user?.token || ''}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok || !data[0]) {
          toast.error('Failed to fetch existing floor data');
          return;
        }

        const existingFloor = data[0];
        payload = {
          oldFloorName: selectedFloor,
          newFloorName: floorNameInput,
          updatedWings: [
            {
              wingName: 'Left Wing',
              rooms: leftWing.filter(Boolean).map(roomName => {
                const existingRoom = existingFloor.wings
                  .find(w => w.wingName === 'Left Wing')?.rooms
                  .find(r => r.roomName === roomName);
                return {
                  roomName,
                  devices: existingRoom?.devices || [],
                };
              }),
            },
            {
              wingName: 'Right Wing',
              rooms: rightWing.filter(Boolean).map(roomName => {
                const existingRoom = existingFloor.wings
                  .find(w => w.wingName === 'Right Wing')?.rooms
                  .find(r => r.roomName === roomName);
                return {
                  roomName,
                  devices: existingRoom?.devices || [],
                };
              }),
            },
            {
              wingName: 'Corridor',
              rooms: ['Front Side', 'Back Side'].map(roomName => {
                const existingRoom = existingFloor.wings
                  .find(w => w.wingName === 'Corridor')?.rooms
                  .find(r => r.roomName === roomName);
                return {
                  roomName,
                  devices: existingRoom?.devices || [],
                };
              }),
            },
          ].filter(wing => wing.rooms.length > 0),
        };
      } catch (err) {
        console.error('Error fetching existing floor:', err.message);
        toast.error('Error preparing floor update');
        return;
      }
    } else {
      payload = {
        floorName: floorNameInput,
        wings: [
          {
            wingName: 'Left Wing',
            rooms: leftWing.filter(Boolean).map(roomName => ({ roomName, devices: [] })),
          },
          {
            wingName: 'Right Wing',
            rooms: rightWing.filter(Boolean).map(roomName => ({ roomName, devices: [] })),
          },
          {
            wingName: 'Corridor',
            rooms: ['Front Side', 'Back Side'].map(roomName => ({ roomName, devices: [] })),
          },
        ].filter(wing => wing.rooms.length > 0),
      };
    }

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));
    setIsSubmitting(true);

    try {
      const url = action === 'edit' 
        ? 'http://localhost:3000/floor/updateFloorandwing'
        : 'http://localhost:3000/floor/createDynamicFloor';
      const method = action === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Submit response:', data);

      if (res.ok) {
        toast.success(action === 'edit' ? 'Floor updated successfully!' : 'Floor created successfully!');
        setFloorNameInput('');
        setLeftWing(['']);
        setRightWing(['']);
        setSelectedFloor('');
        setMode('add');
        window.dispatchEvent(new CustomEvent('floorDataUpdated'));
        fetchAllFloors();
      } else {
        toast.error(data.message || `Failed to ${action === 'edit' ? 'update' : 'add'} floor`);
      }
    } catch (err) {
      console.error('Error submitting floor:', err.message);
      toast.error('Error submitting floor: Network or server issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFloor) {
      toast.error('Please select a floor to delete');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this floor and all its rooms?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/floor/deleteFloor/${encodeURIComponent(selectedFloor)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      console.log('Delete response:', data);

      if (res.ok) {
        toast.success('Floor deleted successfully!');
        setFloorNameInput('');
        setLeftWing(['']);
        setRightWing(['']);
        setSelectedFloor('');
        setMode('add');
        window.dispatchEvent(new CustomEvent('floorDataUpdated'));
        fetchAllFloors();
      } else {
        toast.error(data.message || 'Failed to delete floor');
      }
    } catch (err) {
      console.error('Error deleting floor:', err.message);
      toast.error('Error deleting floor: Network or server issue');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSelect = () => {
    if (selectedFloor) {
      fetchFloorData(selectedFloor);
    } else {
      setMode('add');
      setFloorNameInput('');
      setLeftWing(['']);
      setRightWing(['']);
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
            className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder={`Enter ${label.toLowerCase()} room ${idx + 1}`}
            disabled={isSubmitting || isDeleting}
          />
          <button
            type="button"
            onClick={() => handleClearBay(wing, setWing, idx)}
            className="ml-2 p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            aria-label={`Remove ${label} room ${idx + 1}`}
            disabled={isSubmitting || isDeleting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddBay(setWing)}
        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        disabled={isSubmitting || isDeleting}
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
        <p className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
          Front Side
        </p>
      </div>
      <div className="mb-2">
        <p className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
          Back Side
        </p>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {mode === 'edit' ? 'Edit Floor' : 'Add New Floor'}
        </h1>
      </div>
      <Card className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
              Select Floor to Edit
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                disabled={isSubmitting || isDeleting}
              >
                <option value="">Select a floor</option>
                {floors.map((floor) => (
                  <option key={floor._id} value={floor.floorName}>
                    {floor.floorName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleEditSelect}
                disabled={isSubmitting || isDeleting || !selectedFloor}
                className={cn(
                  'px-2 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                  (isSubmitting || isDeleting || !selectedFloor) && 'opacity-50 cursor-not-allowed'
                )}
              >
                Load Floor
              </button>
            </div>
          </div>
          <form onSubmit={(e) => handleSubmit(e, mode)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                Floor Name
              </label>
              <input
                ref={firstInputRef}
                type="text"
                value={floorNameInput}
                onChange={(e) => setFloorNameInput(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Floor 1"
                disabled={isSubmitting || isDeleting}
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
                disabled={isSubmitting || isDeleting}
                className={cn(
                  'px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700',
                  (isSubmitting || isDeleting) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Adding...') : (mode === 'edit' ? 'Update Floor' : 'Add Floor')}
              </button>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                  className={cn(
                    'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700',
                    (isSubmitting || isDeleting) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Floor'}
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default AddFloor;