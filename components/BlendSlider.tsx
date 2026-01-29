import React from 'react';
import type { ArtStyle } from '../types';

interface BlendSliderProps {
  blendStyleA: ArtStyle;
  blendStyleB: ArtStyle;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const BlendSlider: React.FC<BlendSliderProps> = ({ blendStyleA, blendStyleB, value, onChange, disabled = false }) => {
  return (
    <div className={`mt-6 animate-fade-in ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-normal mb-3 text-gray-700">Blend Influence</h3>
      <div className="flex justify-between items-center gap-2">
        {/* Style A Thumbnail */}
        <div className="flex-shrink-0 text-center">
            <img src={blendStyleA.thumbnail} alt={blendStyleA.label} className="w-12 h-12 object-cover rounded-md border-2 border-blue-500" />
            <p className="text-xs mt-1 text-blue-600 font-semibold">Style A</p>
        </div>
        
        {/* Slider */}
        <div className="flex-grow">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              disabled={disabled}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer range-lg
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:h-5
                         [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-[#A98768]
                         [&::-moz-range-thumb]:h-5
                         [&::-moz-range-thumb]:w-5
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:bg-[#A98768]"
              aria-label="Style blend ratio"
            />
            <div className="text-center mt-2 font-normal text-sm text-[#A98768]">
                {100 - value}% A / {value}% B
            </div>
        </div>

        {/* Style B Thumbnail */}
        <div className="flex-shrink-0 text-center">
            <img src={blendStyleB.thumbnail} alt={blendStyleB.label} className="w-12 h-12 object-cover rounded-md border-2 border-purple-500" />
            <p className="text-xs mt-1 text-purple-600 font-semibold">Style B</p>
        </div>
      </div>
    </div>
  );
};

export default BlendSlider;