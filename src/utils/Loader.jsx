import React from "react";

function WifiLoader({ className = "" }) {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative w-16 h-12 flex items-end justify-center space-x-0.5">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={`block-${index}`}
              className={
                `w-2 bg-gradient-to-t from-green-500 to-blue-400 rounded-t animate-float ` +
                (index === 0 || index === 4 ? 'h-4 ' : '') +
                (index === 1 || index === 3 ? 'h-6 ' : '') +
                (index === 2 ? 'h-8 ' : '')
              }
              style={{
                animationDelay: `${index * 0.2}s`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-col items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Loading floor data...
          </p>
        </div>
      </div>
    </>
  );
}

export default WifiLoader;