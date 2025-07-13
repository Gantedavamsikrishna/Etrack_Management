import React, { useState } from 'react';
import { PropertyList } from '../components/property/PropertyList';
import { buildingData } from '../data/mockData';
import { PropertyType } from '../types';

export const Inventory = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Get all properties
  const allProperties = buildingData.floors.flatMap(floor => 
    floor.halls.flatMap(hall => 
      hall.rooms.flatMap(room => 
        room.properties
      )
    )
  );

  // Group by type
  const groupedByType = Object.values(PropertyType).reduce((acc, type) => {
    acc[type] = allProperties.filter(p => p.type === type);
    return acc;
  }, {});

  // Apply filters
  const filteredProperties = allProperties.filter((property) => {
    // Filter by type
    if (filterType !== 'all' && property.type !== filterType) {
      return false;
    }
    
    // Filter by status
    if (filterStatus !== 'all' && property.status !== filterStatus) {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="type-filter" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Property Type
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types ({allProperties.length})</option>
              {Object.values(PropertyType).map((type) => (
                <option key={type} value={type}>
                  {formatType(type)} ({groupedByType[type].length})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label 
              htmlFor="status-filter" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="working">Working</option>
              <option value="not_working">Not Working</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property List */}
      <PropertyList 
        properties={filteredProperties} 
        title={`Inventory ${
          filterType !== 'all' 
            ? `- ${formatType(filterType)}` 
            : ''
        } ${
          filterStatus !== 'all' 
            ? `(${filterStatus.replace('_', ' ')})` 
            : ''
        }`} 
      />
    </div>
  );
};