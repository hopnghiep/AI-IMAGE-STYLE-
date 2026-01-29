
import React from 'react';

interface AspectRatio {
  value: string;
  label: string;
}

const RATIOS: AspectRatio[] = [
  { value: 'auto', label: 'Auto' },
  { value: '1:1', label: 'Square' },
  { value: '4:3', label: 'Landscape' },
  { value: '3:4', label: 'Portrait' },
  { value: '16:9', label: 'Wide' },
  { value: '9:16', label: 'Tall' },
];

const RatioIcon = ({ ratio }: { ratio: string }) => {
    switch (ratio) {
        case '1:1': return <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>;
        case '4:3': return <div className="w-5 h-[15px] bg-gray-400 rounded-sm"></div>;
        case '3:4': return <div className="w-[15px] h-5 bg-gray-400 rounded-sm"></div>;
        case '16:9': return <div className="w-6 h-[14px] bg-gray-400 rounded-sm"></div>;
        case '9:16': return <div className="w-[14px] h-6 bg-gray-400 rounded-sm"></div>;
        default: return null;
    }
};


interface AspectRatioSelectorProps {
    selectedValue: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedValue, onChange, disabled = false }) => {
  return (
    <div className={`mt-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-lg font-normal mb-3 text-[#4A6B5D]">Tỉ lệ khung hình</h2>
      <div className="grid grid-cols-3 gap-2">
        {RATIOS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center text-center p-1.5 rounded-lg border transition-all duration-200
              ${selectedValue === value 
                ? 'bg-[#4A6B5D]/20 border-[#4A6B5D] text-[#423a3a]' 
                : 'bg-white border-gray-200 hover:border-gray-400 text-gray-600'
              }`
            }
            aria-pressed={selectedValue === value}
          >
            {value !== 'auto' && <div className="h-6 flex items-center justify-center mb-1"><RatioIcon ratio={value} /></div>}
            <span className="text-[10px] font-normal">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
