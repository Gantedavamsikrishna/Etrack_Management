import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300',
    error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300',
    outline: 'bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
