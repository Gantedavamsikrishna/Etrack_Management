import React, { useState } from 'react';
import { PropertyList } from '../components/property/PropertyList';
import { buildingData } from '../data/mockData';
import { PropertyType, PropertyStatus } from '../types';
import Papa from 'papaparse';
import { Plus, X, Monitor, Keyboard, Mouse, Fan, Lightbulb, Wifi, AirVent, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

const propertyIcons = {
  "monitor": <Monitor className="h-8 w-8" />,
  "keyboard": <Keyboard className="h-8 w-8" />,
  "mouse": <Mouse className="h-8 w-8" />,
  "fan": <Fan className="h-8 w-8" />,
  "light": <Lightbulb className="h-8 w-8" />,
  "wifi-router": <Wifi className="h-8 w-8" />,
  "ac": <AirVent className="h-8 w-8" />,
};

export const Inventory = () => {
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedHall, setSelectedHall] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    id: '',
    name: '',
    type: '',
    brand: '',
    model: '',
    status: '',
    purchaseDate: '',
    notes: '',
    floorId: '',
    hallId: '',
    roomId: ''
  });

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

  const floors = buildingData.floors;
  const halls = selectedFloor === 'all' 
    ? []
    : floors.find(f => f.id === parseInt(selectedFloor))?.halls || [];
  const rooms = selectedHall === 'all' 
    ? []
    : halls.find(h => h.id === parseInt(selectedHall))?.rooms || [];

  // Apply filters
  const filteredProperties = allProperties.filter((property) => {
  
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
    if (selectedDevice !== '' && property.type !== selectedDevice) {
    return true;
  });

  const groupedByType = Object.values(PropertyType).reduce((acc, type) => {
    acc[type] = preFilteredProperties.filter(p => p.type === type);
    return acc;
  }, {});

  const filteredProperties = preFilteredProperties.filter((property) => {
    if (selectedDevice !== 'all' && property.type !== selectedDevice) {
      return false;
    }
    return true;
  });

  const formatType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle CSV download
  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Type', 'Brand', 'Model', 'Status', 'Purchase Date', 'Notes', 'Floor', 'Hall', 'Room'];
    const csvContent = [
      headers.join(','),
      ...filteredProperties.map(property => 
        `"${property.id}","${property.name}","${property.type}","${property.brand}","${property.model}","${property.status}","${property.purchaseDate || ''}","${property.notes || ''}","${property.floorName}","${property.hallName}","${property.roomName}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle CSV upload
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData = result.data;
          // Skip header row
          const properties = parsedData.slice(1).map(row => ({
            id: row[0],
            name: row[1],
            type: row[2],
            brand: row[3],
            model: row[4],
            status: row[5],
            purchaseDate: row[6] || '',
            notes: row[7] || '',
            floorName: row[8],
            hallName: row[9],
            roomName: row[10]
          }));
          // Validate properties
          const validProperties = properties.filter(prop => 
            prop.id &&
            prop.name &&
            prop.type && Object.values(PropertyType).includes(prop.type) &&
            prop.status && Object.values(PropertyStatus).includes(prop.status) &&
            prop.brand &&
            prop.model &&
            prop.floorName &&
            prop.hallName &&
            prop.roomName
          );
          // Add logic to map floorName, hallName, roomName to IDs and save to backend
          console.log('Valid parsed properties:', validProperties);
        },
        header: false,
        skipEmptyLines: true,
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  // Handle new property submission
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    // Generate a unique ID (replace with your ID generation logic)
    const newId = `prop-${Date.now()}`;
    const propertyToSave = { ...newProperty, id: newId };
    // Add logic to save new property to backend
    console.log('New property:', propertyToSave);
    setIsModalOpen(false);
    setNewProperty({
      id: '',
      name: '',
      type: '',
      brand: '',
      model: '',
      status: '',
      purchaseDate: '',
      notes: '',
      floorId: '',
      hallId: '',
      roomId: ''
    });
  };

  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all equipment across the building
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-all duration-300 ease-in-out"
          >
            Add Property
          </Button>
          <label className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-300 ease-in-out cursor-pointer">
            Bulk Upload
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />
          </label>
          <a
            href="data:text/csv;charset=utf-8,ID,Name,Type,Brand,Model,Status,Purchase Date,Notes,Floor,Hall,Room\nPROP001,Example Monitor,monitor,BrandX,ModelY,working,2023-01-01,Sample note,Floor 1,Hall A,Room 101"
            download="property_template.csv"
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-300 ease-in-out"
          >
            Download Template
          </a>
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-md transition-all duration-300 ease-in-out"
          >
            Download CSV
          </Button>
        </div>
      </div>

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
                setSelectedDevice('');
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
                setSelectedDevice('');
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
                setSelectedDevice('');
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
              <option value="">Select Device Type</option>
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {formatType(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {isModalOpen && (
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
              /* Style for the dropdown menu options */
              select.custom-select option {
                background-color: #1F2937; /* bg-gray-800 */
                color: #FFFFFF; /* text-white */
              }
              select.custom-select option:hover {
                background-color: #374151; /* hover:bg-gray-700 */
              }
              /* Ensure borders are visible */
              .custom-border {
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
              }
            `}
          </style>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
            onClick={handleBackdropClick}
          />
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className={cn(
                "relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-6",
                "shadow-lg shadow-black/10 dark:shadow-white/10",
                "bg-white/10 dark:bg-white/10 backdrop-blur-md",
                "border border-white/20 ring-1 ring-white/20",
                "text-white transition-colors duration-300",
                "max-h-[80vh] flex flex-col"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-white/20 pb-3">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Add New Property
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-md p-1 transition-colors duration-200"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-content overflow-y-auto flex-1 pt-4 pb-2 sm:pb-4">
                <div className="flex items-center justify-start mb-4 sm:mb-6">
                  <div className={cn(
                    "p-3 sm:p-4 rounded-full mr-3 sm:mr-4",
                    newProperty.status === PropertyStatus.Working 
                      ? 'bg-primary-100/20 dark:bg-primary-900/20 text-primary-400' 
                      : newProperty.status === PropertyStatus.NotWorking
                      ? 'bg-error-100/20 dark:bg-error-900/20 text-error-400'
                      : 'bg-gray-100/20 dark:bg-gray-900/20 text-gray-400'
                  )}>
                    {newProperty.type ? propertyIcons[newProperty.type] : <Plus className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium">
                      {newProperty.type ? formatType(newProperty.type) : 'New Property'}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80">
                      {newProperty.brand && newProperty.model ? `${newProperty.brand} ${newProperty.model}` : 'Select type to begin'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Property Name
                      </h4>
                      <input
                        type="text"
                        name="name"
                        value={newProperty.name}
                        onChange={handleInputChange}
                        className="custom-border border-1 border-solid border-white/20 rounded p-3 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        ID
                      </h4>
                      <input
                        type="text"
                        name="id"
                        value={newProperty.id}
                        onChange={handleInputChange}
                        className="custom-border border-1 border-solid border-white/20 rounded p-3 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Brand
                      </h4>
                      <input
                        type="text"
                        name="brand"
                        value={newProperty.brand}
                        onChange={handleInputChange}
                        className="custom-border border-1 border-solid border-white/20 rounded p-3 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Model
                      </h4>
                      <input
                        type="text"
                        name="model"
                        value={newProperty.model}
                        onChange={handleInputChange}
                        className="custom-border border-1 border-solid border-white/20 rounded p-3 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Device Type
                      </h4>
                      <div className="relative">
                        <select
                          name="type"
                          value={newProperty.type}
                          onChange={handleInputChange}
                          className="custom-select custom-border appearance-none border-1 border-solid border-white/20 rounded p-3 w-full bg-white/20 dark:bg-gray-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out pr-10"
                          required
                        >
                          <option value="">Select Type</option>
                          {Object.values(PropertyType).map(type => (
                            <option key={type} value={type}>{formatType(type)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Status
                      </h4>
                      <div className="relative">
                        <select
                          name="status"
                          value={newProperty.status}
                          onChange={handleInputChange}
                          className="custom-select custom-border appearance-none border-1 border-solid border-white/20 rounded p-3 w-full bg-white/20 dark:bg-gray-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out pr-10"
                          required
                        >
                          <option value="">Select Status</option>
                          {Object.values(PropertyStatus).map(status => (
                            <option key={status} value={status}>{formatType(status)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Purchase Date
                      </h4>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={newProperty.purchaseDate}
                        onChange={handleInputChange}
                        className="custom-border border-1 border-solid border-white/20 rounded p-3 w-full bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Floor
                      </h4>
                      <div className="relative">
                        <select
                          name="floorId"
                          value={newProperty.floorId}
                          onChange={(e) => setNewProperty({ ...newProperty, floorId: e.target.value, hallId: '', roomId: '' })}
                          className="custom-select custom-border appearance-none border-1 border-solid border-white/20 rounded p-3 w-full bg-white/20 dark:bg-gray-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out pr-10"
                          required
                        >
                          <option value="">Select Floor</option>
                          {floors.map(floor => (
                            <option key={floor.id} value={floor.id}>{floor.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Hall
                      </h4>
                      <div className="relative">
                        <select
                          name="hallId"
                          value={newProperty.hallId}
                          onChange={(e) => setNewProperty({ ...newProperty, hallId: e.target.value, roomId: '' })}
                          className="custom-select custom-border appearance-none border-1 border-solid border-white/20 rounded p-3 w-full bg-white/20 dark:bg-gray-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out disabled:opacity-70 pr-10"
                          disabled={!newProperty.floorId}
                          required
                        >
                          <option value="">Select Hall</option>
                          {newProperty.floorId && floors.find(f => f.id === parseInt(newProperty.floorId))?.halls.map(hall => (
                            <option key={hall.id} value={hall.id}>{hall.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                        Room
                      </h4>
                      <div className="relative">
                        <select
                          name="roomId"
                          value={newProperty.roomId}
                          onChange={handleInputChange}
                          className="custom-select custom-border appearance-none border-1 border-solid border-white/20 rounded p-3 w-full bg-white/20 dark:bg-gray-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out disabled:opacity-70 pr-10"
                          disabled={!newProperty.hallId}
                          required
                        >
                          <option value="">Select Room</option>
                          {newProperty.hallId && halls.find(h => h.id === parseInt(newProperty.hallId))?.rooms.map(room => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                      Notes
                    </h4>
                    <textarea
                      name="notes"
                      value={newProperty.notes}
                      onChange={handleInputChange}
                      className="custom-border border-1 border-solid border-white/20 rounded p-3 w-full min-h-[80px] max-h-[120px] bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ease-in-out resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 flex justify-end pt-4 pb-2 sm:pb-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePropertySubmit}
                  className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm bg-primary-500 hover:bg-primary-600 text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Add Property
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <PropertyList 
        properties={filteredProperties} 
        title={`Inventory${
          selectedFloor !== 'all' 
            ? ` - ${floors.find(f => f.id === parseInt(selectedFloor))?.name}` 
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
          selectedDevice !== '' 
            ? ` ${formatType(selectedDevice)}` 
            : ''
        }`}
      />
    </div>
  );
};
