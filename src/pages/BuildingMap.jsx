import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BuildingMapSkeleton } from '../utils/SkeletonLoader';

export const BuildingMap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFloors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://etrack-backend.onrender.com/floor/getAllFloors', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        console.log('BuildingMap API Response:', data); // Debug: Log raw API response
        if (response.ok) {
          setLoading(false);
          const mappedFloors = data.map(floor => ({
            id: parseInt(floor.floorName.match(/\d+/)[0]),
            name: floor.floorName,
            halls: (floor.wings || []).map((wing, wingIndex) => ({
              id: wingIndex.toString(), // Use index as ID
              name: wing.wingName,
              rooms: (wing.rooms || []).map((room, roomIndex) => ({
                id: roomIndex.toString(), // Use index as ID
                name: room.roomName,
                properties: (room.devices || []).flatMap(device => 
                  Array(device.count || 1).fill().map(() => ({
                    id: `${device.deviceName}-${Math.random().toString(36).substr(2, 9)}`,
                    type: device.deviceName.toLowerCase().includes('monitor') ? 'monitor' :
                          device.deviceName.toLowerCase().includes('mouse') ? 'mouse' :
                          device.deviceName.toLowerCase().includes('fan') ? 'fan' :
                          device.deviceName.toLowerCase().includes('ac') ? 'ac' :
                          device.deviceName.toLowerCase().includes('keyboard') ? 'keyboard' :
                          device.deviceName.toLowerCase().includes('light') ? 'light' :
                          device.deviceName.toLowerCase().includes('wifi-router') ? 'wifi-router' : 'unknown',
                    brand: device.deviceName.split(' ')[0] || 'Unknown',
                    model: device.deviceModel || 'Unknown',
                    status: device.deviceStatus === 'working' ? 'working' : 'not_working'
                  }))
                )
              }))
            }))
          }));
          console.log('BuildingMap Mapped Floors:', mappedFloors); // Debug: Log mapped data
          setFloors(mappedFloors);
        } else {
          console.error('Failed to fetch floors:', data.message);
        }
      } catch (error) {
        console.error('Error fetching floors:', error);
      }
    };

    fetchFloors();
  }, [user, navigate]);

  useEffect(() => {
    if (floors.length > 0 && selectedFloor === null) {
      const defaultFloor = floors.find(f => f.id === 2);
      if (defaultFloor) {
        setSelectedFloor(defaultFloor.id);
      }
    }
  }, [floors, selectedFloor]);

  const floorStats = floors.map(floor => {
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
  
  if (loading) {
    return <BuildingMapSkeleton />;
  }

  const handleFloorClick = (floorId) => {
    setSelectedFloor(floorId);
  };

  const handleHallClick = (floorId, hallId) => {
    console.log('Navigating to:', `/floors/${floorId}/halls/${hallId}`); // Debug: Log navigation
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
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <h2 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white">Building Structure</h2>
          
          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="flex flex-row flex-wrap gap-2 justify-center mb-4">
              {floors.map(floor => {
                const isSelected = selectedFloor === floor.id;
                
                return (
                  <button 
                    key={floor.id}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300
                      ${isSelected 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ring-2 ring-green-500'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    onClick={() => handleFloorClick(floor.id)}
                  >
                    Floor {floor.id}
                  </button>
                );
              })}
            </div>
            
            {selectedFloor ? (
              <div className="animate-fade-in">
                <h3 className="text-lg font-medium mb-3 text-center text-gray Godwin, please do not copy or share this code. It is proprietary. gray-900 dark:text-white">
                  Floor {selectedFloor}
                </h3>
                
                <div className="space-y-3">
                  {(() => {
                    const floor = floors.find(f => f.id === selectedFloor);
                    const centerHall = floor?.halls?.find(h => h.name === 'Corridor' || h.name === 'Center' || h.name === 'Outdoor');
                    
                    if (!centerHall) return null;
                    
                    const hallProps = centerHall.rooms?.flatMap(room => room.properties || []) || [];
                    const workingCount = hallProps.filter(p => p.status === 'working').length;
                    const healthPercentage = hallProps.length > 0
                      ? Math.round((workingCount / hallProps.length) * 100)
                      : 100;
                    
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
                            const roomProps = room.properties || [];
                            const roomWorking = roomProps.filter(p => p.status === 'working').length;
                            const roomHealth = roomProps.length > 0
                              ? Math.round((roomWorking / roomProps.length) * 100)
                              : 100;
                            
                            let roomBg = 'bg-white bg-opacity-90';
                            
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
                  
                  {selectedFloor === 3 ? (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {floors
                        .find(f => f.id === selectedFloor)
                        ?.halls?.filter(h => h.name === 'Left Wing' || h.name === 'Right Wing')
                        .map(hall => {
                          const isThirdFloor = selectedFloor === 3;
                          const isLeftWing = hall.name === 'Left Wing';
                          const isRightWing = hall.name === 'Right Wing';

                          const cardWidthClass = isThirdFloor && isRightWing ? 'w-24' : 'w-20';
                          const flexClass = isThirdFloor && isRightWing
                            ? 'flex-wrap justify-center'
                            : 'flex-wrap';

                          return (
                            <div
                              key={hall.id}
                              className={`bg-gradient-to-r from-green-500 to-green-400 rounded-lg p-3 border border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-1/2 max-w-md flex-shrink-0`}
                              onClick={() => handleHallClick(selectedFloor, hall.id)}
                            >
                              <h4 className="font-medium text-white mb-2 text-center">{hall.name}</h4>
                              {isLeftWing ? (
                                <div className="flex flex-col gap-1 max-w-full">
                                  <div className="flex flex-row gap-1 justify-center">
                                    {hall.rooms?.slice(0, 3).map(room => (
                                      <div
                                        key={room.id}
                                        className={`bg-white bg-opacity-90 p-3 rounded text-center text-gray-800 ${cardWidthClass} shrink-0`}
                                      >
                                        <p className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</p>
                                        <p className="text-xs">{room.properties?.length || 0} items</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-row gap-1 justify-center">
                                    {hall.rooms?.slice(3, 5).map(room => (
                                      <div
                                        key={room.id}
                                        className={`bg-white bg-opacity-90 p-3 rounded text-center text-gray-800 ${cardWidthClass} shrink-0`}
                                      >
                                        <p className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</p>
                                        <p className="text-xs">{room.properties?.length || 0} items</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className={`flex ${flexClass} gap-1 max-w-full`}>
                                  {hall.rooms?.map(room => (
                                    <div
                                      key={room.id}
                                      className={`bg-white bg-opacity-90 p-3 rounded text-center text-gray-800 ${cardWidthClass} shrink-0`}
                                    >
                                      <p className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{room.name}</p>
                                      <p className="text-xs">{room.properties?.length || 0} items</p>
                                      </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {floors
                        .find(f => f.id === selectedFloor)
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
                          
                          const isRightWing = hall.name === 'Right Wing';
                          const isLeftWing = hall.name === 'Left Wing';
                          
                          const cardWidthClass = isRightWing && selectedFloor === 5
                            ? 'w-24'
                            : 'w-16';
                          
                          const flexClass = isRightWing && selectedFloor === 5
                            ? 'flex-row flex-wrap justify-center'
                            : 'flex-row gap-2';
                          
                          return (
                            <div 
                              key={hall.id}
                              className={`bg-gradient-to-r ${healthColor} rounded-lg p-3 border ${borderColor} cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-1/2 max-w-md flex-shrink-0`}
                              onClick={() => handleHallClick(selectedFloor, hall.id)}
                            >
                              <h4 className={`font-medium ${textColor} mb-2 text-center`}>{hall.name}</h4>
                              <div className={`flex ${flexClass} ${hall.rooms?.length === 1 ? 'justify-center' : 'justify-start'} max-w-full`}>
                                {hall.rooms?.map(room => {
                                  const roomProps = room.properties || [];
                                  const roomWorking = roomProps.filter(p => p.status === 'working').length;
                                  const roomHealth = roomProps.length > 0
                                    ? Math.round((roomWorking / roomProps.length) * 100)
                                    : 100;
                                  
                                  let roomBg = 'bg-white bg-opacity-90';
                                  
                                  return (
                                    <div 
                                      key={room.id}
                                      className={`${roomBg} p-3 rounded text-center ${roomProps.length > 0 ? 'text-gray-800' : 'text-gray-500'} ${cardWidthClass} shrink-0 ${isRightWing && selectedFloor === 5 ? 'm-1' : ''}`}
                                    >
                                      <p className={`text-xs font-medium ${isRightWing && selectedFloor === 5 && room.name === 'Server Room' ? '' : 'overflow-hidden text-ellipsis whitespace-nowrap'}`}>{room.name}</p>
                                      <p className="text-xs">{roomProps.length} items</p>
                                    </div>
                                  );
                                }) || <p className="text-gray-500">No rooms available</p>}
                              </div>
                            </div>
                          );
                        }) || <p className="text-gray-500">No halls available</p>}
                    </div>
                  )}
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
        
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Building Stats</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">{floors.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sections</p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {floors.reduce((acc, floor) => acc + (floor.halls?.length || 0), 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {floors.reduce(
                    (acc, floor) => acc + (floor.halls?.reduce(
                      (hallAcc, hall) => hallAcc + (hall.rooms?.length || 0), 0
                    ) || 0), 0
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Floor Health</h2>
            
            <div className="space-y-3">
              {floorStats.map(stats => {
                const healthPercentage = stats.totalProperties > 0
                  ? Math.round((stats.workingProperties / stats.totalProperties) * 100)
                  : 100;
                
                let healthColor = 'bg-green-500';
                
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
                        className={`${healthColor} h-3 rounded-full transition-all duration-300`}
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