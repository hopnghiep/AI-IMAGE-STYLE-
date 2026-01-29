
import React, { useState, useEffect } from 'react';
import type { ArtStyle } from '../types';

interface EditStyleModalProps {
  style: ArtStyle;
  onClose: () => void;
  onSave: (styleId: string, name: string, prompt: string) => void;
  language?: 'vi' | 'en';
}

const EditStyleModal: React.FC<EditStyleModalProps> = ({ style, onClose, onSave, language = 'vi' }) => {
  const [name, setName] = useState(language === 'vi' ? (style.label_vi || style.label) : style.label);
  const [prompt, setPrompt] = useState(language === 'vi' ? (style.prompt_vi || style.prompt) : style.prompt);

  const handleSave = () => {
    onSave(style.id, name.trim(), prompt.trim());
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#f8f5f2] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-[#4A6B5D] uppercase tracking-tight">
              {language === 'vi' ? 'Chỉnh sửa phong cách' : 'Edit Style'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
              {language === 'vi' ? 'Tên phong cách' : 'Style Name'}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
              {language === 'vi' ? 'Mô tả phong cách' : 'Style Description'}
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-grow py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
          </button>
          <button 
            onClick={handleSave}
            className="flex-grow py-3 text-sm font-bold text-white bg-[#4A6B5D] hover:bg-[#3e5a4e] rounded-xl shadow-lg shadow-[#4A6B5D]/20 transition-all"
          >
            {language === 'vi' ? 'Cập nhật' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStyleModal;
