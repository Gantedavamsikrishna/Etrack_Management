import React, { useState } from 'react';
import { Building2, Gauge, LampDesk, Layers, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { buildingData } from '../../data/mockData';

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
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
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
            "w-4 h-4 transition-transform",
            isExpanded ? "transform rotate-90" : ""
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </NavLink>
  );
};

export const Sidebar = ({ isOpen }) => {
  const [expandedFloors, setExpandedFloors] = useState({});
  const [expandedHalls, setExpandedHalls] = useState({});

  const toggleFloor = (floorId) => {
    setExpandedFloors((prev) => ({
      ...prev,
      [floorId]: !prev[floorId],
    }));
  };

  const toggleHall = (floorId, hallId) => {
    const key = `${floorId}-${hallId}`;
    setExpandedHalls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-9 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 pt-16 flex flex-col transition-transform duration-300 ease-in-out transform',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 px-2 space-y-1">
          <NavItem to="/" icon={<Gauge className="h-5 w-5" />} label="Dashboard" end />
          <NavItem to="/inventory" icon={<LampDesk className="h-5 w-5" />} label="Inventory" />
          <NavItem to="/map" icon={<Map className="h-5 w-5" />} label="Building Map" />

          <div className="pt-4 pb-2">
            <div className="flex items-center px-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Building
              </h3>
            </div>
          </div>
          
          {buildingData.floors.map((floor) => (
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
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Etrack v0.1.0
        </div>
      </div>
    </div>
  );
};
