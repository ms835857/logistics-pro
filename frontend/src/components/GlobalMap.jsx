import React from 'react';
import { motion } from 'framer-motion';

const GlobalMap = () => {
  return (
    <div className="relative w-full h-[400px] bg-slate-900/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
      <svg
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-60"
      >
        {/* Simplified abstract world map dots */}
        <g fill="#475569">
            <circle cx="200" cy="150" r="2" />
            <circle cx="220" cy="160" r="2" />
            <circle cx="180" cy="180" r="2" />
            <circle cx="250" cy="140" r="2" />
            
            <circle cx="400" cy="120" r="2" />
            <circle cx="420" cy="130" r="2" />
            <circle cx="380" cy="110" r="2" />
            
            <circle cx="600" cy="160" r="2" />
            <circle cx="620" cy="180" r="2" />
            <circle cx="580" cy="190" r="2" />
            
            <circle cx="500" cy="250" r="2" />
            <circle cx="520" cy="270" r="2" />
            
            <circle cx="300" cy="280" r="2" />
            <circle cx="280" cy="300" r="2" />
        </g>

        {/* Animated Paths representing active shipments */}
        {/* USA to Europe */}
        <motion.path
          d="M 220 160 Q 300 100 400 120"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Europe to Asia */}
        <motion.path
          d="M 400 120 Q 500 100 600 160"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Asia to Australia */}
        <motion.path
          d="M 600 160 Q 550 200 500 250"
          stroke="url(#gradient3)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
         {/* South America to USA */}
         <motion.path
          d="M 280 300 Q 200 250 220 160"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Glowing Nodes at locations */}
        <motion.circle cx="220" cy="160" r="4" fill="#3b82f6" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="400" cy="120" r="4" fill="#8b5cf6" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
        <motion.circle cx="600" cy="160" r="4" fill="#10b981" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <motion.circle cx="500" cy="250" r="4" fill="#f59e0b" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.8, repeat: Infinity }} />
        <motion.circle cx="280" cy="300" r="4" fill="#ef4444" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }} />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-lg font-bold text-white flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
            Live Global Operations
        </h3>
        <p className="text-xs text-muted">Tracking 142 active shipments across 5 regions</p>
      </div>
    </div>
  );
};

export default GlobalMap;
