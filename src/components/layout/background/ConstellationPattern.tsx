
import React from "react";

export const ConstellationPattern = () => {
  return (
    <div className="absolute inset-0">
      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <line x1="10%" y1="20%" x2="20%" y2="40%" stroke="white" strokeWidth="0.5" />
        <line x1="20%" y1="40%" x2="35%" y2="30%" stroke="white" strokeWidth="0.5" />
        <line x1="35%" y1="30%" x2="45%" y2="15%" stroke="white" strokeWidth="0.5" />
        
        <line x1="60%" y1="70%" x2="70%" y2="65%" stroke="white" strokeWidth="0.5" />
        <line x1="70%" y1="65%" x2="80%" y2="80%" stroke="white" strokeWidth="0.5" />
        <line x1="80%" y1="80%" x2="75%" y2="90%" stroke="white" strokeWidth="0.5" />
        
        <line x1="30%" y1="60%" x2="40%" y2="75%" stroke="white" strokeWidth="0.5" />
        <line x1="40%" y1="75%" x2="25%" y2="85%" stroke="white" strokeWidth="0.5" />
        
        <line x1="70%" y1="25%" x2="85%" y2="15%" stroke="white" strokeWidth="0.5" />
        <line x1="85%" y1="15%" x2="90%" y2="30%" stroke="white" strokeWidth="0.5" />
        
        {/* Constellation nodes */}
        <circle cx="10%" cy="20%" r="1" fill="white" opacity="0.7" />
        <circle cx="20%" cy="40%" r="1" fill="white" opacity="0.7" />
        <circle cx="35%" cy="30%" r="1" fill="white" opacity="0.7" />
        <circle cx="45%" cy="15%" r="2" fill="white" opacity="0.9" />
        
        <circle cx="60%" cy="70%" r="1" fill="white" opacity="0.7" />
        <circle cx="70%" cy="65%" r="1" fill="white" opacity="0.7" />
        <circle cx="80%" cy="80%" r="1" fill="white" opacity="0.7" />
        <circle cx="75%" cy="90%" r="1.5" fill="white" opacity="0.9" />
        
        <circle cx="30%" cy="60%" r="1" fill="white" opacity="0.7" />
        <circle cx="40%" cy="75%" r="1" fill="white" opacity="0.7" />
        <circle cx="25%" cy="85%" r="1.5" fill="white" opacity="0.9" />
        
        <circle cx="70%" cy="25%" r="1" fill="white" opacity="0.7" />
        <circle cx="85%" cy="15%" r="1" fill="white" opacity="0.7" />
        <circle cx="90%" cy="30%" r="2" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
};
