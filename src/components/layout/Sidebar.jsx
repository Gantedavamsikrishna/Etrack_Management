
import React, { useState, useEffect } from 'react';
import { Building2, Gauge, LampDesk, Layers, Map, FileText } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({
  to,
  icon,
  label,
  end = false,
  isChild = false,
  hasArrow = false,
  isExpanded = false,
  onToggle
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-700 dark:text-primary-100'
            : 'text-gray-700 dark:text-gray-300 hover:bg-primary-700 hover:text-white dark:hover:bg-primary-700 dark:hover:text-white',
          isChild && 'pl-10',
          hasArrow && 'cursor-pointer'
        )
      }
      onClick={(e) => {
        if (hasArrow && onToggle) {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {hasArrow && (
        <svg
          className={cn(
            'w-4 h-4 transition-transform',
            isExpanded ? 'rotate-90' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </NavLink>
  );
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedFloors, setExpandedFloors] = useState({});
  const [expandedHalls, setExpandedHalls] = useState({});
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchFloors = async () => {
      try {
        const response = await fetch('https://etrack-backend.onrender.com/floor/getAllFloors', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        console.log('Sidebar API Response:', data);
        if (response.ok) {
          const mappedFloors = data.map(floor => ({
            id: parseInt(floor.floorName.match(/\d+/)[0]),
            name: floor.floorName,
            halls: (floor.wings || []).map((wing, wingIndex) => ({
              id: wingIndex.toString(),
              name: wing.wingName,
              rooms: (wing.rooms || []).map((room, roomIndex) => ({
                id: roomIndex.toString(),
                name: room.roomName,
                properties: (room.devices || []).flatMap(device => 
                  Array(device.count || 1).fill().map(() => ({
                    id: `${device.deviceName}-${Math.random().toString(36).substring(2, 11)}`,
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
          console.log('Sidebar Mapped Floors:', mappedFloors);
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

  const toggleFloor = (floorId) => {
    setExpandedFloors((prev) => ({ ...prev, [floorId]: !prev[floorId] }));
  };

  const toggleHall = (floorId, hallId) => {
    const key = `${floorId}-${hallId}`;
    setExpandedHalls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[40] lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[50] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'lg:static lg:block lg:h-screen lg:z-[30]',
          'overflow-y-auto'
        )}
      >
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-2 space-y-1">
            <NavItem to="/" icon={<Gauge className="h-5 w-5" />} label="Dashboard" end />
            <NavItem to="/inventory" icon={<LampDesk className="h-5 w-5" />} label="Inventory" />
            <NavItem to="/map" icon={<Map className="h-5 w-5" />} label="Building Map" />
            <NavItem to="/reports" icon={<FileText className="h-5 w-5" />} label="Reports" />

            <div className="pt-4 pb-2">
              <div className="flex items-center px-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Building
                </h3>
              </div>
            </div>

            {floors.length === 0 ? (
              <div className="px-4 text-sm text-gray-500 dark:text-gray-400">Loading floors...</div>
            ) : (
              floors.map((floor) => (
                <React.Fragment key={floor.id}>
                  <NavItem
                    to={`/floors/${floor.id}`}
                    icon={<Building2 className="h-5 w-5" />}
                    label={floor.name}
                    hasArrow
                    isExpanded={expandedFloors[floor.id]}
                    onToggle={() => toggleFloor(floor.id)}
                  />
                  {expandedFloors[floor.id] && (
                    <div className="mt-1 space-y-1 animate-slide-in">
                      {floor.halls.map((hall) => (
                        <React.Fragment key={hall.id}>
                          <NavItem
                            to={`/floors/${floor.id}/halls/${hall.id}`}
                            icon={<Layers className="h-4 w-4" />}
                            label={hall.name}
                            isChild
                            hasArrow
                            isExpanded={expandedHalls[`${floor.id}-${hall.id}`]}
                            onToggle={() => toggleHall(floor.id, hall.id)}
                          />
                          {expandedHalls[`${floor.id}-${hall.id}`] && (
                            <div className="mt-1 space-y-1 animate-slide-in">
                              {hall.rooms.map((room) => (
                                <NavItem
                                  key={room.id}
                                  to={`/floors/${floor.id}/halls/${hall.id}/rooms/${room.id}`}
                                  icon={<div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />}
                                  label={room.name}
                                  isChild
                                />
                              ))}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))
            )}

            <div className="pt-4 pb-2">
              <div className="flex items-center px-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin
                </h3>
              </div>
            </div>
            <NavItem
              to="/admin-details"
              icon={<LampDesk className="h-5 w-5" />}
              label="Admin Details"
            />
          </nav>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Etrack v0.1.0
          </div>
        </div>
      </div>
    </>
  );
};