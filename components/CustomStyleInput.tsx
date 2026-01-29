
import React from 'react';

interface CustomStyleInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  language?: 'vi' | 'en';
  isModifierMode?: boolean;
  styleName?: string;
}

const CustomStyleInput: React.FC<CustomStyleInputProps> = ({ value, onChange, disabled = false, language = 'vi', isModifierMode = false, styleName }) => {
  const handleClear = () => {
    onChange('');
  };

  const placeholder = isModifierMode
    ? (language === 'vi' 
        ? "Mô tả thêm cho phong cách đang chọn (ví dụ: 'thêm mặt trời', 'màu sắc ấm hơn', 'nét vẽ dày hơn'...)" 
        : "Modify selected style (e.g., 'add a sunset', 'warmer colors', 'thicker brushstrokes'...)")
    : (language === 'vi' 
        ? "Mô tả phong cách hoặc hình ảnh bạn muốn tạo từ đầu..." 
        : "Describe a style or image you want to create from scratch...");

  return (
    <div className={`relative mt-4 animate-fade-in ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {isModifierMode && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="flex h-2 w-2 rounded-full bg-[#4A6B5D]"></span>
          <p className="text-[10px] font-black text-[#4A6B5D] uppercase tracking-widest">
            {language === 'vi' ? `Đang tinh chỉnh: ${styleName}` : `Refining Style: ${styleName}`}
          </p>
        </div>
      )}
      
      <div className={`relative rounded-xl transition-all duration-300 ${isModifierMode ? 'ring-2 ring-[#4A6B5D]/20' : ''}`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className={`w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-sm font-bold text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] outline-none transition-all duration-300 resize-none pr-10 shadow-sm ${isModifierMode ? 'bg-[#4A6B5D]/5' : ''}`}
            aria-label="Custom style prompt"
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Clear custom prompt"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
      </div>
      
      {!isModifierMode && !value && (
         <p className="mt-2 text-[10px] text-gray-400 italic px-1">
            {language === 'vi' ? '* Nhập mô tả để AI tạo phong cách riêng biệt của bạn.' : '* Enter a description for AI to create your unique style.'}
         </p>
      )}
    </div>
  );
};

export default CustomStyleInput;
