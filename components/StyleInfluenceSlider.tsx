
import React from 'react';

interface StyleInfluenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  language?: 'vi' | 'en';
}

const StyleInfluenceSlider: React.FC<StyleInfluenceSliderProps> = ({ value, onChange, disabled = false, language = 'vi' }) => {
  const getInfluenceLabel = (val: number) => {
    if (val < 40) return language === 'vi' ? 'Nhẹ nhàng' : 'Subtle';
    if (val > 90) return language === 'vi' ? 'Mạnh mẽ' : 'Strong';
    return language === 'vi' ? 'Cân bằng' : 'Balanced';
  };

  return (
    <div className={`mt-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-500">
        <span>{language === 'vi' ? 'Subtle' : 'Subtle'}</span>
        <span>{language === 'vi' ? 'Strong' : 'Strong'}</span>
      </div>
      <div className="relative flex items-center h-6">
        <input
          type="range"
          min="20"
          max="100"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          disabled={disabled}
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-[#4A6B5D]
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-[#4A6B5D]
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white"
        />
      </div>
      <div className="text-center mt-3 font-bold text-sm text-[#4A6B5D]">
        {getInfluenceLabel(value)} ({value}%)
      </div>
    </div>
  );
};

export default StyleInfluenceSlider;
