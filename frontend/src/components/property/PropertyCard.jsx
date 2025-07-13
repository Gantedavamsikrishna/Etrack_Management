import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Monitor, Keyboard, Mouse, Fan, Lightbulb, Wifi, AirVent
} from 'lucide-react';
import { cn } from '../../utils/cn';

// Map property types to icons
const propertyIcons = {
  monitor: <Monitor className="h-5 w-5" />,
  keyboard: <Keyboard className="h-5 w-5" />,
  mouse: <Mouse className="h-5 w-5" />,
  fan: <Fan className="h-5 w-5" />,
  light: <Lightbulb className="h-5 w-5" />,
  router: <Wifi className="h-5 w-5" />,
  ac: <AirVent className="h-5 w-5" />,
};

export const PropertyCard = ({ property, onClick }) => {
  const { type, brand, model, status } = property;
  
  // Format type for display
  const formatType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className={cn(
            "p-3 rounded-lg mr-4",
            status === 'working' ? 'bg-primary-100 dark:bg-primary-900' : 'bg-error-100 dark:bg-error-900'
          )}>
            {propertyIcons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {formatType(type)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {brand} {model}
            </p>
          </div>
          
          <Badge 
            variant={status === 'working' ? 'success' : 'error'}
            className="ml-2"
          >
            {status === 'working' ? 'Working' : 'Not Working'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
