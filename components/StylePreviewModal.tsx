
import React, { useEffect, useState, useRef } from 'react';
import type { ArtStyle } from '../types';
import { stylizeImage, RateLimitError } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface StylePreviewModalProps {
  style: ArtStyle;
  onClose: () => void;
  onPreviewGenerated: (styleId: string, newPreviewUrl: string) => void;
  language?: 'vi' | 'en';
}

const StylePreviewModal: React.FC<StylePreviewModalProps> = ({ style, onClose, onPreviewGenerated, language = 'vi' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Display state
  const [displayImage, setDisplayImage] = useState<string>(style.preview);

  // User image generation state
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Reset state when style changes
    setUserImage(null);
    setDisplayImage(style.preview);
    setGenerationError(null);
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [style, onClose]);

  const handleGeneratePreview = async (imageData: string, imageType: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
        const base64Data = imageData.split(',')[1];
        const newImageBase64 = await stylizeImage(
            base64Data,
            imageType,
            style.prompt,
            null,
            null
        );
        if (newImageBase64) {
            const newPreviewUrl = `data:image/png;base64,${newImageBase64}`;
            setDisplayImage(newPreviewUrl);
            onPreviewGenerated(style.id, newPreviewUrl);
        } else {
            setGenerationError("The AI could not generate a preview for this image.");
        }
    } catch (err) {
        setGenerationError(err instanceof Error ? err.message : 'An unknown error occurred while generating the preview.');
        console.error(err);
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUserImage(result);
        handleGeneratePreview(result, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOwnImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadIllustration = () => {
    const link = document.createElement('a');
    link.href = displayImage;
    const safeName = style.label.toLowerCase().replace(/\s+/g, '-');
    link.download = `minh-hoa-${safeName}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div
        className="bg-[#f8f5f2] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-normal text-[#423a3a]">{language === 'vi' ? (style.label_vi || style.label) : style.label}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6 flex-grow overflow-y-auto">
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Left Column: Image Preview */}
                <div className="w-full md:w-1/2 flex-shrink-0">
                    <div className="relative w-full aspect-square bg-gray-200/50 rounded-lg flex items-center justify-center p-2 shadow-md">
                        {isGenerating ? (
                            <>
                                {userImage && <img src={userImage} alt="Processing..." className="object-contain max-w-full max-h-full rounded-md blur-sm" />}
                                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10">
                                    <LoadingSpinner />
                                    <p className="mt-2 text-sm text-gray-600">AI is processing...</p>
                                </div>
                            </>
                        ) : generationError ? (
                            <div className="text-center p-4">
                                <p className="text-red-600 text-sm ">{generationError}</p>
                                <p className="text-xs text-gray-500 mt-2">Please try another image.</p>
                            </div>
                        ) : (
                           <img src={displayImage} alt={`${style.label} preview`} className="object-contain max-w-full max-h-full rounded-lg" />
                        )}
                    </div>
                </div>
                
                {/* Right Column: Style Description */}
                <div className="w-full md:w-1/2">
                  <h3 className="font-semibold text-lg text-[#4A6B5D] mb-2">{language === 'vi' ? 'Mô tả phong cách' : 'Style Description'}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{language === 'vi' ? (style.prompt_vi || style.prompt) : style.prompt}</p>
                </div>
            </div>
        </main>
        <footer className="p-4 flex justify-end items-center gap-3 bg-white/50 border-t border-gray-200 rounded-b-2xl flex-shrink-0">
            <button
                onClick={handleDownloadIllustration}
                className="px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-[#A98768] hover:bg-[#967658] text-white shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {language === 'vi' ? 'Tải ảnh minh họa' : 'Download Illustration'}
            </button>
            <button
                onClick={handleTryOwnImageClick}
                className="px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-[#4A6B5D] hover:bg-[#3e5a4e] text-white shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {userImage ? (language === 'vi' ? 'Thử ảnh khác' : 'Try Another Image') : (language === 'vi' ? 'Thử với ảnh của bạn' : 'Try With Your Image')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default StylePreviewModal;
