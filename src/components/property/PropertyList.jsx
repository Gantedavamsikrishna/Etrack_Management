import React, { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyModal } from './PropertyModal';
import WifiLoader from '../../utils/Loader';
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

const PropertyStatus = {
  Working: 'working',
  NotWorking: 'not_working',
};

export const PropertyList = ({ properties, title = 'Properties', onEdit, onDelete, enableEdit = true, loading }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const closeModal = () => {
    setSelectedProperty(null);
  };

  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete && onDelete) {
      onDelete(propertyToDelete);
      setIsDeleteConfirmOpen(false);
      setPropertyToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setPropertyToDelete(null);
  };

  const filteredProperties = properties.filter((property) => {
    if (filterType !== 'all' && property.type !== filterType) {
      return false;
    }
    if (filterStatus !== 'all') {
      const normalizedStatus = property.status === 'working' ? 'working' : 'not_working';
      if (normalizedStatus !== filterStatus) {
        return false;
      }
    }
    return true;
  });

  const propertyCounts = properties.reduce((acc, property) => {
    acc[property.type] = (acc[property.type] || 0) + 1;
    return acc;
  }, {});

  const allCount = properties.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {Object.values(PropertyStatus).map((status) => (
              <option key={status} value={status}>
                {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="h-[250px] w-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <WifiLoader className="scale-[2]" />
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No devices found for the selected filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => handlePropertyClick(property)}
            />
          ))}
        </div>
      )}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={closeModal}
          onEdit={enableEdit ? onEdit : undefined}
          onDelete={enableEdit ? handleDelete : undefined}
          enableEdit={enableEdit}
        />
      )}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Are you sure you want to delete the device "{propertyToDelete.name}" (Barcode: {propertyToDelete.id})?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};