
import React from 'react';

interface StyleSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const StyleSearch: React.FC<StyleSearchProps> = ({ value, onChange, disabled }) => {
  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Search styles..."
        className="w-full bg-white/50 border-2 border-gray-300 rounded-lg py-2 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] transition-colors duration-300 shadow-sm"
        aria-label="Search art styles"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label="Clear search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default StyleSearch;
