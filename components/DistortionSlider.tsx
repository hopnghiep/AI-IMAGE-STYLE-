import React from 'react';

interface DistortionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const DistortionSlider: React.FC<DistortionSliderProps> = ({ value, onChange, disabled = false }) => {
  const getDistortionLabel = (val: number) => {
    if (val < 33) return 'Slight';
    if (val > 66) return 'Extreme';
    return 'Moderate';
  };

  return (
    <div className={`mt-6 animate-fade-in ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-normal mb-3 text-gray-700">Caricature Exaggeration</h3>
      <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
        <span>Slight</span>
        <span>Extreme</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[#A98768]
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-[#A98768]"
        aria-label="Caricature exaggeration amount"
      />
      <div className="text-center mt-2 font-normal text-[#A98768]">
        {getDistortionLabel(value)} ({value}%)
      </div>
    </div>
  );
};

export default DistortionSlider;
