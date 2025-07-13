import React, { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyModal } from './PropertyModal';

const PropertyType = {
  Monitor: 'monitor',
  Keyboard: 'keyboard',
  Mouse: 'mouse',
  Fan: 'fan',
  Light: 'light',
  Router: 'router',
  AC: 'ac',
};

export const PropertyList = ({ properties, title = 'Properties', onEdit, enableEdit = true }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const closeModal = () => {
    setSelectedProperty(null);
  };

  const filteredProperties = properties.filter((property) => {
    if (filterType !== 'all' && property.type !== filterType) {
      return false;
    }
    if (filterStatus !== 'all' && property.status !== filterStatus) {
      return false;
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types ({allCount})</option>
            {Object.values(PropertyType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} ({propertyCounts[type] || 0})
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="working">Working</option>
            <option value="not-working">Not Working</option>
          </select>
        </div>
      </div>
      {filteredProperties.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No properties found with the selected filters.</p>
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
          enableEdit={enableEdit}
        />
      )}
    </div>
  );
};