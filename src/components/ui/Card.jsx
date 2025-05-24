import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  className,
  children,
  onClick,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        ' bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => {
  return (
    <div className={cn('p-4 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return <h3 className={cn('text-lg font-medium', className)}>{children}</h3>;
};

export const CardDescription = ({ className, children }) => {
  return <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)}>{children}</p>;
};

export const CardContent = ({ className, children }) => {
  return <div className={cn('p-4', className)}>{children}</div>;
};

export const CardFooter = ({ className, children }) => {
  return (
    <div className={cn('p-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};
