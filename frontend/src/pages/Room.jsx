import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PropertyList } from '../components/property/PropertyList';
import { StatusChart } from '../components/charts/StatusChart';
import { PropertyTypeChart } from '../components/charts/PropertyTypeChart';
import { buildingData } from '../data/mockData';

export const Room = () => {
  const { floorId, hallId, roomId } = useParams();

  // Validate buildingData
  if (!buildingData || !buildingData.floors) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500">Invalid building data</p>
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const floor = buildingData.floors.find((f) => f.id === Number(floorId));
  const hall = floor?.halls?.find((h) => h.id === Number(hallId));
  const room = hall?.rooms?.find((r) => r.id === Number(roomId));

  if (!floor || !hall || !room) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500">Room not found</p>
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm font-medium">
        <Link 
          to="/" 
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link 
          to={`/floors/${floor.id}`}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {floor.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link 
          to={`/floors/${floor.id}/halls/${hall.id}`}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {hall.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-900 dark:text-white">{room.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {floor.name}  {hall.name} {room.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View properties in this room
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
          <p className="text-xl font-semibold mt-1">{room.properties?.length || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Working</p>
          <p className="text-xl font-semibold mt-1 text-success-600 dark:text-success-400">
            {room.properties?.filter(p => p.status === 'working').length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Not Working</p>
          <p className="text-xl font-semibold mt-1 text-error-600 dark:text-error-400">
            {room.properties?.filter(p => p.status === 'not-working').length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Types of Equipment</p>
          <p className="text-xl font-semibold mt-1">
            {room.properties ? new Set(room.properties.map(p => p.type)).size : 0}
          </p>
        </div>
      </div>

      {room.properties?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart properties={room.properties} />
          <PropertyTypeChart properties={room.properties} />
        </div>
      )}

      <PropertyList 
        properties={room.properties || []} 
        title={`Properties in ${room.name}`} 
        enableEdit={false}
      />
    </div>
  );
};