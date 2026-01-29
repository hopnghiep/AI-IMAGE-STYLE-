
import React from 'react';

interface ColorAdjustmentSlidersProps {
  vibrancy: number;
  onVibrancyChange: (value: number) => void;
  mood: number;
  onMoodChange: (value: number) => void;
  disabled?: boolean;
}

const ColorAdjustmentSliders: React.FC<ColorAdjustmentSlidersProps> = ({
  vibrancy,
  onVibrancyChange,
  mood,
  onMoodChange,
  disabled = false,
}) => {
  const getVibrancyLabel = (val: number) => {
    if (val > 25) return 'Vibrant';
    if (val < -25) return 'Muted';
    return 'Neutral';
  };

  const getMoodLabel = (val: number) => {
    if (val > 25) return 'Bright & Airy';
    if (val < -25) return 'Dark & Moody';
    return 'Balanced';
  };

  return (
    <div className={`mt-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-lg font-normal mb-4 text-[#4A6B5D]">Điều chỉnh màu sắc</h2>
      
      {/* Vibrancy Slider */}
      <div className="mb-4">
        <label htmlFor="vibrancy" className="block mb-1 text-xs font-normal text-gray-700">Độ rực rỡ</label>
        <div className="flex justify-between items-center mb-1 text-[10px] text-gray-400">
            <span>Muted</span>
            <span>Vibrant</span>
        </div>
        <input
            id="vibrancy"
            type="range"
            min="-50"
            max="50"
            step="1"
            value={vibrancy}
            onChange={(e) => onVibrancyChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-[#4A6B5D]
                       [&::-moz-range-thumb]:h-4
                       [&::-moz-range-thumb]:w-4
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-[#4A6B5D]"
        />
         <div className="text-center mt-1 text-[11px] font-normal text-[#4A6B5D]">
            {getVibrancyLabel(vibrancy)}
        </div>
      </div>

      {/* Mood Slider */}
      <div>
        <label htmlFor="mood" className="block mb-1 text-xs font-normal text-gray-700">Sắc thái / Mood</label>
        <div className="flex justify-between items-center mb-1 text-[10px] text-gray-400">
            <span>Tối & Kịch tính</span>
            <span>Sáng & Thoáng</span>
        </div>
        <input
            id="mood"
            type="range"
            min="-50"
            max="50"
            step="1"
            value={mood}
            onChange={(e) => onMoodChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-[#4A6B5D]
                       [&::-moz-range-thumb]:h-4
                       [&::-moz-range-thumb]:w-4
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-[#4A6B5D]"
        />
        <div className="text-center mt-1 text-[11px] font-normal text-[#4A6B5D]">
            {getMoodLabel(mood)}
        </div>
      </div>
    </div>
  );
};

export default ColorAdjustmentSliders;
