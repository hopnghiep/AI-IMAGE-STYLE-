
import React, { useState } from 'react';
import type { ArtStyle, ImageEditorAdjustments } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import ImageZoomModal from './ImageZoomModal';
import ComparisonView from './ComparisonView';
import ImageEditorControls from './ImageEditorControls';
import BatchResultGallery from './BatchResultGallery';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  styleReferenceImage: string | null;
  selectedStyle: ArtStyle | null;
  customStylePrompt: string;
  isLoading: boolean;
  isPreviewing: boolean;
  animatedVideoUrl: string | null;
  isAnimating: boolean;
  onAnimate: () => void;
  isEditing: boolean;
  editPrompt: string;
  onEditPromptChange: (prompt: string) => void;
  onEditTextFileUpload: (file: File) => void;
  onEdit: () => void;
  onCrop: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isUpscaling: boolean;
  onUpscale: (size: '2K' | '4K') => void;
  rateLimitCooldown: number;
  adjustments: ImageEditorAdjustments;
  onAdjustmentChange: (key: keyof ImageEditorAdjustments, value: number) => void;
  onCommitSliderAdjustments: () => void;
  onRotate: (direction: 'left' | 'right') => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  onResetAdjustments: () => void;
  onUndoAdjustment: () => void;
  onRedoAdjustment: () => void;
  canUndoAdjustment: boolean;
  canRedoAdjustment: boolean;
  progress: number;
  isBatchMode: boolean;
  isBatchProcessing: boolean;
  batchProgress: { current: number; total: number } | null;
  batchResults: { styleId: string; imageUrl: string | null; error?: string }[];
  allArtStyles: ArtStyle[];
  onClearBatchResults: () => void;
  isParsingFile: boolean;
  editReferenceImages: { data: string, type: string }[];
  isEditReferenceLoading: boolean;
  onEditReferenceImageUpload: (file: File) => void;
  onClearEditReferenceImage: (index: number) => void;
  language?: 'vi' | 'en';
  onSaveReferenceStyle?: () => void;
  hasReferenceStyleToSave?: boolean;
}

interface ImageBoxProps {
  title: string;
  image: string | null;
  isLoading?: boolean;
  isPlaceholder?: boolean;
  onImageClick: (imageUrl: string) => void;
  loadingText?: string;
  progress?: number;
  imageStyle?: React.CSSProperties;
}

