import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { PropertyType } from '../../types/index.js';

export const PropertyTypeChart = ({ properties, minCount = 0 }) => {
  try {
    if (!Array.isArray(properties)) {
      return (
        <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">Property Types</h3>
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500 dark:text-red-400">Invalid properties data format</p>
          </div>
        </div>
      );
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
    }).filter(item => item.total > minCount);

    const hasData = propertyTypeCounts.length > 0;

    return (
      <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">Property Types</h3>

        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={260}>
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
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    return (
                      <div className="bg-white dark:bg-gray-900 text-sm p-2 rounded shadow border border-gray-300 dark:border-gray-700">
                        {payload.map((entry, index) => (
                          <p
                            key={`item-${index}`}
                            style={{ color: entry.color }}
                            className="font-medium"
                          >
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar
                  dataKey="working"
                  stackId="a"
                  fill="#0f766e"
                  stroke="#ffffff"
                  strokeWidth={0}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="not working"
                  stackId="a"
                  fill="#991b1b"
                  stroke="#ffffff"
                  strokeWidth={0}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* ✅ Custom Labels Below the Chart */}
           
          </>
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