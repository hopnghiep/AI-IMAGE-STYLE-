
import React from 'react';

interface HeaderProps {
  language: 'vi' | 'en';
  onLanguageChange: (lang: 'vi' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="bg-[#4A6B5D] p-2.5 rounded-xl shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </div>
            <div>
                <h1 className="text-2xl font-black text-[#423a3a] tracking-tight uppercase">
                    {language === 'vi' ? 'CHUYỂN ĐỔI PHONG CÁCH AI' : 'AI STYLE CONVERTER'}
                </h1>
                <p className="text-sm font-semibold text-gray-500">
                    {language === 'vi' ? 'Biến hóa hình ảnh của bạn với sức mạnh trí tuệ nhân tạo' : 'Transform your images with the power of artificial intelligence'}
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
                onClick={() => onLanguageChange('vi')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${language === 'vi' ? 'bg-[#4A6B5D] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            >
                VI
            </button>
            <button 
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${language === 'en' ? 'bg-[#4A6B5D] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            >
                EN
            </button>
        </div>
      </div>
    </header>
  );
};
