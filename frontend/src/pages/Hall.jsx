import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, DoorOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { PropertyList } from '../components/property/PropertyList';
import { StatusChart } from '../components/charts/StatusChart';
import { PropertyTypeChart } from '../components/charts/PropertyTypeChart.jsx';
import { LocationChart } from '../components/charts/LocationChart';
import { buildingData } from '../data/mockData';

export const Hall = () => {
  const { floorId, hallId } = useParams();
  const navigate = useNavigate();

  // Find hall data
  const floor = buildingData.floors.find((f) => f.id === Number(floorId));
  const hall = floor?.halls.find((h) => h.id === Number(hallId));

  if (!floor || !hall) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500">Hall not found</p>
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Get all properties in this hall
  const allProperties = hall.rooms.flatMap(room => room.properties);
  
  // Calculate summary stats
  const totalProperties = allProperties.length;
  const workingProperties = allProperties.filter(p => p.status === 'working').length;
  const notWorkingProperties = allProperties.filter(p => p.status === 'not_working').length;

  // Handle room card click
  const handleRoomClick = (roomId) => {
    navigate(`/floors/${floorId}/halls/${hallId}/rooms/${roomId}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
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
        <span className="text-gray-900 dark:text-white">{hall.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {floor.name} &gt; {hall.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview and management of all rooms in this hall
        </p>
      </div>

      {/* Hall summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
          <p className="text-xl font-semibold mt-1">{hall.rooms.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
          <p className="text-xl font-semibold mt-1">{totalProperties}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Working</p>
          <p className="text-xl font-semibold mt-1 text-success-600 dark:text-success-400">
            {workingProperties} ({totalProperties > 0 ? Math.round((workingProperties / totalProperties) * 100) : 0}%)
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Not Working</p>
          <p className="text-xl font-semibold mt-1 text-error-600 dark:text-error-400">
            {notWorkingProperties} ({totalProperties > 0 ? Math.round((notWorkingProperties / totalProperties) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* Charts section */}
      {totalProperties > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <StatusChart properties={allProperties} />
          </div>
          <div className="lg:col-span-8">
            <PropertyTypeChart properties={allProperties} />
          </div>
        </div>
      )}

      {/* Rooms in this hall */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Rooms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hall.rooms.map((room) => {
            const roomProps = room.properties;
            const working = roomProps.filter(p => p.status === 'working').length;
            const percentage = roomProps.length > 0 
              ? Math.round((working / roomProps.length) * 100) 
              : 0;
            
            return (
              <Card 
                key={room.id}
                className="overflow-hidden hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleRoomClick(room.id)}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="p-2 rounded-md bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 mr-3">
                        <DoorOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-medium">{room.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Properties:</span>
                        <span className="font-medium">{roomProps.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Working:</span>
                        <span className="font-medium text-success-600 dark:text-success-400">
                          {working} ({percentage}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Room comparison chart */}
      {hall.rooms.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Room Comparison
          </h2>
          <LocationChart data={hall.rooms} locationType="room" />
        </div>
      )}

      {/* All properties in this hall */}
      {totalProperties > 0 && (
        <PropertyList 
          properties={allProperties} 
          title={`All Properties in ${hall.name}`} 
        />
      )}
    </div>
  );
};
