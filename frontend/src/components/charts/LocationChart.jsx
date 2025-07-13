import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const LocationChart = ({ data, locationType }) => {
  // Process data for the chart
  const chartData = data.map((item) => {
    let properties = [];
    
    if (locationType === 'floor') {
      // For floors, collect properties from all halls and rooms
      item.halls.forEach((hall) => {
        hall.rooms.forEach((room) => {
          properties = properties.concat(room.properties);
        });
      });
    } else if (locationType === 'hall') {
      // For halls, collect properties from all rooms
      item.rooms.forEach((room) => {
        properties = properties.concat(room.properties);
      });
    } else {
      // For rooms, just get the properties
      properties = item.properties;
    }
    
    const workingCount = properties.filter((p) => p.status === 'working').length;
    const notWorkingCount = properties.filter((p) => p.status === 'not_working').length;
    
    return {
      name: item.name,
      'Working': workingCount,
      'Not Working': notWorkingCount,
      total: workingCount + notWorkingCount,
    };
  });

  return (
    <div className="h-80 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-white">
        Properties by {locationType.charAt(0).toUpperCase() + locationType.slice(1)}
      </h3>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: '#e2e8f0',
                borderRadius: '0.375rem',
              }} 
            />
            <Legend />
            <Bar dataKey="Working" fill="#22c55e" animationDuration={1000} />
            <Bar dataKey="Not Working" fill="#ef4444" animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}
    </div>
  );
};
