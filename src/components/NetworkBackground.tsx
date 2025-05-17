
import React from 'react';

const NetworkBackground: React.FC = () => {
  return (
    <div className="network-bg">
      <svg 
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="grid" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="#8c0862" 
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
          
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ffad1d" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8c0862" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        
        {/* Main background */}
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connection lines */}
        <g className="connection-lines">
          <path 
            d="M 100,200 C 200,100 300,300 400,200" 
            stroke="#ffad1d" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.2"
            strokeDasharray="5,5"
            className="animate-flow"
          />
          <path 
            d="M 500,300 C 400,200 300,400 200,300" 
            stroke="#8c0862" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.2"
            strokeDasharray="5,5"
            className="animate-flow"
          />
          <path 
            d="M 150,400 C 250,300 350,500 450,400" 
            stroke="#ffad1d" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.2"
            strokeDasharray="5,5"
            className="animate-flow"
          />
        </g>
        
        {/* Nodes */}
        <g className="nodes">
          <circle cx="100" cy="200" r="8" fill="url(#nodeGradient)" className="animate-pulse-slow" />
          <circle cx="400" cy="200" r="8" fill="url(#nodeGradient)" className="animate-pulse-slow" />
          <circle cx="200" cy="300" r="8" fill="url(#nodeGradient)" className="animate-pulse-slow" />
          <circle cx="500" cy="300" r="8" fill="url(#nodeGradient)" className="animate-pulse-slow" />
          <circle cx="150" cy="400" r="8" fill="url(#nodeGradient)" className="animate-pulse-slow" />
          <circle cx="450" cy="400" r="8" fill="url(#nodeGradient)" className="animate-pulse-slow" />
        </g>
        
        {/* Large circles representing microservice zones */}
        <circle cx="250" cy="250" r="150" fill="none" stroke="#ffad1d" strokeWidth="1" opacity="0.05" />
        <circle cx="400" cy="350" r="120" fill="none" stroke="#8c0862" strokeWidth="1" opacity="0.05" />
      </svg>
    </div>
  );
};

export default NetworkBackground;
