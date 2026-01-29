
import React, { useState } from 'react';
import type { StyleFolder } from '../types';

interface SaveStyleModalProps {
  onClose: () => void;
  onSave: (name: string, folderId: string | null) => void;
  folders: StyleFolder[];
  language?: 'vi' | 'en';
}

const SaveStyleModal: React.FC<SaveStyleModalProps> = ({ onClose, onSave, folders, language = 'vi' }) => {
  const [name, setName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleSave = () => {
    // Nếu không đặt tên, sử dụng tên mặc định dựa trên thời gian
    const finalName = name.trim() || (language === 'vi' ? `Phong cách mới ${new Date().toLocaleTimeString()}` : `New Style ${new Date().toLocaleTimeString()}`);
    onSave(finalName, selectedFolderId);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#f8f5f2] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-[#4A6B5D] uppercase tracking-tight">
              {language === 'vi' ? 'Lưu phong cách mới' : 'Save New Style'}
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
              placeholder={language === 'vi' ? "Nhập tên gợi nhớ..." : "Enter a descriptive name..."}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] outline-none transition-all"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
              {language === 'vi' ? 'Chọn thư mục lưu trữ' : 'Choose Storage Folder'}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              <button 
                onClick={() => setSelectedFolderId(null)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold ${selectedFolderId === null ? 'border-[#4A6B5D] bg-[#4A6B5D]/10 text-[#4A6B5D]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                {language === 'vi' ? 'Chưa phân loại' : 'Uncategorized'}
              </button>
              {folders.map(folder => (
                <button 
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold truncate ${selectedFolderId === folder.id ? 'border-[#4A6B5D] bg-[#4A6B5D]/10 text-[#4A6B5D]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  {language === 'vi' ? folder.name : (folder.name_en || folder.name)}
                </button>
              ))}
            </div>
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
            {language === 'vi' ? 'Lưu ngay' : 'Save Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveStyleModal;
