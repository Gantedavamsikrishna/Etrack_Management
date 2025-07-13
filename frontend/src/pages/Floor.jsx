import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { LocationChart } from '../components/charts/LocationChart';
import { StatusChart } from '../components/charts/StatusChart';
import { PropertyTypeChart } from '../components/charts/PropertyTypeChart.jsx';
import { buildingData } from '../data/mockData';

export const Floor = () => {
  const { floorId } = useParams();
  const navigate = useNavigate();

  // Find floor data
  const floor = buildingData.floors.find((f) => f.id === Number(floorId));

  if (!floor) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-red-500">Floor not found</p>
        <Link 
          to="/" 
          className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Get all properties on this floor
  const allProperties = floor.halls.flatMap(hall => 
    hall.rooms.flatMap(room => room.properties)
  );
  
  // Calculate summary stats
  const totalProperties = allProperties.length;
  const workingProperties = allProperties.filter(p => p.status === 'working').length;
  const notWorkingProperties = allProperties.filter(p => p.status === 'not_working').length;

  // Handle hall card click
  const handleHallClick = (hallId) => {
    navigate(`/floors/${floorId}/halls/${hallId}`);
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
        <span className="text-gray-900 dark:text-white">{floor.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {floor.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview and management of all halls on this floor
        </p>
      </div>

      {/* Floor summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Halls</p>
          <p className="text-xl font-semibold mt-1">{floor.halls.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
          <p className="text-xl font-semibold mt-1">
            {floor.halls.reduce((count, hall) => count + hall.rooms.length, 0)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
          <p className="text-xl font-semibold mt-1">{totalProperties}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Working Status</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-success-600 dark:text-success-400">
              {workingProperties} 
              <span className="text-xs text-gray-500 ml-1">
                ({totalProperties > 0 ? Math.round((workingProperties / totalProperties) * 100) : 0}%)
              </span>
            </p>
            <p className="text-error-600 dark:text-error-400">
              {notWorkingProperties}
              <span className="text-xs text-gray-500 ml-1">
                ({totalProperties > 0 ? Math.round((notWorkingProperties / totalProperties) * 100) : 0}%)
              </span>
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
            <div
              className="bg-success-500 h-2.5 rounded-full"
              style={{ width: `${totalProperties > 0 ? (workingProperties / totalProperties) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Working</span>
            <span>Not Working</span>
          </div>
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

      {/* Halls in this floor */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Halls
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {floor.halls.map((hall) => {
            const hallProps = hall.rooms.flatMap(room => room.properties);
            const rooms = hall.rooms.length;
            const working = hallProps.filter(p => p.status === 'working').length;
            const percentage = hallProps.length > 0 
              ? Math.round((working / hallProps.length) * 100) 
              : 0;
            
            return (
              <Card 
                key={hall.id}
                className="overflow-hidden hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleHallClick(hall.id)}
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mr-3">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-medium">{hall.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rooms</p>
                        <p className="text-lg font-medium">{rooms}</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Properties</p>
                        <p className="text-lg font-medium">{hallProps.length}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Working Status</span>
                        <span className="font-medium">
                          {working}/{hallProps.length} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
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

      {/* Hall comparison chart */}
      {floor.halls.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Hall Comparison
          </h2>
          <LocationChart data={floor.halls} locationType="hall" />
        </div>
      )}
    </div>
  );
};
