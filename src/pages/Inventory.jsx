import '../Inventory.css';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PropertyList } from '../components/property/PropertyList';
import { PropertyType, PropertyStatus } from '../types';
import Axios from 'axios';
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
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export const Inventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedHall, setSelectedHall] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [floors, setFloors] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProperty, setNewProperty] = useState({
    id: '',
    name: '',
    type: '',
    brand: '',
    model: '',
    status: '',
    price: 0,
    purchaseDate: '',
    floorId: '',
    hallId: '',
    roomId: '',
  });

  const axiosInstance = Axios.create({
    baseURL: 'https://etrack-backend.onrender.com/floor',
  });

  useEffect(() => {
    if (!user) {
      setError('Please log in to view inventory');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const floorResponse = await axiosInstance.get('/getAllFloors');
        const floorsArray = Array.isArray(floorResponse.data) ? floorResponse.data : [];
        setFloors(floorsArray);
        await fetchFilteredDevices();
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.data?.message || 'Network error: Unable to reach the server';
        setError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
          toastId: 'fetch-error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const getDeviceType = (deviceName) => {
    if (!deviceName) return 'default';
    const name = deviceName.toLowerCase();
    return Object.keys(propertyIcons).find((key) => name.includes(key.replace('-', ' '))) || 'default';
  };

  const fetchFilteredDevices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedFloor !== 'all') {
        const floor = floors.find((f) => f._id === selectedFloor);
        if (floor) params.floorName = floor.floorName;
      }
      if (selectedHall !== 'all') {
        const hall = halls.find((h) => h._id === selectedHall);
        if (hall) params.wingName = hall.wingName;
      }
      if (selectedRoom !== 'all') {
        const room = rooms.find((r) => r._id === selectedRoom);
        if (room) params.roomName = room.roomName;
      }
      if (selectedDevice) {
        params.deviceName = selectedDevice.replace('-', ' ');
      }

      const deviceResponse = await axiosInstance.get('/filterByfloors', { params });
      const mappedProperties = deviceResponse.data.flatMap((floor) =>
        floor.wings?.flatMap((wing) =>
          wing.rooms?.flatMap((room) =>
            (room.devices || []).map((device) => ({
              id: device.deviceBarcode || '',
              name: device.deviceName || 'Unknown',
              type: getDeviceType(device.deviceName),
              brand: device.deviceName?.split(' ')[0] || 'Unknown',
              model: device.deviceModel || 'Unknown',
              status:
                device.deviceStatus?.toLowerCase() === 'working'
                  ? 'working'
                  : device.deviceStatus?.toLowerCase() === 'not working' ||
                    device.deviceStatus?.toLowerCase() === 'under maintenance'
                  ? 'not_working'
                  : 'not_working',
              price: device.devicePrice || 0,
              purchaseDate: device.createdAt?.split('T')[0] || '',
              floorId: floor._id || '',
              hallId: wing._id || '',
              roomId: room._id || '',
              floorName: floor.floorName || 'Unknown',
              hallName: wing.wingName || 'Unknown',
              roomName: room.roomName || 'Unknown',
              deviceLocation:
                (floor.floorName || 'Unknown') +
                '/' +
                (wing.wingName || 'Unknown') +
                '/' +
                (room.roomName || 'Unknown'),
            }))
          ) || []
        ) || []
      );
      setProperties(mappedProperties);
      setError('');
    } catch (err) {
      console.error('Error fetching filtered devices:', err);
      const errorMessage = err.response?.data?.message || 'Network error';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        toastId: 'filter-error',
      });
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFilteredDevices();
    }
  }, [selectedFloor, selectedHall, selectedRoom, selectedDevice, floors, user]);

  const halls =
    selectedFloor === 'all'
      ? []
      : floors.find((f) => f._id === selectedFloor)?.wings || [];
  const rooms =
    selectedHall === 'all'
      ? []
      : halls.find((h) => h._id === selectedHall)?.rooms || [];

  const filteredProperties = properties.filter((property) => {
    if (selectedFloor !== 'all') {
      const floor = floors.find((f) => f._id === selectedFloor);
      if (!floor || property.floorName !== floor.floorName) return false;
    }
    if (selectedHall !== 'all') {
      const hall = halls.find((h) => h._id === selectedHall);
      if (!hall || property.hallName !== hall.wingName) return false;
    }
    if (selectedRoom !== 'all') {
      const room = rooms.find((r) => r._id === selectedRoom);
      if (!room || property.roomName !== room.roomName) return false;
    }
    if (selectedDevice && property.type !== selectedDevice) return false;
    return true;
  });

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newProperty.id || !newProperty.name) {
      setModalError('Barcode and Device Name are required');
      toast.error('Barcode and Device Name are required', {
        position: 'top-right',
        autoClose: 3000,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        toastId: 'validation-error',
      });
      return;
    }

    setLoading(true);
    try {
      const floor = floors.find((f) => f._id === newProperty.floorId);
      const selectedHalls = floor?.wings || [];
      const hall = selectedHalls.find((h) => h._id === newProperty.hallId);
      const selectedRooms = hall?.rooms || [];
      const room = selectedRooms.find((r) => r._id === newProperty.roomId);

      if (!floor || !hall || !room) {
        setModalError('Invalid floor, wing, or room selection');
        toast.error('Invalid floor, wing, or room selection', {
          position: 'top-right',
          autoClose: 3000,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
          toastId: 'selection-error',
        });
        return;
      }

      const payload = {
        floorName: floor.floorName,
        wingName: hall.wingName,
        roomName: room.roomName,
        devices: [
          {
            deviceBarcode: newProperty.id,
            deviceName: newProperty.name,
            devicePrice: newProperty.price || 0,
            deviceModel: newProperty.model || 'Unknown',
            deviceStatus: newProperty.status || 'working',
          },
        ],
      };
      console.log('Adding property payload:', payload);

      const response = await axiosInstance.post('/createFloor', payload);

      if (response.status === 201 || response.status === 200) {
        const newProp = {
          id: newProperty.id,
          name: newProperty.name,
          type: newProperty.type || 'default',
          brand: newProperty.brand || 'Unknown',
          model: newProperty.model || 'Unknown',
          status: newProperty.status || 'working',
          price: newProperty.price || 0,
          purchaseDate: newProperty.purchaseDate || '',
          floorId: floor._id,
          hallId: hall._id,
          roomId: room._id,
          floorName: floor.floorName,
          hallName: hall.wingName,
          roomName: room.roomName,
          deviceLocation: floor.floorName + '/' + hall.wingName + '/' + room.roomName,
        };
        setProperties([...properties, newProp]);
        setIsModalOpen(false);
        setNewProperty({
          id: '',
          name: '',
          type: '',
          brand: '',
          model: '',
          status: '',
          price: 0,
          purchaseDate: '',
          floorId: '',
          hallId: '',
          roomId: '',
        });
        setModalError('');
        toast.success('Property added successfully!', {
          position: 'top-right',
          autoClose: 4000,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
          toastId: 'add-success',
        });
      }
    } catch (err) {
      console.error('Error adding device:', err);
      const errorMessage = err.response?.data?.message || 'Network error';
      setModalError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        toastId: 'add-error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = async (updatedProperty) => {
    setLoading(true);
    try {
      const floor = floors.find((f) => f._id === updatedProperty.floorId);
      const hall = floor?.wings?.find((h) => h._id === updatedProperty.hallId);
      const room = hall?.rooms?.find((r) => r._id === updatedProperty.roomId);

      if (!floor || !hall || !room) {
        setError('Invalid floor, wing, or room selection');
        toast.error('Invalid floor, wing, or room selection', {
          position: 'top-right',
          autoClose: 3000,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
          toastId: 'edit-selection-error',
        });
        return;
      }

      const payload = {
        deviceBarcode: updatedProperty.id,
        newFloorName: floor.floorName,
        newWingName: hall.wingName,
        newRoomName: room.roomName,
        newStatus: updatedProperty.status === 'working' ? 'working' : 'not working',
      };
      console.log('Updating property payload:', payload);

      const response = await axiosInstance.put('/update-location-status', payload);

      if (response.status === 200) {
        setProperties(
          properties.map((prop) =>
            prop.id === updatedProperty.id ? { ...prop, ...updatedProperty } : prop
          )
        );
        setError('');
        toast.success('Property updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
          toastId: 'edit-success',
        });
      }
    } catch (err) {
      console.error('Error updating device:', err);
      const errorMessage = err.response?.data?.message || 'Network error';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        toastId: 'edit-error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setModalError('');
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSelectedFloor('all');
      setSelectedHall('all');
      setSelectedRoom('all');
      setSelectedDevice('');
      await fetchFilteredDevices();
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/device/${term}`);
      const { data } = response.data;
      if (!data.device) {
        throw new Error('Device data not found');
      }

      const mappedProperty = {
        id: data.device.deviceBarcode || '',
        name: data.device.deviceName || 'Unknown',
        type: getDeviceType(data.device.deviceName),
        brand: data.device.deviceName?.split(' ')[0] || 'Unknown',
        model: data.device.deviceModel || 'Unknown',
        status:
          data.device.deviceStatus?.toLowerCase() === 'working'
            ? 'working'
            : data.device.deviceStatus?.toLowerCase() === 'not working' ||
              data.device.deviceStatus?.toLowerCase() === 'under maintenance'
            ? 'not_working'
            : 'not_working',
        price: data.device.devicePrice || 0,
        purchaseDate: '',
        floorId: '',
        hallId: '',
        roomId: '',
        floorName: data.floorName || 'Unknown',
        hallName: data.wingName || 'Unknown',
        roomName: data.roomName || 'Unknown',
        deviceLocation:
          (data.floorName || 'Unknown') +
          '/' +
          (data.wingName || 'Unknown') +
          '/' +
          (data.roomName || 'Unknown'),
      };

      setProperties([mappedProperty]);
      setError('');
      toast.success('Device found!', {
        position: 'top-right',
        autoClose: 3000,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        toastId: 'search-success',
      });
    } catch (err) {
      console.error('Error searching device:', err);
      const errorMessage = err.response?.data?.message || 'Device not found';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        toastId: 'search-error',
      });
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  const handleSearchIconClick = () => {
    handleSearch(searchTerm);
  };

  const downloadCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Type',
      'Brand',
      'Model',
      'Status',
      'Price',
      'Purchase Date',
      'Floor',
      'Wing',
      'Room',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredProperties.map((property) =>
        `"${property.id}","${property.name}","${property.type}","${property.brand}","${property.model}","${property.status}","${property.price || 0}","${property.purchaseDate || ''}","${property.floorName}","${property.hallName}","${property.roomName}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV downloaded successfully!', {
      position: 'top-right',
      autoClose: 3000,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      toastId: 'csv-success',
    });
  };

  const modalContent = (
    <>
      <style>
        {`
          .modal-content::-webkit-scrollbar {
            display: none;
          }
          .modal-content {
            scrollbar-width: none;
            ms-overflow-style: none;
          }
          select.custom-select option {
            background-color: #E5E7EB;
            color: #111827;
          }
          select.custom-select option:hover {
            background-color: #D1D5DB;
          }
          .custom-border {
            border: 1px solid rgba(209, 213, 219, 0.4);
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
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
          }
        `}
      </style>
      <div
        className="fixed inset-0 z-[200] bg-gray-800/60 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
      />
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'relative w-full max-w-md rounded-2xl p-6',
            'shadow-lg shadow-black/10 dark:shadow-white/10',
            'bg-gray-200/30 dark:bg-white/10 backdrop-blur-md',
            'border border-gray-300/40 dark:border-white/20 ring-1 ring-gray-300/40 dark:ring-white/20',
            'text-gray-900 dark:text-white transition-colors duration-300',
            'max-h-[80vh] flex flex-col'
          )}
        >
          <div className="flex justify-between items-center border-b border-gray-300/40 dark:border-white/20 pb-4">
            <h2 className="text-xl font-bold">Add New Property</h2>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setModalError('');
              }}
              className="text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-300/20 dark:hover:bg-white/20 rounded-md p-1 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="modal-content overflow-y-auto flex-1 pt-4 pb-4">
            {modalError && (
              <div className="mb-4 p-3 bg-red-100/20 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                {modalError}
              </div>
            )}
            <div className="flex items-center justify-start mb-6">
              <div
                className={cn(
                  'p-4 rounded-full mr-4',
                  newProperty.status === PropertyStatus.Working
                    ? 'bg-green-100/20 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : newProperty.status === PropertyStatus.NotWorking
                    ? 'bg-red-100/20 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-gray-100/30 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                )}
              >
                {newProperty.type ? propertyIcons[newProperty.type] || propertyIcons.default : <Plus className="h-8 w-8" />}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {newProperty.type
                    ? newProperty.type
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                    : 'New Property'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-white/80">
                  {newProperty.brand && newProperty.model
                    ? `${newProperty.brand} ${newProperty.model}`
                    : 'Select type to begin'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Device Name
                  </h4>
                  <input
                    type="text"
                    name="name"
                    value={newProperty.name}
                    onChange={handleInputChange}
                    className="custom-border rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Barcode
                  </h4>
                  <input
                    type="text"
                    name="id"
                    value={newProperty.id}
                    onChange={handleInputChange}
                    className="custom-border rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Brand
                  </h4>
                  <input
                    type="text"
                    name="brand"
                    value={newProperty.brand}
                    onChange={handleInputChange}
                    className="custom-border rounded-md p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-blue-400 transition-all duration-300 ease-in-out"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Model
                  </h4>
                  <input
                    type="text"
                    name="model"
                    value={newProperty.model}
                    onChange={handleInputChange}
                    className="custom-border rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Device Type
                  </h4>
                  <div className="relative">
                    <select
                      name="type"
                      value={newProperty.type}
                      onChange={handleInputChange}
                      className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out pr-10"
                    >
                      <option value="">Select Type</option>
                      {Object.values(PropertyType).map((type) => (
                        <option key={type} value={type}>
                          {type
                            .split('-')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Status
                  </h4>
                  <div className="relative">
                    <select
                      name="status"
                      value={newProperty.status}
                      onChange={handleInputChange}
                      className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out pr-10"
                    >
                      <option value="">Select Status</option>
                      {Object.values(PropertyStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Price
                  </h4>
                  <input
                    type="number"
                    name="price"
                    value={newProperty.price}
                    onChange={handleInputChange}
                    className="custom-border rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Purchase Date
                  </h4>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={newProperty.purchaseDate}
                    onChange={handleInputChange}
                    className="custom-border rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Floor
                  </h4>
                  <div className="relative">
                    <select
                      name="floorId"
                      value={newProperty.floorId}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          floorId: e.target.value,
                          hallId: '',
                          roomId: '',
                        })
                      }
                      className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out pr-10"
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
                      value={newProperty.hallId}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          hallId: e.target.value,
                          roomId: '',
                        })
                      }
                      className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out disabled:opacity-70 pr-10"
                      disabled={!newProperty.floorId}
                    >
                      <option value="">Select Wing</option>
                      {newProperty.floorId &&
                        floors
                          .find((f) => f._id === newProperty.floorId)
                          ?.wings?.map((wing) => (
                            <option key={wing._id} value={wing._id}>
                              {wing.wingName || 'Unnamed Wing'}
                            </option>
                          ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/80 mb-1">
                    Room
                  </h4>
                  <div className="relative">
                    <select
                      name="roomId"
                      value={newProperty.roomId}
                      onChange={handleInputChange}
                      className="custom-select custom-border appearance-none rounded p-3 w-full bg-gray-100/20 dark:bg-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out disabled:opacity-70 pr-10"
                      disabled={!newProperty.hallId}
                    >
                      <option value="">Select Room</option>
                      {newProperty.hallId &&
                        floors
                          .find((f) => f._id === newProperty.floorId)
                          ?.wings?.find((h) => h._id === newProperty.hallId)
                          ?.rooms?.map((room) => (
                            <option key={room._id} value={room._id}>
                              {room.roomName || 'Unnamed Room'}
                            </option>
                          ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300/40 dark:border-white/20 flex justify-end pt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setModalError('');
              }}
              className="px-4 py-2 text-sm bg-gray-100/20 dark:bg-white/10 hover:bg-gray-200/30 dark:hover:bg-white/20 text-gray-900 dark:text-white border-gray-300/40 dark:border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePropertySubmit}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Add Property
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const inputStyles = (
    <style>
      {`
        .animate-border-form {
          position: relative;
          border: 1px solid transparent;
        }
        .animate-border-form::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border: 2px solid #2ea44f;
          border-radius: 0.375rem;
          animation: border-form 3s linear infinite;
        }
        @keyframes border-form {
          0% { clip-path: polygon(0 0, 0 0, 0 0, 0 0); }
          25% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
          50% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          75% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
        }
        @media (prefers-color-scheme: dark) {
          .animate-border-form::before {
            border-color: #238636;
          }
        }
      `}
    </style>
  );

  return (
    <>
      {inputStyles}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover
        draggable
        theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        limit={3}
      />
      <div className="space-y-4 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100/20 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
            <div className="relative w-full sm:w-64">
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-3 pr-10 py-1.5 text-xs sm:pl-4 sm:pr-12 sm:py-2 sm:text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out w-full animate-border-form"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleSearchIconClick}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Add Property
            </Button>
            <Button
              onClick={downloadCSV}
              className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Download CSV
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="floor-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Floor
              </label>
              <select
                id="floor-filter"
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setSelectedHall('all');
                  setSelectedRoom('all');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Floors</option>
                {floors.map((floor) => (
                  <option key={floor._id} value={floor._id}>
                    {floor.floorName || 'Unnamed Floor'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="hall-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Wing
              </label>
              <select
                id="hall-filter"
                value={selectedHall}
                onChange={(e) => {
                  setSelectedHall(e.target.value);
                  setSelectedRoom('all');
                }}
                disabled={selectedFloor === 'all'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="all">All Wings</option>
                {halls.map((wing) => (
                  <option key={wing._id} value={wing._id}>
                    {wing.wingName || 'Unnamed Wing'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="room-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Room
              </label>
              <select
                id="room-filter"
                value={selectedRoom}
                onChange={(e) => {
                  setSelectedRoom(e.target.value);
                }}
                disabled={selectedHall === 'all'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="all">All Rooms</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomName || 'Unknown Room'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="device-filter"
                className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-1"
              >
                Device Type
              </label>
              <select
                id="device-filter"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Device Types</option>
                {Object.values(PropertyType).map((type) => (
                  <option key={type} value={type}>
                    {type
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isModalOpen && createPortal(modalContent, document.body)}

        <PropertyList
          properties={filteredProperties}
          title={`Inventory${selectedFloor !== 'all' ? ` - ${floors.find((f) => f._id === selectedFloor)?.floorName || ''}` : ''}${selectedHall !== 'all' ? ` ${halls.find((h) => h._id === selectedHall)?.wingName || ''}` : ''}${selectedRoom !== 'all' ? ` ${rooms.find((r) => r._id === selectedRoom)?.roomName || ''}` : ''}${selectedDevice ? ` ${selectedDevice
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}` : ''}`}
          onEdit={handleEditProperty}
          enableEdit={true}
          loading={loading}
        />
      </div>
    </>
  );
};
