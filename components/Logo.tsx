'use client';
import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "", width = 200, height = 48 }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 200 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.5 7C19.4036 7 25 12.5964 25 19.5C25 26.4036 19.4036 32 12.5 32C5.59644 32 0 26.4036 0 19.5C0 12.5964 5.59644 7 12.5 7Z" fill="#ff9c27"/>
        <path d="M8 20L12 24L17 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M36 15H40L43 29H45L48 15H52L47 35H41L36 15Z" fill="black"/>
        <path d="M55 15H59V35H55V15Z" fill="black"/>
        <path d="M64 15H68L78 29V15H82V35H78L68 21V35H64V15Z" fill="black"/>
        <path d="M85 15H96V19H89V23H95V27H89V31H96V35H85V15Z" fill="black"/>
        <path d="M100 15H104L107 29H109L112 15H116L111 35H105L100 15Z" fill="#ff9c27"/>
        <path d="M121 27V23H127C128.105 23 129 23.8954 129 25C129 26.1046 128.105 27 127 27H121ZM121 15H127C128.105 15 129 15.8954 129 17C129 18.1046 128.105 19 127 19H121V15ZM117 15V35H127C130.866 35 134 31.866 134 28V27C134 25.4087 133.368 23.9338 132.293 22.8579C133.368 21.7821 134 20.3069 134 18.7156V17C134 14.2386 131.761 12 129 12H117V15Z" fill="#ff9c27"/>
        <path d="M138 15H149V19H142V23H148V27H142V31H149V35H138V15Z" fill="black"/>
        
        <ellipse cx="12.5" cy="19.5" rx="17.5" ry="17.5" stroke="black" strokeWidth="1" fill="none"/>
        <ellipse cx="12.5" cy="19.5" rx="15" ry="5" stroke="black" strokeWidth="1" fill="none" transform="rotate(-15 12.5 19.5)"/>
      </svg>
    </div>
  );
} 