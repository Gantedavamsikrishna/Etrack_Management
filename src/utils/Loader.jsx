import React from 'react';

function WifiLoader({ className = '' }) {
  return (
    <div className={`relative w-20 h-20 flex items-center justify-center ${className}`}>
      <div
        className="absolute rounded-full border-t-2 border-blue-400 w-16 h-16 animate-ping"
        style={{ animationDelay: '0s' }}
      ></div>
      <div
        className="absolute rounded-full border-t-2 border-blue-400 w-12 h-12 animate-ping"
        style={{ animationDelay: '0.3s' }}
      ></div>
      <div
        className="absolute rounded-full border-t-2 border-blue-400 w-8 h-8 animate-ping"
        style={{ animationDelay: '0.6s' }}
      ></div>
      <div className="w-2 h-2 bg-blue-400 rounded-full z-10"></div>
    </div>
  );
}

export default WifiLoader;
