import React from 'react';

export default function SudarshanLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Blazing Sun Supernova Aura Glow */}
      <div className={`absolute inset-0 ${dim} rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 blur-lg opacity-85 animate-pulse`} />
      
      {/* Ultra-Realistic 3D Divine Sudarshan Chakra Vector SVG Symbol */}
      <svg 
        className={`relative ${dim} transform hover:scale-110 transition-transform duration-300 animate-spin-slow drop-shadow-[0_0_20px_rgba(245,158,11,1)]`} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="goldBlade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <radialGradient id="sunCoreOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#3B82F6" />
          </radialGradient>
        </defs>

        {/* 36 Razor-Sharp Serrated Plasma Blades */}
        <g stroke="#FFFFFF" strokeWidth="0.8">
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 360) / 36;
            return (
              <path
                key={i}
                d="M 50 8 C 54 2, 57 5, 59 10 C 56 12, 53 13, 50 8 Z"
                fill="url(#goldBlade)"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </g>

        {/* Solid Metallic Outer Golden Ring */}
        <circle cx="50" cy="50" r="38" stroke="url(#goldRing)" strokeWidth="3" fill="none" />
        <circle cx="50" cy="50" r="34" stroke="#FFF59D" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />

        {/* 16 Inner Lotus Diamond Spokes */}
        <g stroke="url(#goldRing)" strokeWidth="2">
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="16"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </g>

        {/* Inner Mandala Rings */}
        <circle cx="50" cy="50" r="22" stroke="url(#goldBlade)" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="15" stroke="#60A5FA" strokeWidth="1.5" fill="none" />

        {/* White-Hot Sun Supernova Core Orb */}
        <circle cx="50" cy="50" r="10" fill="url(#sunCoreOrb)" />
      </svg>
    </div>
  );
}
