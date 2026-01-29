
import React, { useRef, useState, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface StyleReferenceUploaderProps {
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
  styleReferenceImage: string | null;
  isLoading?: boolean;
  disabled?: boolean;
  language?: 'vi' | 'en';
}

const StyleReferenceUploader: React.FC<StyleReferenceUploaderProps> = ({ onImageUpload, onImageClear, styleReferenceImage, isLoading = false, disabled = false, language = 'vi' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPasteError(null);
      onImageUpload(event.target.files[0]);
    }
  };

  const handleAreaClick = () => {
    if (!styleReferenceImage && !isLoading && !disabled) {
        fileInputRef.current?.click();
    }
  };
  
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onImageClear();
    if(fileInputRef.current) {
        fileInputRef.current.value = ""; 
    }
    setPasteError(null);
  }

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    if (isLoading || disabled || styleReferenceImage) return;

    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob instanceof File) {
          const file = new File([blob], `pasted_style_${Date.now()}.${blob.type.split('/')[1] || 'png'}`, { type: blob.type });
          setPasteError(null);
          onImageUpload(file);
          event.preventDefault();
          return;
        }
      }
    }
    
    if (event.clipboardData.types.length > 0 && !event.clipboardData.types.includes('text/plain')) {
      setPasteError(language === 'vi' ? 'Không tìm thấy ảnh trong bộ nhớ tạm.' : 'No image found in clipboard.');
    }
  }, [isLoading, disabled, styleReferenceImage, onImageUpload, language]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isLoading && !disabled && !styleReferenceImage) {
      setIsDraggingOver(true);
    }
  }, [isLoading, disabled, styleReferenceImage]);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    if (isLoading || disabled || styleReferenceImage) return;

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = Array.from(event.dataTransfer.files).find(f => (f as File).type.startsWith('image/'));
      if (file) {
        setPasteError(null);
        onImageUpload(file as File);
      } else {
        setPasteError(language === 'vi' ? 'Chỉ hỗ trợ tệp tin hình ảnh.' : 'Only image files are supported.');
      }
    }
  }, [isLoading, disabled, styleReferenceImage, onImageUpload, language]);

  return (
    <div className="space-y-2">
      <div
        onClick={handleAreaClick}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={styleReferenceImage ? -1 : 0}
        className={`relative w-full h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          isLoading 
            ? 'cursor-wait bg-gray-50/50 border-gray-200' 
            : styleReferenceImage 
              ? 'cursor-default bg-white border-transparent' 
              : disabled 
                ? 'cursor-not-allowed opacity-50 bg-gray-50/50 border-gray-200' 
                : isDraggingOver
                  ? 'border-[#4A6B5D] bg-[#4A6B5D]/5 scale-[1.02]'
                  : 'cursor-pointer hover:border-[#4A6B5D] hover:bg-gray-100/50 bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={isLoading || disabled || !!styleReferenceImage}
        />
        {isLoading ? (
          <div className="text-center text-gray-600 px-2">
             <LoadingSpinner />
            <p className="mt-2 font-normal text-sm">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
          </div>
        ) : styleReferenceImage ? (
          <>
              <img src={styleReferenceImage} alt="Style reference preview" className="object-contain w-full h-full rounded-2xl p-1" />
              <button 
                  onClick={handleClearClick} 
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-gray-800 hover:bg-red-500 hover:text-white transition-all shadow-md z-10"
                  aria-label={language === 'vi' ? "Xóa ảnh tham chiếu" : "Clear style reference"}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </>
        ) : (
          <div className="text-center text-gray-400 px-6">
             <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-10 w-10 mb-2 transition-colors ${isDraggingOver ? 'text-[#4A6B5D]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
            <p className="font-bold text-sm text-gray-500">{language === 'vi' ? 'Nhấn, kéo thả hoặc dán ảnh vào đây' : 'Click, drag, or paste image here'}</p>
            <p className="text-xs mt-1 leading-relaxed">{language === 'vi' ? 'Sử dụng phong cách từ ảnh của bạn' : 'Use style from your own photo'}</p>
            {pasteError && <p className="text-red-500 text-[10px] mt-2 font-bold">{pasteError}</p>}
          </div>
        )}
      </div>

      {!styleReferenceImage && !isLoading && (
        <a 
          href="https://www.pinterest.com/search/pins/?q=digital%20art%20style%20reference" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-500 hover:text-[#E60023] transition-colors py-1"
        >
          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.164 0 7.399 2.965 7.399 6.935 0 4.139-2.607 7.469-6.227 7.469-1.215 0-2.358-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
          </svg>
          {language === 'vi' ? 'Tìm phong cách mẫu trên Pinterest' : 'Find style references on Pinterest'}
        </a>
      )}
    </div>
  );
};

export default StyleReferenceUploader;
