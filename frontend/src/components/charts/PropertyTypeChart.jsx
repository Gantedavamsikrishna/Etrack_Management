import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { PropertyType } from '../../types/index.js';

export const PropertyTypeChart = ({ properties }) => {
  try {
    // Validate properties prop
    if (!properties) {
      console.error('Properties prop is undefined or null');
      return (
        <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">Property Types</h3>
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500 dark:text-red-400">Error: No properties data provided</p>
          </div>
        </div>
      );
    }

    if (!Array.isArray(properties)) {
      console.error('Properties is not an array:', properties);
      return (
        <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">Property Types</h3>
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500 dark:text-red-400">Error: Invalid properties data format</p>
          </div>
        </div>
      );
    }

    // Log detailed property information
    console.log('Properties (first 5 for brevity):', properties.slice(0, 5));
    console.log('Unique Property Types:', [...new Set(properties.map(p => p.type || 'MISSING_TYPE'))]);
    console.log('Unique Status Values:', [...new Set(properties.map(p => p.status || 'MISSING_STATUS'))]);
    console.log('PropertyType Enum:', Object.values(PropertyType));

    // Validate property structure and log specific issues
    const invalidProperties = properties.filter(
      p => !p.type || !p.status || !Object.values(PropertyType).includes(p.type) || !['working', 'not_working'].includes(p.status)
    );
    if (invalidProperties.length > 0) {
      console.warn('Invalid properties detected:', invalidProperties.slice(0, 5));
      console.warn('Invalid property details:', 
        invalidProperties.slice(0, 5).map(p => ({
          id: p.id,
          type: p.type || 'MISSING',
          status: p.status || 'MISSING',
          reason: [
            !p.type ? 'Missing type' : '',
            !p.status ? 'Missing status' : '',
            p.type && !Object.values(PropertyType).includes(p.type) ? `Invalid type: ${p.type}` : '',
            p.status && !['working', 'not_working'].includes(p.status) ? `Invalid status: ${p.status}` : ''
          ].filter(Boolean).join(', ')
        })
      ));
    }

    const propertyTypeValues = Object.values(PropertyType);

    const propertyTypeCounts = propertyTypeValues.map((type) => {
      const count = properties.filter((p) => p.type === type).length;
      const workingCount = properties.filter((p) => p.type === type && p.status === 'working').length;
      const notWorkingCount = count - workingCount;

      const formattedType = type
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        type: formattedType,
        total: count,
        working: workingCount,
        'not working': notWorkingCount,
      };
    }).filter(item => item.total > 0);

    // Log the processed data
    console.log('Property Type Counts:', propertyTypeCounts);

    // Check if there's any data to display
    const hasData = propertyTypeCounts.some(item => item.total > 0);
    if (!hasData) {
      console.warn('No valid data to display in chart');
    }

    return (
      <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">Property Types</h3>

        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={propertyTypeCounts}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: '#e2e8f0',
                  borderRadius: '0.375rem',
                }} 
              />
              <Legend />
              <Bar dataKey="working" stackId="a" fill="#22c55e" animationDuration={1000} />
              <Bar dataKey="not working" stackId="a" fill="#ef4444" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No valid data available</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in PropertyTypeChart:', error);
    return (
      <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">Property Types</h3>
        <div className="h-full flex items-center justify-center">
          <p className="text-red-500 dark:text-red-400">Error rendering chart: {error.message}</p>
        </div>
      </div>
    );
  }
};