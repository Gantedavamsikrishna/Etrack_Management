
import React from 'react';

export const BuildingMapSkeleton = () => {
  return (
    <div className="space-y-4 p-3 sm:p-3 max-w-7xl mx-auto animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left (Structure) */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 space-y-4">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />

          {/* Floor buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>

          {/* Floor card (center hall) */}
          <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 mx-auto rounded" />
            <div className="flex flex-wrap justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-24 h-16 bg-gray-200 dark:bg-gray-600 rounded" />
              ))}
            </div>
          </div>

          {/* Wings */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 max-w-md bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2"
              >
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 mx-auto rounded" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (Stats + Health) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 space-y-4">
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 mb-1 rounded" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>

          {/* Health */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 space-y-3">
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};