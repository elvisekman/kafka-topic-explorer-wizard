
import React, { useEffect, useState } from 'react';

interface KaiMascotProps {
  animation: 'idle' | 'wiggle' | 'explain';
  isLoading?: boolean;
}

const KaiMascot: React.FC<KaiMascotProps> = ({ animation, isLoading = false }) => {
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  
  useEffect(() => {
    if (isLoading) {
      setCurrentAnimation('animate-kai-wiggle');
      return;
    }
    
    switch (animation) {
      case 'wiggle':
        setCurrentAnimation('animate-kai-wiggle');
        break;
      case 'explain':
        setCurrentAnimation('animate-kai-explain');
        break;
      default:
        setCurrentAnimation('animate-kai-idle');
    }
  }, [animation, isLoading]);
  
  return (
    <div className="flex flex-col items-center">
      <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#ffad1d] to-[#8c0862] ${currentAnimation} shadow-lg`}>
        {/* Mascot face */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Eyes */}
          <div className="absolute top-[30%] left-[25%] w-6 h-6 bg-black rounded-full"></div>
          <div className="absolute top-[30%] right-[25%] w-6 h-6 bg-black rounded-full"></div>
          
          {/* Mouth */}
          <div className="absolute bottom-[30%] w-16 h-8 bg-black rounded-full overflow-hidden">
            <div className="absolute bottom-0 w-full h-4 bg-white rounded-t-full"></div>
          </div>
        </div>
      </div>
      {isLoading && (
        <p className="mt-2 text-sm text-white/70">Processing your request...</p>
      )}
    </div>
  );
};

export default KaiMascot;
