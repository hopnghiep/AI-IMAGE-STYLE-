
import React, { useState, useRef, useEffect } from 'react';
import type { StyleFolder } from '../types';

interface FolderManagerProps {
  folders: StyleFolder[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  language?: 'vi' | 'en';
}

const FolderManager: React.FC<FolderManagerProps> = ({ folders, onCreateFolder, onDeleteFolder, onRenameFolder, language = 'vi' }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFolderId && editInputRef.current) {
        editInputRef.current.focus();
    }
  }, [editingFolderId]);


  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsExpanded(true);
    }
  };

  const handleStartEditing = (folder: StyleFolder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleCancelEditing = () => {
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const handleSaveRename = () => {
    if (editingFolderId && editingFolderName.trim()) {
      onRenameFolder(editingFolderId, editingFolderName.trim());
    }
    handleCancelEditing();
  };

  const handleDelete = (folderId: string) => {
    onDeleteFolder(folderId);
  }

  return (
    <div className="my-6 border-t border-b border-gray-200 py-4">
      <div 
        className="flex justify-between items-center cursor-pointer select-none group"
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <h3 className="text-md font-black text-gray-800 uppercase tracking-wide group-hover:text-[#4A6B5D] transition-colors">
            {language === 'vi' ? 'Quản lý thư mục' : 'Folder Manager'}
        </h3>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-4 animate-fade-in">
          <form onSubmit={handleCreate} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={language === 'vi' ? "Tên thư mục mới..." : "New folder name..."}
              className="flex-grow bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[#4A6B5D] focus:border-[#4A6B5D] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!newFolderName.trim()}
              className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out bg-[#4A6B5D] text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'vi' ? 'Tạo' : 'Create'}
            </button>
          </form>

          {folders.length > 0 && (
            <div className="mt-3 max-h-48 overflow-y-auto pr-1 space-y-2">
              {folders.map(folder => (
                <div key={folder.id} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl text-sm font-bold shadow-sm group hover:border-[#4A6B5D]/30 transition-all">
                  {editingFolderId === folder.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onBlur={handleSaveRename}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveRename();
                        if (e.key === 'Escape') handleCancelEditing();
                      }}
                      className="flex-grow bg-white border-2 border-[#4A6B5D]/50 rounded-lg px-2 py-1 outline-none font-bold"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4A6B5D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span className="text-gray-800 truncate pr-2">{language === 'vi' ? folder.name : (folder.name_en || folder.name)}</span>
                    </div>
                  )}

                  {editingFolderId !== folder.id && (
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleStartEditing(folder)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" aria-label={`Rename folder ${folder.name}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                       <button onClick={() => handleDelete(folder.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Delete folder ${folder.name}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FolderManager;
