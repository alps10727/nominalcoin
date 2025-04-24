
import React from 'react';

const Background: React.FC = () => (
  <>
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full opacity-70 animate-twinkle"
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ))}
  </>
);

export default Background;
