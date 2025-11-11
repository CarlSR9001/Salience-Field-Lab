import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg flex flex-col h-full ${className}`}>
        {title && (
             <div className="p-3 border-b border-gray-800 bg-gray-950/30 flex items-center space-x-3 flex-shrink-0 rounded-t-lg">
                {icon}
                <h3 className="text-sm font-semibold text-gray-300 tracking-wide">{title}</h3>
            </div>
        )}
      <div className="p-4 flex-grow relative">
        {children}
      </div>
    </div>
  );
};

export default Card;
