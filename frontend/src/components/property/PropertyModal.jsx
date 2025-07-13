import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Monitor, Keyboard, Mouse, Fan, Lightbulb, Wifi, AirVent } from 'lucide-react';
import { cn } from '../../utils/cn';

const propertyIcons = {
  monitor: <Monitor className="h-8 w-8" />,
  keyboard: <Keyboard className="h-8 w-8" />,
  mouse: <Mouse className="h-8 w-8" />,
  fan: <Fan className="h-8 w-8" />,
  light: <Lightbulb className="h-8 w-8" />,
  router: <Wifi className="h-8 w-8" />,
  ac: <AirVent className="h-8 w-8" />,
};

export const PropertyModal = ({ property, onClose, onEdit, enableEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: property.status || 'working',
    notes: property.notes || '',
  });

  const formatType = (type) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit({ ...property, ...formData });
    setIsEditing(false);
  };

  return (
    <>
      {enableEdit && (
        <style>
          {`
            .field-container {
              transition: all 0.3s ease-in-out;
            }
            .field-container select,
            .field-container textarea,
            .field-container div,
            .field-container p {
              transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            .field-container select,
            .field-container textarea {
              opacity: ${isEditing ? 1 : 0};
              transform: ${isEditing ? 'translateY(0)' : 'translateY(10px)'};
            }
            .field-container div,
            .field-container p {
    opacity: ${isEditing ? 0 : 1};
    transform: ${isEditing ? 'translateY(-10px)' : 'translateY(0)'};
    position: ${isEditing ? 'absolute' : 'static'};
  }
}
      `}
    </style>
  )}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fade-in">
        <div 
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Property Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className={cn("p-4", !enableEdit && "pb-2")}>
            <div className="flex items-center mb-4">
              <div className={cn(
                "p-3 rounded-full mr-3",
                property.status === 'working' 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                  : 'bg-error-100 dark:bg-error-900 text-error-600 dark:text-error-400'
              )}>
                {propertyIcons[property.type]}
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  {formatType(property.type)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {property.brand} {property.model}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={cn(enableEdit && "field-container")}>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </h4>
                {enableEdit && isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="border rounded p-1 w-28 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="working">Working</option>
                    <option value="not-working">Not Working</option>
                  </select>
                ) : (
                  <div className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-28",
                    property.status === 'working' 
                      ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300' 
                      : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300'
                  )}>
                    {property.status === 'working' ? 'Working' : 'Not Working'}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Brand
                </h4>
                <p className="text-sm text-gray-900 dark:text-white">{property.brand}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Model
                </h4>
                <p className="text-sm text-gray-900 dark:text-white">{property.model}</p>
              </div>
              
              {property.purchaseDate && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Purchase Date
                  </h4>
                  <p className="text-sm text-gray-900 dark:text-white">{property.purchaseDate}</p>
                </div>
              )}
              
              <div className={cn(enableEdit && "field-container", !enableEdit && "mb-0")}>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Notes
                </h4>
                {enableEdit && isEditing ? (
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="border rounded p-1 w-full h-16 dark:bg-gray-700 dark:text-white text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-900 dark:text-white w-full min-h-8 max-h-16 overflow-hidden">
                    {property.notes || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "border-t border-gray-200 dark:border-gray-700 flex",
            enableEdit ? "justify-between p-4" : "justify-end p-4 !pb-0"
          )}>
            {enableEdit && isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-sm py-1 px-3"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  className="hover:bg-primary-700 dark:hover:bg-primary-600 transform hover:scale-105 transition-all duration-300 ease-in-out text-sm py-1 px-3"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                {enableEdit && (
                  <Button 
                    variant="outline" 
                    onClick={handleEdit}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out text-sm py-1 px-3"
                  >
                    Edit
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-sm py-1 px-3 mb-2"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}