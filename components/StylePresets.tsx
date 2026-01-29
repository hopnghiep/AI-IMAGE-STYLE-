
import React, { useState } from 'react';
import type { Preset, ArtStyle } from '../types';

interface StylePresetsProps {
  presets: Preset[];
  onSave: (name: string) => void;
  onApply: (preset: Preset) => void;
  onDelete: (id: string) => void;
  isSaveEnabled: boolean;
  styles: ArtStyle[];
  language?: 'vi' | 'en';
}

const StylePresets: React.FC<StylePresetsProps> = ({
  presets,
  onSave,
  onApply,
  onDelete,
  isSaveEnabled,
  styles,
  language = 'vi'
}) => {
  const [presetName, setPresetName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSaveClick = () => {
    if (presetName.trim() && isSaveEnabled) {
      onSave(presetName.trim());
      setPresetName('');
    }
  };
  
  const isSaveButtonDisabled = !presetName.trim() || !isSaveEnabled;

  return (
    <div className="animate-fade-in">
       <div 
        className="flex justify-between items-center cursor-pointer mb-4 select-none group"
        onClick={() => setIsExpanded(!isExpanded)}
        >
        <h2 className="text-xl font-bold text-[#4A6B5D] uppercase tracking-wide group-hover:opacity-80 transition-opacity">
            {language === 'vi' ? '3. Cài đặt trước' : '3. Presets'}
        </h2>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="mt-2 animate-fade-in space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder={language === 'vi' ? "Nhập tên cài đặt trước..." : "Enter preset name..."}
              className="flex-grow bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] transition-all outline-none"
              aria-label="Preset name"
            />
            <button
              onClick={handleSaveClick}
              disabled={isSaveButtonDisabled}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 shadow-sm
                ${isSaveButtonDisabled
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                  : 'bg-[#4A6B5D]/20 text-[#4A6B5D] hover:bg-[#4A6B5D] hover:text-white border border-[#4A6B5D]/30'
                }`}
            >
              {language === 'vi' ? 'Lưu' : 'Save'}
            </button>
          </div>

          {presets.length > 0 && (
            <div className="flex gap-2 h-56">
                <div className="flex-grow overflow-y-auto pr-1 space-y-3 preset-scrollbar">
                    {presets.map((preset) => (
                        <div
                        key={preset.id}
                        className="group flex items-center justify-between py-1 transition-all"
                        >
                            <span className="text-sm font-medium text-gray-500 truncate pr-2">{preset.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                onClick={() => onApply(preset)}
                                className="px-5 py-1 text-sm font-bold rounded-full bg-[#bbf7d0] text-[#2d4d41] hover:bg-[#a8eec2] transition-colors shadow-sm"
                                >
                                {language === 'vi' ? 'Áp dụng' : 'Apply'}
                                </button>
                                {preset.id.startsWith('preset_') && (
                                    <button
                                    onClick={() => onDelete(preset.id)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StylePresets;
