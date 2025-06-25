// import React from "react";

export const DashboardSkeleton = () => {
  console.log('Rendering DashboardSkeleton');
  return (
    <div className="space-y-6 p-3 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-64 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${
              i >= 4 ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600' : ''
            } ${i === 0 ? 'col-span-2' : ''}`}
          >
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* StatusChart Placeholder (Pie Chart) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-80">
          <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-[calc(100%-2rem)] flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </div>

        {/* PropertyTypeChart Placeholder (Bar Graph) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-80">
          <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-[calc(100%-2rem)] flex items-end justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-12 bg-gray-200 dark:bg-gray-700 rounded-t"
                style={{ height: `${100 + i * 20}px` }}
              >
                <div className="w-full h-1/2 bg-gray-300 dark:bg-gray-600 rounded-t"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;