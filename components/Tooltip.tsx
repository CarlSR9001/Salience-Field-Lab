import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
  return (
    <div className={`relative group flex items-center ${className}`}>
      {children}
      <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-950 border border-gray-700 text-gray-300 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
