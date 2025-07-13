import React from 'react';
import { 
  Building2, 
  Layers, 
  DoorOpen, 
  Activity,
  LampDesk,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { StatusChart } from '../components/charts/StatusChart';
import { PropertyTypeChart } from '../components/charts/PropertyTypeChart.jsx';
import { buildingData } from '../data/mockData';
import { PropertyType } from '../types';

export const Dashboard = () => {
  // Calculate summary statistics
  const totalFloors = buildingData.floors.length;
  const totalHalls = buildingData.floors.reduce((acc, floor) => acc + floor.halls.length, 0);
  const totalRooms = buildingData.floors.reduce(
    (acc, floor) => acc + floor.halls.reduce(
      (hallAcc, hall) => hallAcc + hall.rooms.length, 0
    ), 0
  );

  // Get all properties
  const allProperties = buildingData.floors.flatMap(floor => 
    floor.halls.flatMap(hall => 
      hall.rooms.flatMap(room => 
        room.properties
      )
    )
  );

  const totalProperties = allProperties.length;
  
  const workingProperties = allProperties.filter(p => p.status === 'working').length;
  const notWorkingProperties = allProperties.filter(p => p.status === 'not_working').length;
  
  // Count properties by type
  const propertyTypeCounts = Object.values(PropertyType).reduce((acc, type) => {
    acc[type] = allProperties.filter(p => p.type === type).length;
    return acc;
  }, {});
  
  // Find type with most issues
  const typesWithIssues = Object.values(PropertyType).map(type => {
    const props = allProperties.filter(p => p.type === type);
    const total = props.length;
    const notWorking = props.filter(p => p.status === 'not_working').length;
    const percentage = total > 0 ? (notWorking / total) * 100 : 0;
    
    return {
      type,
      notWorking,
      total,
      percentage
    };
  }).sort((a, b) => b.percentage - b.percentage);
  
  const mostProblematicType = typesWithIssues[0];
  
  // Format for display
  const formatType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of building properties and equipment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="col-span-2">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
              <LampDesk className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalProperties}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalFloors}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Halls</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalHalls}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400">
              <DoorOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rooms</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalRooms}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-white dark:bg-gray-800 text-success-600 dark:text-success-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Working</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {workingProperties} 
                <span className="text-sm ml-1 font-normal text-gray-500">
                  ({totalProperties > 0 ? Math.round((workingProperties / totalProperties) * 100) : 0}%)
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-error-50 to-error-100 dark:from-error-900 dark:to-error-800">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 p-3 rounded-lg bg-white dark:bg-gray-800 text-error-600 dark:text-error-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Not Working</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {notWorkingProperties}
                <span className="text-sm ml-1 font-normal text-gray-500">
                  ({totalProperties > 0 ? Math.round((notWorkingProperties / totalProperties) * 100) : 0}%)
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Status Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <StatusChart properties={allProperties} />
        </div>
        
        <div className="lg:col-span-7">
          <PropertyTypeChart properties={allProperties} />
        </div>
      </div>

      {/* Property Type Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(propertyTypeCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 4)
          .map(([type, count]) => {
            const working = allProperties.filter(
              (p) => p.type === type && p.status === 'working'
            ).length;
            const percentage = count > 0 ? Math.round((working / count) * 100) : 0;
            
            return (
              <Card key={type}>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatType(type)}</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{working}</p>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {working} working ({percentage}%)
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Issues Highlight */}
      {mostProblematicType && mostProblematicType.notWorking > 0 && (
        <Card className="border-l-4 border-warning-500">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400 mr-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attention Required</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{formatType(mostProblematicType.type)}</span> has the highest percentage of non-working items 
                  ({Math.round(mostProblematicType.percentage)}% - {mostProblematicType.notWorking} out of {mostProblematicType.total}).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};