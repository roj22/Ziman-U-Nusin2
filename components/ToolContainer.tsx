
import React from 'react';

interface ToolContainerProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ title, onBack, children }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-teal-400">{title}</h2>
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
          </svg>
          <span>گەڕانەوە</span>
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ToolContainer;
