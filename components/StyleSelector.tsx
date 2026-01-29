
import React, { useState, useEffect } from 'react';
import type { ArtStyle, StyleFolder } from '../types';

interface StyleSelectorProps {
  styles: ArtStyle[];
  selectedStyle: ArtStyle | null;
  styleFolders: StyleFolder[];
  onStyleSelect: (style: ArtStyle) => void;
  onStylePreview: (style: ArtStyle) => void;
  onStyleDelete: (styleId: string) => void;
  onStyleEdit: (style: ArtStyle) => void;
  onSetRating: (styleId: string, rating: number) => void;
  onMoveStyleToFolder: (styleId: string, folderId: string | null) => void;
  disabled?: boolean;
  isBatchMode?: boolean;
  batchSelectedIds?: Set<string>;
  onBatchStyleToggle?: (styleId: string) => void;
  isBlendMode?: boolean;
  blendStyleA?: ArtStyle | null;
  blendStyleB?: ArtStyle | null;
  onBlendStyleSelect?: (style: ArtStyle) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  language?: 'vi' | 'en';
  externalOpenFolderId?: string | 'uncategorized' | null;
  onFolderToggle?: (folderId: string | 'uncategorized' | null) => void;
}

const StyleItem: React.FC<{
  style: ArtStyle;
  isSelected: boolean;
  selectionType: 'A' | 'B' | 'batch' | 'single' | null;
  ringClass: string;
  disabled: boolean;
  folders: StyleFolder[];
  onSelect: (style: ArtStyle) => void;
  onSetRating: (styleId: string, rating: number) => void;
  onDelete: (styleId: string) => void;
  onEdit: (style: ArtStyle) => void;
  onPreview: (style: ArtStyle) => void;
  onMove: (folderId: string | null) => void;
  isMoving: boolean;
  onToggleMoveMenu: () => void;
  language: 'vi' | 'en';
}> = ({
  style, isSelected, ringClass, folders,
  onSelect, onSetRating, onDelete, onEdit, onPreview, onMove, isMoving, onToggleMoveMenu, language
}) => {
  const rating = style.rating || 0;
  const displayName = language === 'vi' ? (style.label_vi || style.label) : style.label;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('styleId', style.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      key={style.id}
      role="button"
      tabIndex={0}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(style)}
      className={`relative p-2 rounded-xl transition-all duration-300 focus:outline-none group cursor-pointer border-2 border-transparent
        ${isSelected ? ringClass : 'bg-white shadow-sm hover:shadow-lg hover:border-[#4A6B5D]/30'}
        ${isMoving ? 'z-30 ring-2 ring-[#4A6B5D]' : ''}`}
    >
        {/* Actions Overlay */}
        <div className="absolute top-1 left-1 right-1 flex justify-between items-start transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20">
          <div className="flex gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(style.id); }} 
              title={language === 'vi' ? "Xóa phong cách" : "Delete style"}
              className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(style); }} 
              title={language === 'vi' ? "Sửa phong cách" : "Edit style"}
              className="p-1.5 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleMoveMenu(); }} 
                  title={language === 'vi' ? "Di chuyển vào thư mục" : "Move to folder"}
                  className={`p-1.5 rounded-lg shadow-lg transition-all ${isMoving ? 'bg-[#4A6B5D] text-white' : 'bg-white text-[#4A6B5D] hover:bg-[#4A6B5D] hover:text-white'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </button>
                {isMoving && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
                      <p className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">
                        {language === 'vi' ? 'Chọn thư mục' : 'Select Folder'}
                      </p>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar">
                        {folders.map(folder => (
                          <button 
                            key={folder.id} 
                            onClick={() => { onMove(folder.id); onToggleMoveMenu(); }} 
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${style.folderId === folder.id ? 'bg-[#4A6B5D]/10 text-[#4A6B5D]' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                              {language === 'vi' ? folder.name : (folder.name_en || folder.name)}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => { onMove(null); onToggleMoveMenu(); }} 
                        className="w-full text-left px-3 py-2 mt-1 text-xs font-bold text-gray-400 hover:bg-gray-50 rounded-lg italic flex items-center gap-2 border-t border-gray-50"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          {language === 'vi' ? 'Bỏ nhóm' : 'Uncategorized'}
                      </button>
                  </div>
                )}
            </div>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onPreview(style); }}
            className="p-1.5 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-100 transition-all"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center justify-center mb-2 gap-0.5">
          {[...Array(5)].map((_, index) => (
            <button 
              key={index} 
              onClick={(e) => { e.stopPropagation(); onSetRating(style.id, index + 1 === rating ? 0 : index + 1); }} 
              className={`p-0.5 transition-colors ${index + 1 <= rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </button>
          ))}
        </div>
        
        <div className="relative w-full overflow-hidden rounded-lg">
          <img src={style.thumbnail || style.exampleImage} alt={displayName} className="w-full h-20 object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-2">
            <p className="text-white text-[10px] font-black text-center leading-tight uppercase tracking-tight drop-shadow-md">{displayName}</p>
          </div>
        </div>
    </div>
  );
};

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, styleFolders, onStyleSelect, onStylePreview, onStyleDelete, onStyleEdit, onSetRating, onMoveStyleToFolder, disabled, isBatchMode, batchSelectedIds, onBatchStyleToggle, isBlendMode, blendStyleA, blendStyleB, onBlendStyleSelect, language = 'vi', externalOpenFolderId, onFolderToggle }) => {
  const [openFolderId, setOpenFolderId] = useState<string | 'uncategorized' | null>(null);
  const [movingStyleId, setMovingStyleId] = useState<string | null>(null);

  // Sync with external state if provided
  useEffect(() => {
    if (externalOpenFolderId !== undefined) {
      setOpenFolderId(externalOpenFolderId);
    }
  }, [externalOpenFolderId]);

  const handleToggle = (id: string | 'uncategorized' | null) => {
    const next = openFolderId === id ? null : id;
    setOpenFolderId(next);
    if (onFolderToggle) onFolderToggle(next);
  };

  const uncategorizedStyles = styles.filter(s => !s.folderId);
  const stylesByFolder = styles.reduce((acc, style) => {
    if (style.folderId) {
      if (!acc[style.folderId]) acc[style.folderId] = [];
      acc[style.folderId].push(style);
    }
    return acc;
  }, {} as Record<string, ArtStyle[]>);

  const handleDragOverFolder = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnFolder = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    const styleId = e.dataTransfer.getData('styleId');
    if (styleId) {
      onMoveStyleToFolder(styleId, folderId);
    }
  };

  const renderStyleGrid = (styleList: ArtStyle[]) => (
    <div className="grid grid-cols-2 gap-3">
      {styleList.map(style => {
        let selectionType: 'A' | 'B' | 'batch' | 'single' | null = null;
        let ringClass = '';
        if (isBlendMode) {
          if (style.id === blendStyleA?.id) { selectionType = 'A'; ringClass = 'ring-4 ring-blue-500 bg-blue-50'; }
          else if (style.id === blendStyleB?.id) { selectionType = 'B'; ringClass = 'ring-4 ring-purple-500 bg-purple-50'; }
        } else if (isBatchMode) {
          if (batchSelectedIds?.has(style.id)) { selectionType = 'batch'; ringClass = 'ring-4 ring-[#4A6B5D] bg-[#4A6B5D]/10'; }
        } else if (selectedStyle?.id === style.id) {
          selectionType = 'single'; ringClass = 'ring-4 ring-[#4A6B5D] bg-[#4A6B5D]/5';
        }
        return (
          <StyleItem 
            key={style.id} style={style} isSelected={!!selectionType} selectionType={selectionType} ringClass={ringClass} 
            disabled={!!disabled} folders={styleFolders}
            onSelect={s => isBatchMode ? onBatchStyleToggle?.(s.id) : (isBlendMode ? onBlendStyleSelect?.(s) : onStyleSelect(s))}
            onSetRating={onSetRating} onDelete={onStyleDelete} onEdit={onStyleEdit} onPreview={onStylePreview}
            isMoving={movingStyleId === style.id} onToggleMoveMenu={() => setMovingStyleId(prev => prev === style.id ? null : style.id)}
            onMove={fId => onMoveStyleToFolder(style.id, fId)}
            language={language}
          />
        );
      })}
    </div>
  );

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-50' : ''}`}>
      {styleFolders.map(folder => (
          <details 
            key={folder.id} 
            className="border border-gray-200 rounded-2xl group bg-white shadow-sm overflow-visible" 
            open={openFolderId === folder.id}
            onDragOver={handleDragOverFolder}
            onDrop={(e) => handleDropOnFolder(e, folder.id)}
          >
            <summary className={`px-4 py-3.5 text-sm font-black text-gray-800 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 uppercase tracking-wider rounded-2xl transition-colors ${openFolderId === folder.id ? 'bg-gray-50' : ''}`} onClick={e => { e.preventDefault(); handleToggle(folder.id); }}>
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${openFolderId === folder.id ? 'bg-[#4A6B5D] text-white' : 'bg-gray-100 text-[#4A6B5D]'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
                <span>{language === 'vi' ? folder.name : (folder.name_en || folder.name)}</span>
                <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {(stylesByFolder[folder.id] || []).length}
                </span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-300 transition-transform duration-300 ${openFolderId === folder.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">{renderStyleGrid(stylesByFolder[folder.id] || [])}</div>
          </details>
      ))}

      <details 
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible" 
        open={openFolderId === 'uncategorized' || styleFolders.length === 0}
        onDragOver={handleDragOverFolder}
        onDrop={(e) => handleDropOnFolder(e, null)}
      >
        <summary className="px-4 py-3.5 text-sm font-black text-[#4A6B5D] cursor-pointer list-none flex items-center justify-between hover:bg-gray-50 uppercase tracking-wide border-b border-gray-100 rounded-t-2xl" onClick={e => { e.preventDefault(); handleToggle('uncategorized'); }}>
          <div className="flex items-center gap-2">
            <span>{language === 'vi' ? 'Chưa phân loại' : 'Uncategorized'}</span>
            <span className="text-[10px] bg-[#4A6B5D]/10 text-[#4A6B5D] px-1.5 py-0.5 rounded-full font-bold">
              {uncategorizedStyles.length}
            </span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-300 transition-transform duration-300 ${openFolderId === 'uncategorized' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="p-4 bg-gray-50/30 rounded-b-2xl">{renderStyleGrid(uncategorizedStyles)}</div>
      </details>
    </div>
  );
};

export default StyleSelector;
