import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildingData } from '../data/mockData';

export const BuildingMap = () => {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Floors 2–5 as defined in buildingData
  const totalFloors = 4;

  // Calculate floor statistics for health display
  const floorStats = (buildingData?.floors || []).map(floor => {
    const properties = floor.halls?.flatMap(hall => 
      hall.rooms?.flatMap(room => room.properties) || []
    ) || [];
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
    <div className="space-y-4 p-3 sm:p-3 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Building Map</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore the building's structure and equipment distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Building visualization */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">Building Structure</h2>
          
          <div className="space-y-3 max-w-4xl mx-auto">
            {/* Floor selector */}
            <div className="flex flex-row flex-wrap gap-2 justify-center mb-4">
              {[...Array(totalFloors)].map((_, index) => {
                const floorId = index + 2; // Floors 2–5
                const floor = buildingData.floors.find(f => f.id === floorId);
                if (!floor) return null;
                const isSelected = selectedFloor === floorId;
                return (
                  <button 
                    key={floorId}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300
                      ${isSelected 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ring-2 ring-green-500'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    onClick={() => handleFloorClick(floorId)}
                  >
                    Floor {floorId}
                  </button>
                );
              })}
            </div>
            
            {/* Floor visualization */}
            {selectedFloor ? (
              <div className="animate-fade-in">
                <h3 className="text-lg font-medium mb-3 text-center text-gray-900 dark:text-white">
                  Floor {selectedFloor}
                </h3>
                
                <div className="space-y-4">
                  {/* Corridor Hall */}
                  {(() => {
                    const floor = buildingData.floors.find(f => f.id === selectedFloor);
                    const corridorHall = floor?.halls.find(h => h.name === 'Corridor');
                    if (!corridorHall) {
                      return (
                        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4 border border-gray-300 dark:border-gray-600 text-center">
                          <p className="text-gray-600 dark:text-gray-400">No Corridor hall found for this floor.</p>
                        </div>
                      );
                    }
                    const hallProps = corridorHall.rooms?.flatMap(room => room.properties || []) || [];
                    const workingCount = hallProps.filter(p => p.status === 'working').length;
                    const healthPercentage = hallProps.length > 0
                      ? Math.round((workingCount / hallProps.length) * 100)
                      : 100;
                    const healthColor = 'from-yellow-500 to-yellow-400';
                    const textColor = 'text-gray-900';
                    const borderColor = 'border-gray-300 dark:border-gray-600';
                    return (
                      <div 
                        key={corridorHall.id}
                        className={`bg-gradient-to-r ${healthColor} rounded-lg p-3 border ${borderColor} cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-md mx-auto`}
                        onClick={() => handleHallClick(selectedFloor, corridorHall.id)}
                      >
                        <h4 className={`font-medium ${textColor} mb-2 text-center text-lg`}>{corridorHall.name}</h4>
                        <div className={`flex flex-row flex-wrap gap-2 ${corridorHall.rooms?.length === 1 ? 'justify-center' : 'justify-center'} max-w-full`}>
                          {corridorHall.rooms?.map(room => {
                            const roomProps = room.properties || [];
                            const roomWorking = roomProps.filter(p => p.status === 'working').length;
                            const roomHealth = roomProps.length > 0
                              ? Math.round((roomWorking / roomProps.length) * 100)
                              : 100;
                            const roomBg = 'bg-white bg-opacity-90';
                            return (
                              <div 
                                key={room.id}
                                className={`${roomBg} p-3 rounded text-center ${roomProps.length > 0 ? 'text-gray-800' : 'text-gray-500'} w-24 shrink-0`}
                              >
                                <p className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</p>
                                <p className="text-xs">{roomProps.length} items</p>
                              </div>
                            );
                          }) || <p className="text-gray-500">No rooms available</p>}
                        </div>
                      </div>
                    );
                  })()}
                  
                  {/* Left and Right Wings */}
                  <div className={`flex ${selectedFloor === 3 ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'} gap-3 justify-center`}>
                    {buildingData.floors.find(f => f.id === selectedFloor)
                      ?.halls.filter(h => h.name === 'Left Wing' || h.name === 'Right Wing')
                      .map(hall => {
                        const isThirdFloor = selectedFloor === 3;
                        const isLeftWing = hall.name === 'Left Wing';
                        const isRightWing = hall.name === 'Right Wing';

                        const cardWidthClass = isThirdFloor && isRightWing ? 'w-24' : 'w-16';
                        const flexClass = isThirdFloor && isLeftWing
                          ? 'flex-wrap justify-center sm:justify-start'
                          : isThirdFloor && isRightWing
                            ? 'flex-wrap justify-center'
                            : 'flex-wrap';

                        return (
                          <div
                            key={hall.id}
                            className={`bg-gradient-to-r from-green-500 to-green-400 rounded-lg p-3 border border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-1/2 max-w-md flex-shrink-0`}
                            onClick={() => handleHallClick(selectedFloor, hall.id)}
                          >
                            <h4 className="font-medium text-white mb-2 text-center">{hall.name}</h4>
                            <div className={`flex ${flexClass} gap-1 max-w-full`}>
                              {hall.rooms?.map(room => (
                                <div
                                  key={room.id}
                                  className={`bg-white bg-opacity-90 p-3 rounded text-center text-gray-800 ${cardWidthClass} shrink-0`}
                                >
                                  <p className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</p>
                                  <p className="text-xs">{room.properties?.length || 0} items</p>
                                </div>
                              )) || <p className="text-gray-500">No rooms available</p>}
                            </div>
                          </div>
                        );
                      }) || <p className="text-gray-500">No halls available</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a floor to view its layout
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Building stats */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Building Stats</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">{totalFloors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sections</p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {buildingData?.floors?.reduce((acc, floor) => acc + (floor.halls?.length || 0), 0) || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {buildingData?.floors?.reduce(
                    (acc, floor) => acc + (floor.halls?.reduce(
                      (hallAcc, hall) => hallAcc + (hall.rooms?.length || 0), 0
                    ) || 0), 0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Floor health */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Floor Health</h2>
            <div className="space-y-3">
              {floorStats.map(stats => {
                const healthPercentage = stats.totalProperties > 0
                  ? Math.round((stats.workingProperties / stats.totalProperties) * 100)
                  : 100;
                return (
                  <div key={stats.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Floor {stats.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.workingProperties}/{stats.totalProperties} working
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${healthPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-gray-600 dark:text-gray-400">
                      {healthPercentage}% healthy
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};