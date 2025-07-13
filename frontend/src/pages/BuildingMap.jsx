import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildingData } from '../data/mockData';

export const BuildingMap = () => {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState(null);

  const totalFloors = buildingData.floors.length;

  // Calculate total properties and status counts for each floor
  const floorStats = buildingData.floors.map(floor => {
    const properties = floor.halls.flatMap(hall => 
      hall.rooms.flatMap(room => room.properties)
    );
    
    return {
      id: floor.id,
      totalProperties: properties.length,
      workingProperties: properties.filter(p => p.status === 'working').length,
      notWorkingProperties: properties.filter(p => p.status === 'not_working').length,
    };
  });

  const handleFloorClick = (floorId) => {
    setSelectedFloor(floorId);
  };

  const handleHallClick = (floorId, hallId) => {
    navigate(`/floors/${floorId}/halls/${hallId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Building Map</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visual representation of building structure and equipment distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Building visualization */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-6 text-center">Building Structure</h2>
          
          <div className="relative space-y-4 max-w-3xl mx-auto">
            {/* Floor selector */}
            <div className="absolute top-0 left-0 bottom-0 w-16 flex flex-col justify-center space-y-3">
              {[...Array(totalFloors)].map((_, index) => {
                const floorId = totalFloors + 1 - index;
                const floor = buildingData.floors.find(f => f.id === floorId);
                
                if (!floor) return null;
                
                const isSelected = selectedFloor === floorId;
                const stats = floorStats.find(s => s.id === floorId);
                
                // Calculate health percentage
                const healthPercentage = stats && stats.totalProperties > 0
                  ? Math.round((stats.workingProperties / stats.totalProperties) * 100)
                  : 100;
                
                // Determine color based on health
                let healthColor = 'bg-success-500';
                if (healthPercentage < 70) healthColor = 'bg-warning-500';
                if (healthPercentage < 50) healthColor = 'bg-error-500';
                
                return (
                  <button 
                    key={floorId}
                    className={`flex items-center justify-center w-12 h-12 rounded-md text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 ring-2 ring-primary-500'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    onClick={() => handleFloorClick(floorId)}
                  >
                    <div className="relative">
                      <span>{floorId}</span>
                      {stats && stats.totalProperties > 0 && (
                        <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${healthColor}`}></span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Floor visualization */}
            {selectedFloor ? (
              <div className="ml-20 animate-fade-in">
                <h3 className="text-md font-medium mb-4 text-center">
                  Floor {selectedFloor}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {buildingData.floors
                    .find(f => f.id === selectedFloor)
                    ?.halls.map(hall => {
                      // Calculate hall health
                      const hallProps = hall.rooms.flatMap(room => room.properties);
                      const workingCount = hallProps.filter(p => p.status === 'working').length;
                      const healthPercentage = hallProps.length > 0
                        ? Math.round((workingCount / hallProps.length) * 100)
                        : 100;
                      
                      // Determine color based on health
                      let healthColor = 'from-success-500 to-success-400';
                      let textColor = 'text-white';
                      if (healthPercentage < 70) {
                        healthColor = 'from-warning-500 to-warning-400';
                        textColor = 'text-gray-900';
                      }
                      if (healthPercentage < 50) {
                        healthColor = 'from-error-500 to-error-400';
                        textColor = 'text-white';
                      }
                      
                      return (
                        <div 
                          key={hall.id}
                          className={`bg-gradient-to-r ${healthColor} rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                          onClick={() => handleHallClick(selectedFloor, hall.id)}
                        >
                          <h4 className={`font-medium ${textColor} mb-2`}>{hall.name}</h4>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {hall.rooms.map(room => {
                              // Calculate room health
                              const roomProps = room.properties;
                              const roomWorking = roomProps.filter(p => p.status === 'working').length;
                              const roomHealth = roomProps.length > 0
                                ? Math.round((roomWorking / roomProps.length) * 100)
                                : 100;
                              
                              let roomBg = 'bg-white bg-opacity-90';
                              if (roomHealth < 70) roomBg = 'bg-white bg-opacity-75';
                              if (roomHealth < 50) roomBg = 'bg-white bg-opacity-60';
                              
                              return (
                                <div 
                                  key={room.id}
                                  className={`${roomBg} p-2 rounded text-center ${roomProps.length > 0 ? 'text-gray-800' : 'text-gray-500'}`}
                                >
                                  <p className="text-xs font-medium">{room.name}</p>
                                  <p className="text-xs">{roomProps.length} items</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="ml-20 flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a floor to view its layout
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Building stats */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-4">Building Stats</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
                <p className="text-xl font-medium">{totalFloors}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Halls</p>
                <p className="text-xl font-medium">
                  {buildingData.floors.reduce((acc, floor) => acc + floor.halls.length, 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
                <p className="text-xl font-medium">
                  {buildingData.floors.reduce(
                    (acc, floor) => acc + floor.halls.reduce(
                      (hallAcc, hall) => hallAcc + hall.rooms.length, 0
                    ), 0
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Floor health */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-4">Floor Health</h2>
            
            <div className="space-y-4">
              {floorStats.map(stats => {
                const healthPercentage = stats.totalProperties > 0
                  ? Math.round((stats.workingProperties / stats.totalProperties) * 100)
                  : 100;
                
                let healthColor = 'bg-success-500';
                if (healthPercentage < 70) healthColor = 'bg-warning-500';
                if (healthPercentage < 50) healthColor = 'bg-error-500';
                
                return (
                  <div key={stats.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Floor {stats.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.workingProperties}/{stats.totalProperties} working
                      </p>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`${healthColor} h-2.5 rounded-full`}
                        style={{ width: `${healthPercentage}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-right">
                      {healthPercentage}% healthy
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-2">Map Legend</h2>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-success-500 mr-2"></div>
                <p className="text-sm">Healthy (70-100%)</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-warning-500 mr-2"></div>
                <p className="text-sm">Needs Attention (50-69%)</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-error-500 mr-2"></div>
                <p className="text-sm">Critical (0-49%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
