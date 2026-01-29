
import React, { useRef, useState, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
  images: { id: string, name: string, data: string }[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  onCropClick: (id: string) => void;
  isLoading?: boolean;
  language?: 'vi' | 'en';
}

const Thumbnail: React.FC<{
    image: { id: string, name: string, data: string },
    isSelected: boolean,
    onSelect: () => void,
    onRemove: () => void,
    onCrop: () => void,
}> = ({ image, isSelected, onSelect, onRemove, onCrop }) => {
    return (
        <div 
            onClick={onSelect}
            className={`relative flex-shrink-0 w-28 h-28 rounded-lg border-2 p-1 transition-all duration-200 cursor-pointer group ${isSelected ? 'border-[#4A6B5D] bg-[#4A6B5D]/20' : 'border-gray-300 bg-white hover:border-[#4A6B5D]/50'}`}
        >
            <img src={image.data} alt={image.name} className="object-cover w-full h-full rounded-md" />
            <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-b-md truncate">
                {image.name}
            </div>
            <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="p-1 bg-white/80 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                    aria-label={`Remove ${image.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onCrop(); }}
                    className="p-1 bg-white/80 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label={`Crop ${image.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v-6a2 2 0 012-2h6M16 4v6a2 2 0 01-2 2H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
};


const ImageUploader: React.FC<ImageUploaderProps> = ({ 
    onImageUpload, 
    images,
    selectedImageId,
    onSelectImage,
    onRemoveImage,
    onClearAll,
    onCropClick,
    isLoading = false,
    language = 'vi'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPasteError(null);
      onImageUpload(Array.from(event.target.files));
      if (event.target) {
        event.target.value = ''; // Clear file input value to allow re-uploading the same file
      }
    }
  };

  const handleAreaClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };
  
  const handleCameraClick = () => {
    if (!isLoading) {
      cameraInputRef.current?.click();
    }
  };

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    if (isLoading) return;

    const items = event.clipboardData.items;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob instanceof File) {
          const file = new File([blob], `pasted_image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`, { type: blob.type });
          imageFiles.push(file);
        }
      }
    }
    
    if (imageFiles.length > 0) {
        setPasteError(null);
        onImageUpload(imageFiles);
        event.preventDefault();
        return;
    }

    if (event.clipboardData.types.length > 0 && !event.clipboardData.types.includes('text/plain')) {
      setPasteError('No image found in clipboard. Please ensure you copied an image.');
    } else if (event.clipboardData.getData('text/plain')) {
      setPasteError(null);
    }
  }, [isLoading, onImageUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isLoading) {
      setIsDraggingOver(true);
    }
  }, [isLoading]);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    if (isLoading) return;

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(event.dataTransfer.files).filter(file => (file as File).type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setPasteError(null);
        onImageUpload(imageFiles);
      } else {
        setPasteError('Only image files are supported for drag and drop.');
      }
    }
  }, [isLoading, onImageUpload]);


  if (images.length === 0) {
    return (
        <>
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture
                disabled={isLoading}
            />
            <div
                onClick={handleAreaClick}
                onPaste={handlePaste}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
                className={`relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors duration-300 bg-gray-100/60 ${isLoading ? 'cursor-wait' : 'cursor-pointer hover:border-[#4A6B5D] focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]'} ${isDraggingOver ? 'border-[#4A6B5D] bg-gray-200' : 'border-gray-300'}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={isLoading}
                    multiple
                />
                {isLoading ? (
                <div className="text-center text-gray-600">
                    <LoadingSpinner />
                    <p className="mt-2 font-normal">Loading images...</p>
                </div>
                ) : (
                <div className="text-center text-gray-500 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 font-normal">{language === 'vi' ? 'Nhấn, kéo thả hoặc dán ảnh vào đây' : 'Click, drag, or paste images here'}</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                    {pasteError && <p className="text-red-500 text-xs mt-2">{pasteError}</p>}
                </div>
                )}
            </div>
            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-normal">{language === 'vi' ? 'HOẶC' : 'OR'}</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                  onClick={handleCameraClick}
                  disabled={isLoading}
                  className="w-full py-3 text-lg font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {language === 'vi' ? 'Sử dụng Camera' : 'Use Camera'}
              </button>

              <a 
                href="https://www.pinterest.com/search/pins/?q=photography%20inspiration%20art" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 bg-[#E60023] hover:bg-[#ad001a] text-white shadow-sm"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.164 0 7.399 2.965 7.399 6.935 0 4.139-2.607 7.469-6.227 7.469-1.215 0-2.358-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
                {language === 'vi' ? 'Tham khảo ý tưởng trên Pinterest' : 'Find ideas on Pinterest'}
              </a>
            </div>
        </>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">{images.length} {language === 'vi' ? 'ảnh đã tải' : 'image(s) uploaded'}</p>
            <button onClick={onClearAll} className="text-sm text-red-600 hover:text-red-800 font-normal">{language === 'vi' ? 'Xóa tất cả' : 'Clear All'}</button>
        </div>
         <div
            onPaste={handlePaste}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full bg-gray-100/60 rounded-lg p-2 transition-colors duration-300 ${isDraggingOver ? 'border-2 border-dashed border-[#4A6B5D]' : 'border-2 border-dashed border-transparent'}`}
         >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                disabled={isLoading}
                multiple
            />
             <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture
                disabled={isLoading}
            />
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map(img => (
                    <Thumbnail 
                        key={img.id}
                        image={img}
                        isSelected={img.id === selectedImageId}
                        onSelect={() => onSelectImage(img.id)}
                        onRemove={() => onRemoveImage(img.id)}
                        onCrop={() => onCropClick(img.id)}
                    />
                ))}
                 <button
                    onClick={handleCameraClick}
                    disabled={isLoading}
                    className="flex-shrink-0 w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-[#4A6B5D] hover:text-[#4A6B5D] transition-colors disabled:opacity-50"
                    aria-label="Use camera"
                 >
                    {isLoading ? <LoadingSpinner /> : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs mt-1">{language === 'vi' ? 'Camera' : 'Camera'}</span>
                        </>
                    )}
                 </button>
                <button
                    onClick={handleAreaClick}
                    disabled={isLoading}
                    className="flex-shrink-0 w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-[#4A6B5D] hover:text-[#4A6B5D] transition-colors disabled:opacity-50"
                    aria-label="Upload more images"
                >
                    {isLoading ? <LoadingSpinner /> : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span className="text-xs mt-1">{language === 'vi' ? 'Thêm ảnh' : 'Add More'}</span>
                        </>
                    )}
                </button>
            </div>
         </div>
    </div>
  );
};

export default ImageUploader;
