import React, { useState } from 'react';
import { PropertyList } from '../components/property/PropertyList';
import { buildingData } from '../data/mockData';
import { PropertyType } from '../types';

export const Inventory = () => {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedHall, setSelectedHall] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('all');

  // Get all properties with their location info
  const allProperties = buildingData.floors.flatMap(floor => 
    floor.halls.flatMap(hall => 
      hall.rooms.flatMap(room => 
        room.properties.map(property => ({
          ...property,
          floorId: floor.id,
          hallId: hall.id,
          roomId: room.id,
          floorName: floor.name,
          hallName: hall.name,
          roomName: room.name
        }))
      )
    )
  );

  // Get unique floors, halls, and rooms for dropdowns
  const floors = buildingData.floors;
  const halls = selectedFloor === 'all' 
    ? []
    : floors.find(f => f.id === parseInt(selectedFloor))?.halls || [];
  const rooms = selectedHall === 'all' 
    ? []
    : halls.find(h => h.id === parseInt(selectedHall))?.rooms || [];
  
  // Apply filters for properties (excluding device type for groupedByType)
  const preFilteredProperties = allProperties.filter((property) => {
    if (selectedFloor !== 'all' && property.floorId !== parseInt(selectedFloor)) {
      return false;
    }
    if (selectedHall !== 'all' && property.hallId !== parseInt(selectedHall)) {
      return false;
    }
    if (selectedRoom !== 'all' && property.roomId !== parseInt(selectedRoom)) {
      return false;
    }
    return true;
  });

  // Group by type based on pre-filtered properties
  const groupedByType = Object.values(PropertyType).reduce((acc, type) => {
    acc[type] = preFilteredProperties.filter(p => p.type === type);
    return acc;
  }, {});

  // Apply all filters including device type
  const filteredProperties = preFilteredProperties.filter((property) => {
    if (selectedDevice !== 'all' && property.type !== selectedDevice) {
      return false;
    }
    return true;
  });

  // Format type for display
  const formatType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and track all equipment across the building
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        
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
                setSelectedDevice('all');
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              htmlFor="hall-filter" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Hall/Wing
            </label>
            <select
              id="hall-filter"
              value={selectedHall}
              onChange={(e) => {
                setSelectedHall(e.target.value);
                setSelectedRoom('all');
                setSelectedDevice('all');
              }}
              disabled={selectedFloor === 'all'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <option value="all">All Halls/Wings</option>
              {halls.map(hall => (
                <option key={hall.id} value={hall.id}>
                  {hall.name}
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
                setSelectedDevice('all');
              }}
              disabled={selectedHall === 'all'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <option value="all">All Rooms</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              htmlFor="device-filter" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Device Type
            </label>
            <select
              id="device-filter"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Devices ({preFilteredProperties.length})</option>
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {formatType(type)} ({groupedByType[type].length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Property List */}
      <PropertyList 
        properties={filteredProperties} 
        title={`Inventory ${
          selectedFloor !== 'all' 
            ? `- ${floors.find(f => f.id === parseInt(selectedFloor))?.name}` 
            : ''
        }${
          selectedHall !== 'all' 
            ? ` ${halls.find(h => h.id === parseInt(selectedHall))?.name}` 
            : ''
        }${
          selectedRoom !== 'all' 
            ? ` ${rooms.find(r => r.id === parseInt(selectedRoom))?.name}` 
            : ''
        }${
          selectedDevice !== 'all' 
            ? ` ${formatType(selectedDevice)}` 
            : ''
        }`} 
      />
    </div>
  );
};