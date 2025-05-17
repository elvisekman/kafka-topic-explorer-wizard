
import React from 'react';

const KafkaHeader = () => {
  return (
    <header className="w-full bg-kafka py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-8 h-8 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" 
                fill="currentColor"
              />
            </svg>
            <h1 className="text-xl font-bold text-white">Kafka Topic Explorer</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default KafkaHeader;
