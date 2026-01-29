
import React, { useState } from 'react';
import type { ArtStyle } from '../types';

interface DeletedStylesProps {
  deletedStyles: ArtStyle[];
  onRestore: (styleId: string) => void;
  onRestoreAll: () => void;
  onPermanentlyDelete: (styleId: string) => void;
  language?: 'vi' | 'en';
}

const DeletedStyles: React.FC<DeletedStylesProps> = ({ deletedStyles, onRestore, onRestoreAll, onPermanentlyDelete, language = 'vi' }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (deletedStyles.length === 0) {
    return (
        <div className="mt-4 p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-gray-400 font-bold text-sm uppercase">
                {language === 'vi' ? 'Thùng rác trống' : 'Trash is empty'}
            </p>
        </div>
    );
  }

  const handlePermanentDelete = (e: React.MouseEvent, styleId: string, styleLabel: string) => {
    e.stopPropagation();
    if (window.confirm(language === 'vi' ? `Xác nhận xóa vĩnh viễn "${styleLabel}"? Hành động này không thể hoàn tác.` : `Permanently delete "${styleLabel}"? This cannot be undone.`)) {
      onPermanentlyDelete(styleId);
    }
  };

  return (
    <div className="mt-4 animate-fade-in bg-red-50/30 rounded-2xl border border-red-100 p-4">
      <div
        className="flex justify-between items-center cursor-pointer mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h3 className="text-sm font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {language === 'vi' ? `Phong cách đã xóa (${deletedStyles.length})` : `Deleted Styles (${deletedStyles.length})`}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-red-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="space-y-3 animate-fade-in">
          <button
            onClick={onRestoreAll}
            className="w-full text-center px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            {language === 'vi' ? 'Khôi phục tất cả' : 'Restore All'}
          </button>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {deletedStyles.map((style) => (
              <li
                key={style.id}
                className="flex items-center gap-3 bg-white p-2 rounded-xl border border-red-100 shadow-sm"
              >
                <img src={style.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover grayscale opacity-60" />
                <div className="flex-grow min-w-0">
                    <p className="text-xs font-black text-gray-700 truncate uppercase">
                        {language === 'vi' ? (style.label_vi || style.label) : style.label}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onRestore(style.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title={language === 'vi' ? 'Khôi phục' : 'Restore'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handlePermanentDelete(e, style.id, style.label)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title={language === 'vi' ? 'Xóa vĩnh viễn' : 'Delete permanently'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeletedStyles;