const ImageBox: React.FC<ImageBoxProps> = ({ title, image, isLoading = false, isPlaceholder = false, onImageClick, loadingText = "AI is creating...", progress, imageStyle }) => {
  const isClickable = image && !isLoading;
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-normal text-center mb-3 text-gray-600">{title}</h3>}
      <div
        className="aspect-square w-full bg-gray-200/50 rounded-2xl border border-gray-300 flex items-center justify-center p-2 relative overflow-hidden group"
        onClick={() => isClickable && image && onImageClick(image)}
        >
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
            {progress && progress > 0 ? (
                <>
                    <p className="text-sm font-semibold text-[#423a3a] mb-2">{loadingText}</p>
                    <div className="w-full max-w-xs bg-gray-300 rounded-full h-2.5">
                        <div className="bg-[#4A6B5D] h-2.5 rounded-full transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="mt-2 text-lg font-mono font-semibold text-[#423a3a]">{Math.round(progress)}%</p>
                </>
            ) : (
                <>
                    <LoadingSpinner />
                    <p className="mt-4 text-[#423a3a] animate-pulse">{loadingText}</p>
                </>
            )}
          </div>
        )}
        {image ? (
          <>
            <img src={image} alt={title} className="object-contain max-w-full max-h-full rounded-lg animate-fade-in transition-all duration-200" style={imageStyle} />
            {isClickable && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
                    </svg>
                </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="text-center text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              <p className="mt-2">{isPlaceholder ? "Result will appear here" : "Upload or describe an image to start"}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface TextEditControlsProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onEdit: () => void;
    isEditing: boolean;
    isAnimating: boolean;
    isUpscaling: boolean;
    rateLimitCooldown: number;
    onEditTextFileUpload: (file: File) => void;
    isParsingFile: boolean;
    editReferenceImages: { data: string, type: string }[];
    isEditReferenceLoading: boolean;
    onEditReferenceImageUpload: (file: File) => void;
    onClearEditReferenceImage: (index: number) => void;
}

const TextEditControls: React.FC<TextEditControlsProps> = ({ 
    prompt, onPromptChange, onEdit, isEditing, isAnimating, isUpscaling, rateLimitCooldown, 
    onEditTextFileUpload, isParsingFile,
    editReferenceImages, isEditReferenceLoading, onEditReferenceImageUpload, onClearEditReferenceImage
}) => {
    const isDisabled = isEditing || isAnimating || isUpscaling || (!prompt.trim() && editReferenceImages.length === 0) || rateLimitCooldown > 0 || isParsingFile || isEditReferenceLoading;
    const isUploadDisabled = isEditing || isAnimating || isUpscaling || rateLimitCooldown > 0 || isParsingFile || isEditReferenceLoading;
    const textFileInputRef = React.useRef<HTMLInputElement>(null);
    const imageFileInputRef = React.useRef<HTMLInputElement>(null);

    const handleTextFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onEditTextFileUpload(event.target.files[0]);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onEditReferenceImageUpload(event.target.files[0]);
             if (event.target) {
                event.target.value = '';
            }
        }
    };

    const handleTextUploadClick = () => {
        textFileInputRef.current?.click();
    };
    const handleImageUploadClick = () => {
        imageFileInputRef.current?.click();
    };


    return (
        <div className="mt-6 w-full max-w-lg mx-auto animate-fade-in">
            <h3 className="text-lg font-normal text-center mb-3 text-gray-600">Edit with Text & Image</h3>
             <input
                type="file"
                ref={textFileInputRef}
                onChange={handleTextFileChange}
                className="hidden"
                accept=".txt,.pdf,.docx,.doc,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            />
             <input
                type="file"
                ref={imageFileInputRef}
                onChange={handleImageFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            <textarea
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                disabled={isUploadDisabled}
                placeholder="e.g., 'Add sunglasses to the person' or 'Change the background to a beach'"
                rows={3}
                className="w-full bg-white/80 border-2 border-gray-300 rounded-lg p-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#A98768] focus:border-[#A98768] transition-colors duration-300 resize-none"
                aria-label="Edit image with text prompt"
            />
            <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                    {editReferenceImages.map((image, index) => (
                         <div key={index} className="relative w-24 h-24 group flex-shrink-0">
                            <img src={image.data} alt={`Edit reference ${index + 1}`} className="object-cover w-full h-full rounded-md border border-gray-300" />
                            <button
                                onClick={(e) => { e.stopPropagation(); onClearEditReferenceImage(index); }}
                                className="absolute -top-1 -right-1 bg-white/80 text-gray-800 rounded-full p-0.5 hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                aria-label={`Clear edit reference image ${index + 1}`}
                                disabled={isUploadDisabled}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                         </div>
                    ))}
                    {editReferenceImages.length < 2 && (
                         <button
                            onClick={handleImageUploadClick}
                            disabled={isUploadDisabled}
                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-[#A98768] hover:text-[#A98768] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            aria-label="Upload an image to use in the edit"
                        >
                            {isEditReferenceLoading ? <LoadingSpinner /> : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="text-xs mt-1">Add Image</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex-grow flex flex-col items-end justify-between h-24">
                    <button
                        onClick={handleTextUploadClick}
                        disabled={isUploadDisabled}
                        className="px-4 py-2 text-sm font-normal rounded-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Upload text file to add to prompt"
                        title="Upload Text File"
                    >
                        {isParsingFile ? <LoadingSpinner /> : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        <span>{isParsingFile ? 'Reading...' : 'Upload Text'}</span>
                    </button>
                    <button
                        onClick={onEdit}
                        disabled={isDisabled}
                        className={`px-4 py-2 text-sm font-normal rounded-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2
                        ${isDisabled
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-[#A98768] hover:bg-[#967658] text-white shadow-md hover:shadow-lg'
                        }`}
                    >
                        {isEditing ? <LoadingSpinner /> : 'Apply Edit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const HistoryControls: React.FC<{
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}> = ({ onUndo, onRedo, canUndo, canRedo }) => {
    if (!canUndo && !canRedo) return null;

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded-full bg-white/80 border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Undo"
                title="Undo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 010 10H9" />
                </svg>
            </button>
            <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded-full bg-white/80 border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label="Redo"
                title="Redo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H8a5 5 0 000 10h1" />
                </svg>
            </button>
        </div>
    );
};

const getEditedImageDataUrl = (
    imageUrl: string,
    adjustments: ImageEditorAdjustments,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }
  
        const { brightness, contrast, saturation, rotation, scaleX, scaleY } = adjustments;
  
        const rad = rotation * Math.PI / 180;
        const absCos = Math.abs(Math.cos(rad));
        const absSin = Math.abs(Math.sin(rad));
  
        const originalWidth = img.width;
        const originalHeight = img.height;
  
        const newWidth = originalWidth * absCos + originalHeight * absSin;
        const newHeight = originalWidth * absSin + originalHeight * absCos;
  
        canvas.width = newWidth;
        canvas.height = newHeight;
  
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        ctx.scale(scaleX, scaleY);
  
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        
        ctx.drawImage(img, -originalWidth / 2, -originalHeight / 2, originalWidth, originalHeight);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (err) => reject(err);
      img.src = imageUrl;
    });
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    originalImage, 
    generatedImage, 
    styleReferenceImage,
    selectedStyle,
    customStylePrompt,
    isLoading,
    isPreviewing,
    animatedVideoUrl,
    isAnimating,
    onAnimate,
    isEditing,
    editPrompt,
    onEditPromptChange,
    onEditTextFileUpload,
    onEdit,
    onCrop,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    isUpscaling,
    onUpscale,
    rateLimitCooldown,
    adjustments,
    onAdjustmentChange,
    onCommitSliderAdjustments,
    onRotate,
    onFlip,
    onResetAdjustments,
    onUndoAdjustment,
    onRedoAdjustment,
    canUndoAdjustment,
    canRedoAdjustment,
    progress,
    isBatchMode,
    isBatchProcessing,
    batchProgress,
    batchResults,
    allArtStyles,
    onClearBatchResults,
    isParsingFile,
    editReferenceImages,
    isEditReferenceLoading,
    onEditReferenceImageUpload,
    onClearEditReferenceImage,
    language = 'vi',
    onSaveReferenceStyle,
    hasReferenceStyleToSave = false
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showUpscaleMenu, setShowUpscaleMenu] = useState(false);
  const { brightness, contrast, saturation, rotation, scaleX, scaleY } = adjustments;

  const imageFilterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  const imageTransformStyle = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
  const imageStyle: React.CSSProperties = {
      filter: imageFilterStyle,
      transform: imageTransformStyle,
  };


  const handleDownload = async () => {
    const link = document.createElement('a');
    
    let styleName = 'generated-style';
    if (selectedStyle) {
      styleName = selectedStyle.label;
    } else if (customStylePrompt) {
      styleName = customStylePrompt.split(' ').slice(0, 4).join(' ');
    } else if (styleReferenceImage) {
      styleName = 'custom-style-reference';
    }

    const safeFileName = styleName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    if (animatedVideoUrl) {
      link.href = animatedVideoUrl;
      link.download = `animated-${safeFileName}.mp4`;
    } else if (generatedImage) {
        try {
            const editedImageUrl = await getEditedImageDataUrl(generatedImage, adjustments);
            link.href = editedImageUrl;
            link.download = `${safeFileName}.png`;
        } catch (error) {
            console.error("Failed to process image for download:", error);
            link.href = generatedImage;
            const mimeType = generatedImage.substring(5, generatedImage.indexOf(';'));
            const extension = mimeType.split('/')[1] || 'png';
            link.download = `${safeFileName}.${extension}`;
        }
    } else {
        return;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cropButton = generatedImage && !isLoading && !isAnimating && !isEditing && !isUpscaling && rateLimitCooldown === 0 ? (
    <button
      onClick={onCrop}
      className="w-full md:w-auto px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      aria-label="Crop generated image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v-6a2 2 0 012-2h6M16 4v6a2 2 0 01-2 2H4" />
      </svg>
      {language === 'vi' ? 'Cắt ảnh' : 'Crop'}
    </button>
  ) : null;

  const upscaleMenu = generatedImage && !isLoading && !isAnimating && !isEditing && !isUpscaling && rateLimitCooldown === 0 ? (
    <div className="relative w-full md:w-auto">
        <button
          onClick={() => setShowUpscaleMenu(!showUpscaleMenu)}
          className="w-full px-6 py-2 bg-[#6c63ff] hover:bg-[#574fcf] text-white font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          aria-label="Upscale options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V8m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v-4m0 0h-4m4 0l-5-5" />
          </svg>
          Upscale
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showUpscaleMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showUpscaleMenu && (
            <div className="absolute bottom-full mb-2 left-0 right-0 md:left-auto md:min-w-[140px] bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-50 animate-fade-in">
                <button 
                    onClick={() => { onUpscale('2K'); setShowUpscaleMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] rounded-lg transition-colors flex items-center justify-between"
                >
                    <span>2K Resolution</span>
                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded uppercase">HD</span>
                </button>
                <button 
                    onClick={() => { onUpscale('4K'); setShowUpscaleMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] rounded-lg transition-colors flex items-center justify-between"
                >
                    <span>4K Resolution</span>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase font-black">UHD</span>
                </button>
            </div>
        )}
    </div>
  ) : null;

  const animateButton = generatedImage && !isLoading && !isAnimating && !isEditing && !isUpscaling && rateLimitCooldown === 0 ? (
    <button
      onClick={onAnimate}
      className="w-full md:w-auto px-6 py-2 bg-[#A98768] hover:bg-[#967658] text-white font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      aria-label="Animate generated image"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
      {language === 'vi' ? 'Tạo video' : 'Animate'}
    </button>
  ) : null;

  const saveStyleButton = hasReferenceStyleToSave && generatedImage && !isLoading && !isAnimating && !isEditing && !isUpscaling ? (
    <button
        onClick={onSaveReferenceStyle}
        className="w-full md:w-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        aria-label="Save this style"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v4m-2-2h4" />
        </svg>
        {language === 'vi' ? 'Lưu phong cách' : 'Save Style'}
    </button>
  ) : null;

  const downloadButton = (generatedImage || animatedVideoUrl) && !isLoading && !isAnimating && !isEditing && !isUpscaling ? (
    <button
      onClick={handleDownload}
      className="w-full md:w-auto px-6 py-2 bg-[#4A6B5D] hover:bg-[#3e5a4e] text-white font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      aria-label="Download result"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {language === 'vi' ? 'Tải xuống' : 'Download'}
    </button>
  ) : null;
  
  const StyleReferenceThumbnail = () => {
    if (!styleReferenceImage || !generatedImage || isLoading || isEditing || isUpscaling) return null;
    return (
      <div className="w-full md:w-auto">
        <p className="text-xs text-center text-gray-500 mb-1">{language === 'vi' ? 'Theo mẫu' : 'Styled with'}</p>
        <img 
          src={styleReferenceImage} 
          alt="Style Reference" 
          className="w-20 h-20 mx-auto rounded-lg object-cover border-2 border-gray-300 shadow-md cursor-pointer hover:border-[#4A6B5D] transition-colors" 
          onClick={() => setZoomedImage(styleReferenceImage)}
        />
      </div>
    );
  };

  const renderContent = () => {
    // Luôn ưu tiên hiển thị Batch Gallery nếu đang ở Batch Mode
    if (isBatchMode || isBatchProcessing) {
        return (
            <div className="flex flex-col gap-6 w-full">
                {isBatchProcessing && batchProgress && (
                    <div className="w-full bg-white/80 p-6 rounded-2xl border-2 border-[#4A6B5D]/20 shadow-lg animate-fade-in">
                        <p className="text-lg font-black text-[#4A6B5D] mb-4 text-center uppercase tracking-wider">
                            {language === 'vi' ? `Đang xử lý hàng loạt: ${batchProgress.current} / ${batchProgress.total}` : `Batch Processing: ${batchProgress.current} / ${batchProgress.total}`}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                            <div className="bg-[#4A6B5D] h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}></div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 font-bold text-center animate-pulse">
                            {language === 'vi' ? 'Ảnh sẽ xuất hiện ngay khi xử lý xong...' : 'Images will appear as they finish processing...'}
                        </p>
                    </div>
                )}
                
                <BatchResultGallery 
                    results={batchResults} 
                    styles={allArtStyles} 
                    onClear={onClearBatchResults}
                    onImagePreview={setZoomedImage}
                    language={language}
                />
            </div>
        );
    }

    if (isAnimating) {
      return (
        <div className="w-full flex flex-col items-center">
            <div className="aspect-square w-full bg-gray-200/50 rounded-2xl border border-gray-300 flex items-center justify-center p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10">
                    <LoadingSpinner />
                    <p className="mt-4 text-[#423a3a] text-center px-4 animate-pulse font-bold">
                        {language === 'vi' ? 'AI đang tạo video...' : 'AI is generating video...'}
                        <br />
                        {language === 'vi' ? 'Quá trình này có thể mất vài phút.' : 'This process can take a few minutes.'}
                    </p>
                </div>
                {generatedImage && <img src={generatedImage} alt="Generating animation from this image" className="object-contain max-w-full max-h-full rounded-lg blur-sm opacity-30" />}
            </div>
        </div>
      );
    }
    
    if (animatedVideoUrl) {
      return (
        <div className="w-full flex flex-col items-center">
            <h3 className="text-lg font-normal text-center mb-3 text-gray-600">AI Animation</h3>
            <div className="aspect-square w-full bg-gray-200/50 rounded-2xl border border-gray-300 flex items-center justify-center p-2 relative overflow-hidden group">
                <video src={animatedVideoUrl} className="object-contain max-w-full max-h-full rounded-lg" controls autoPlay loop muted playsInline />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {downloadButton}
            </div>
        </div>
      );
    }

    if (originalImage && generatedImage && !isLoading && !isPreviewing) {
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <h3 className="text-lg font-normal text-gray-600">{language === 'vi' ? 'So sánh' : 'Compare Images'}</h3>
              <HistoryControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <ComparisonView originalImage={originalImage} generatedImage={generatedImage} imageStyle={imageStyle} />
             <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
              {downloadButton}
              {saveStyleButton}
              {cropButton}
              {upscaleMenu}
              {animateButton}
              <StyleReferenceThumbnail />
            </div>
            <TextEditControls
                prompt={editPrompt}
                onPromptChange={onEditPromptChange}
                onEditTextFileUpload={onEditTextFileUpload}
                onEdit={onEdit}
                isEditing={isEditing}
                isAnimating={isAnimating}
                isUpscaling={isUpscaling}
                rateLimitCooldown={rateLimitCooldown}
                isParsingFile={isParsingFile}
                editReferenceImages={editReferenceImages}
                isEditReferenceLoading={isEditReferenceLoading}
                onEditReferenceImageUpload={onEditReferenceImageUpload}
                onClearEditReferenceImage={onClearEditReferenceImage}
            />
             <ImageEditorControls 
                brightness={brightness}
                onBrightnessChange={(v) => onAdjustmentChange('brightness', v)}
                contrast={contrast}
                onContrastChange={(v) => onAdjustmentChange('contrast', v)}
                saturation={saturation}
                onSaturationChange={(v) => onAdjustmentChange('saturation', v)}
                onCommitSliderAdjustments={onCommitSliderAdjustments}
                onRotate={onRotate}
                onFlip={onFlip}
                onReset={onResetAdjustments}
                onUndo={onUndoAdjustment}
                onRedo={onRedoAdjustment}
                canUndo={canUndoAdjustment}
                canRedo={canRedoAdjustment}
            />
          </div>
        );
      }
  
    if (!originalImage && generatedImage && !isLoading && !isPreviewing) {
        return (
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-center gap-4 mb-3">
              <h3 className="text-lg font-normal text-gray-600">AI Result</h3>
              <HistoryControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <ImageBox title="" image={generatedImage} onImageClick={setZoomedImage} imageStyle={imageStyle} />
            <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
              {downloadButton}
              {saveStyleButton}
              {cropButton}
              {upscaleMenu}
              {animateButton}
            </div>
            <TextEditControls
                prompt={editPrompt}
                onPromptChange={onEditPromptChange}
                onEditTextFileUpload={onEditTextFileUpload}
                onEdit={onEdit}
                isEditing={isEditing}
                isAnimating={isAnimating}
                isUpscaling={isUpscaling}
                rateLimitCooldown={rateLimitCooldown}
                isParsingFile={isParsingFile}
                editReferenceImages={editReferenceImages}
                isEditReferenceLoading={isEditReferenceLoading}
                onEditReferenceImageUpload={onEditReferenceImageUpload}
                onClearEditReferenceImage={onClearEditReferenceImage}
            />
            <ImageEditorControls 
                brightness={brightness}
                onBrightnessChange={(v) => onAdjustmentChange('brightness', v)}
                contrast={contrast}
                onContrastChange={(v) => onAdjustmentChange('contrast', v)}
                saturation={saturation}
                onSaturationChange={(v) => onAdjustmentChange('saturation', v)}
                onCommitSliderAdjustments={onCommitSliderAdjustments}
                onRotate={onRotate}
                onFlip={onFlip}
                onReset={onResetAdjustments}
                onUndo={onUndoAdjustment}
                onRedo={onRedoAdjustment}
                canUndo={canUndoAdjustment}
                canRedo={canRedoAdjustment}
            />
          </div>
        );
    }
    
    const isCreating = (isLoading || isPreviewing) && !isEditing && !isUpscaling;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <ImageBox title={language === 'vi' ? 'Ảnh gốc' : 'Original Image'} image={originalImage} onImageClick={setZoomedImage} />
            <div className="flex flex-col items-center">
                <ImageBox 
                    title={language === 'vi' ? 'Kết quả AI' : 'AI Result'}
                    image={generatedImage} 
                    isLoading={isLoading || isPreviewing || isEditing || isUpscaling} 
                    loadingText={
                        isUpscaling ? 'AI is upscaling...' 
                        : isEditing ? 'AI is applying edits...' 
                        : isPreviewing ? 'Generating Preview...' 
                        : 'AI is creating...'
                    }
                    isPlaceholder={!!originalImage} 
                    onImageClick={setZoomedImage} 
                    progress={isCreating || isUpscaling ? progress : 0}
                    imageStyle={imageStyle}
                />
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                  {downloadButton}
                  {saveStyleButton}
                  {upscaleMenu}
                  {animateButton}
                </div>
            </div>
        </div>
    );
  };


  return (
    <>
      {renderContent()}
      {zoomedImage && (
          <ImageZoomModal 
            imageUrl={zoomedImage} 
            onClose={() => setZoomedImage(null)}
            imageFilter={zoomedImage === generatedImage ? imageFilterStyle : undefined}
          />
      )}
    </>
  );
};

export default ResultDisplay;
