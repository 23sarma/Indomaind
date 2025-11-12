import React from 'react';

const IndomindLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff9933', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#138808', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#000080', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path 
        d="M50 10 L90 50 L50 90 L10 50 Z" 
        fill="none" 
        stroke="url(#grad2)" 
        strokeWidth="5"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="25" 
        fill="none" 
        stroke="url(#grad1)" 
        strokeWidth="5"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="5" 
        fill="#ffffff"
      />
    </svg>
  );
};

export default IndomindLogo;
