import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildingData } from '../data/mockData';

export const BuildingMap = () => {
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState(null);

<<<<<<< HEAD
  // Floors 2–5 as defined in buildingData
  const totalFloors = 4;

  // Calculate floor statistics for health display
=======
  // Use buildingData.floors.length (4 floors: 2–5)
  const totalFloors = buildingData?.floors?.length || 0;

  // Calculate total properties and status counts for each floor
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
  const floorStats = (buildingData?.floors || []).map(floor => {
    const properties = floor.halls?.flatMap(hall => 
      hall.rooms?.flatMap(room => room.properties) || []
    ) || [];
<<<<<<< HEAD
=======
    
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
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
<<<<<<< HEAD
                const floorId = index + 2; // Floors 2–5
                const floor = buildingData.floors.find(f => f.id === floorId);
=======
                const floorId = index + 2; // Ascending order: Floor 2 to 5
                const floor = buildingData?.floors?.find(f => f.id === floorId);
                
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
                if (!floor) return null;
                const isSelected = selectedFloor === floorId;
<<<<<<< HEAD
=======
                
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
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
                
<<<<<<< HEAD
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
=======
                <div className="space-y-3">
                  {/* Center/Outdoor Hall */}
                  {(() => {
                    const floor = buildingData?.floors?.find(f => f.id === selectedFloor);
                    const centerHall = floor?.halls?.find(h => h.name === 'Center' || h.name === 'Corridor');
                    
                    if (!centerHall) return null;
                    
                    const hallProps = centerHall.rooms?.flatMap(room => room.properties || []) || [];
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
                    const workingCount = hallProps.filter(p => p.status === 'working').length;
                    const healthPercentage = hallProps.length > 0
                      ? Math.round((workingCount / hallProps.length) * 100)
                      : 100;
<<<<<<< HEAD
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
=======
                    
                    let healthColor = 'from-yellow-500 to-yellow-400';
                    let textColor = 'text-gray-900';
                    let borderColor = 'border-gray-300 dark:border-gray-600';
                    
                    return (
                      <div 
                        key={centerHall.id}
                        className={`bg-gradient-to-r ${healthColor} rounded-lg p-3 border ${borderColor} cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-md mx-auto flex-shrink-0`}
                        onClick={() => handleHallClick(selectedFloor, centerHall.id)}
                      >
                        <h4 className={`font-medium ${textColor} mb-2 text-center text-lg`}>{centerHall.name}</h4>
                        <div className={`flex flex-row flex-wrap gap-2 ${centerHall.rooms?.length === 1 ? 'justify-center' : 'justify-center'} max-w-full`}>
                          {centerHall.rooms?.map(room => {
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
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
<<<<<<< HEAD
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

=======
                  <div className={`flex ${selectedFloor === 3 ? 'flex-row' : 'flex-col sm:flex-row'} gap-3 justify-center`}>
                    {buildingData?.floors
                      ?.find(f => f.id === selectedFloor)
                      ?.halls?.filter(h => h.name === 'Left Wing' || h.name === 'Right Wing')
                      .map(hall => {
                        const hallProps = hall.rooms?.flatMap(room => room.properties || []) || [];
                        const workingCount = hallProps.filter(p => p.status === 'working').length;
                        const healthPercentage = hallProps.length > 0
                          ? Math.round((workingCount / hallProps.length) * 100)
                          : 100;
                        
                        let healthColor = 'from-green-500 to-green-400';
                        let textColor = 'text-white';
                        let borderColor = 'border-gray-300 dark:border-gray-600';
                        // if (healthPercentage < 70) {
                        //   healthColor = 'from-yellow-500 to-yellow-400';
                        //   textColor = 'text-gray-900';
                        // }
                        // if (healthPercentage < 50) {
                        //   healthColor = 'from-red-500 to-red-400';
                        //   textColor = 'text-white';
                        // }
                        
                        const isThirdFloor = selectedFloor === 3;
                        const isFifthFloor = selectedFloor === 5;
                        const isRightWing = hall.name === 'Right Wing';
                        const isLeftWing = hall.name === 'Left Wing';
                        
                        // Calculate card width and margin for 5th floor Right Wing only
                        const cardWidthClass = isFifthFloor && isRightWing ? 'w-24' : 'w-16';
                        const flexClass = isThirdFloor
                          ? isLeftWing
                            ? 'flex-row gap-0.5' // Single row for 3rd floor Left Wing
                            : 'flex-row flex-wrap gap-0.5' // Default for 3rd floor Right Wing
                          : isFifthFloor && isRightWing
                            ? 'flex-row flex-wrap gap-2 justify-center' // 5th floor Right Wing: centered, larger margin
                            : 'flex-row flex-wrap gap-0.5'; // Default for others
                        
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
                        return (
                          <div
                            key={hall.id}
<<<<<<< HEAD
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
=======
                            className={`bg-gradient-to-r ${healthColor} rounded-lg p-3 border ${borderColor} cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full ${selectedFloor === 3 ? 'sm:w-1/2' : 'sm:w-1/2'} max-w-md flex-shrink-0`}
                            onClick={() => handleHallClick(selectedFloor, hall.id)}
                          >
                            <h4 className={`font-medium ${textColor} mb-2 text-center`}>{hall.name}</h4>
                            <div className={`flex ${flexClass} ${hall.rooms?.length === 1 ? 'justify-center' : ''} max-w-full`}>
                              {hall.rooms?.map(room => {
                                const roomProps = room.properties || [];
                                const roomWorking = roomProps.filter(p => p.status === 'working').length;
                                const roomHealth = roomProps.length > 0
                                  ? Math.round((roomWorking / roomProps.length) * 100)
                                  : 100;
                                
                                let roomBg = 'bg-white bg-opacity-90';
                                // if (roomHealth < 70) roomBg = 'bg-white bg-opacity-75';
                                // if (roomHealth < 50) roomBg = 'bg-white bg-opacity-60';
                                
                                return (
                                  <div 
                                    key={room.id}
                                    className={`${roomBg} p-3 rounded text-center ${roomProps.length > 0 ? 'text-gray-800' : 'text-gray-500'} ${cardWidthClass} shrink-0`}
                                  >
                                    <p className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</p>
                                    <p className="text-xs">{roomProps.length} items</p>
                                  </div>
                                );
                              }) || <p className="text-gray-500">No rooms available</p>}
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
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
<<<<<<< HEAD
=======
            
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
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
<<<<<<< HEAD
=======
            
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
            <div className="space-y-3">
              {floorStats.map(stats => {
                const healthPercentage = stats.totalProperties > 0
                  ? Math.round((stats.workingProperties / stats.totalProperties) * 100)
                  : 100;
<<<<<<< HEAD
=======
                
                let healthColor = 'bg-green-500';
                // if (healthPercentage < 70) healthColor = 'bg-yellow-500';
                // if (healthPercentage < 50) healthColor = 'bg-red-500';
                
>>>>>>> 94c9c3b (resolved conflict in propertymodal (wifi icon))
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