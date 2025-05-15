
import React from 'react';

const WheelPointer: React.FC = () => {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-yellow-500"></div>
    </div>
  );
};

export default WheelPointer;
