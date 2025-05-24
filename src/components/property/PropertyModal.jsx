 

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { X, Monitor, Keyboard, Mouse, Fan, Lightbulb, Wifi, AirVent } from 'lucide-react';
import { cn } from '../../utils/cn';

const propertyIcons = {

  monitor: <Monitor className="h-8 w-8" />,
  keyboard: <Keyboard className="h-8 w-8" />,
  mouse: <Mouse className="h-8 w-8" />,
  fan: <Fan className="h-8 w-8" />,
  light: <Lightbulb className="h-8 w-8" />,
  "wifi-router": <Wifi className="h-8 w-8" />,
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

  const modalContent = (
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
          `}
        </style>
      )}
      <div className="fixed inset-0 z-[1000] w-[100vw] h-[100vh] flex items-center justify-center bg-black/60 animate-fade-in">
        <div 
          className={cn(
            "relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-6",
            "shadow-lg shadow-black/10 dark:shadow-white/10",
            "bg-white/10 dark:bg-white/10 backdrop-blur-md",
            "border border-white/20 ring-1 ring-white/20",
            "text-white transition-colors duration-300",
            "max-h-[90vh] overflow-auto"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b border-white/20 pb-3">
            <h2 className="text-lg sm:text-xl font-semibold">
              Property Details
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-md p-1 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="pt-4 pb-2 sm:pb-4 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-start mb-4 sm:mb-6">
              <div className={cn(
                "p-3 sm:p-4 rounded-full mr-3 sm:mr-4",
                property.status === 'working' 
                  ? 'bg-primary-100/20 dark:bg-primary-900/20 text-primary-400' 
                  : 'bg-error-100/20 dark:bg-error-900/20 text-error-400'
              )}>
                {propertyIcons[property.type]}
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-medium">
                  {formatType(property.type)}
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  {property.brand} {property.model}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                    Brand
                  </h4>
                  <p className="text-sm sm:text-base">{property.brand}</p>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                    Model
                  </h4>
                  <p className="text-sm sm:text-base">{property.model}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {property.purchaseDate && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                      Purchase Date
                    </h4>
                    <p className="text-sm sm:text-base">{property.purchaseDate}</p>
                  </div>
                )}
                <div className={cn(enableEdit && "field-container")}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </h4>
                  {enableEdit && isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="border rounded p-1 w-32 dark:bg-gray-700 dark:text-white "
                    >
                      <option value="working">Working</option>
                      <option value="not-working">Not Working</option>
                    </select>
                  ) : (
                    <div className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-32",
                      property.status === 'working' 
                        ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300' 
                        : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300'
                    )}>
                      {property.status === 'working' ? 'Working' : 'Not Working'}
                    </div>
                  )}
                </div>
              </div>

              <div className={cn(enableEdit && "field-container")}>
                <h4 className="text-xs sm:text-sm font-medium text-white/80 mb-1">
                  Notes
                </h4>
                {enableEdit && isEditing ? (
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="border border-white/20 rounded p-2 w-full h-18 bg-white/10 dark:bg-gray-700/10 text-white text-sm focus:ring-2 focus:ring-primary-400"
                  />
                ) : (
                  <p className="text-sm sm:text-base min-h-10 max-h-20 overflow-auto">
                    {property.notes || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "border-t border-white/20 flex",
            enableEdit ? "justify-between pt-4 pb-2 sm:pb-4" : "justify-end pt-4 pb-2 sm:pb-4"
          )}>
            {enableEdit && isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-primary-500 hover:bg-primary-600 text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
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
                    className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                  >
                    Edit
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border-white/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
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

  return createPortal(modalContent, document.body);
};