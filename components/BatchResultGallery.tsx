
import React, { useState } from 'react';
import type { ArtStyle } from '../types';
import JSZip from 'jszip';
import { LoadingSpinner } from './LoadingSpinner';

interface BatchResultGalleryProps {
  results: { styleId: string; imageUrl: string | null; error?: string }[];
  styles: ArtStyle[];
  onClear: () => void;
  onImagePreview: (imageUrl: string) => void;
  language?: 'vi' | 'en';
}

const BatchResultItem: React.FC<{
    result: { styleId: string; imageUrl: string | null; error?: string };
    style: ArtStyle | undefined;
    onPreview: (imageUrl: string) => void;
    language: 'vi' | 'en';
}> = ({ result, style, onPreview, language }) => {
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!result.imageUrl) return;
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = `ai-style-${style?.label.toLowerCase().replace(/\s/g, '-') || 'result'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const displayName = language === 'vi' ? (style?.label_vi || style?.label || 'Chưa rõ') : (style?.label || 'Unknown');

    return (
        <div className="relative group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md flex flex-col animate-fade-in">
            <div className="aspect-square w-full flex items-center justify-center p-2 bg-[#f9f9f9] relative">
                {result.imageUrl ? (
                    <img src={result.imageUrl} alt={displayName} className="object-contain max-w-full max-h-full rounded-md transition-all duration-300" />
                ) : result.error ? (
                    <div className="text-center p-2 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <p className="text-[10px] font-bold uppercase">{language === 'vi' ? 'Lỗi tạo ảnh' : 'Failed'}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <LoadingSpinner />
                        <p className="text-[10px] text-gray-400 font-bold uppercase animate-pulse">
                            {language === 'vi' ? 'Đang xử lý...' : 'Processing...'}
                        </p>
                    </div>
                )}
            </div>
            
            <div className="p-3 bg-white border-t border-gray-100">
                <p className="text-sm font-bold text-gray-700 truncate">{displayName}</p>
            </div>

            {result.imageUrl && (
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-all duration-300 p-2">
                    <button 
                        onClick={() => onPreview(result.imageUrl!)} 
                        className="flex-1 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-l-lg font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-colors"
                    >
                        <span>{language === 'vi' ? 'Xem' : 'View'}</span>
                        <span>{language === 'vi' ? 'trước' : 'preview'}</span>
                    </button>
                    <button 
                        onClick={handleDownload} 
                        className="flex-1 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-r-lg font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>{language === 'vi' ? 'Tải' : 'Down-'}</span>
                        <span>{language === 'vi' ? 'xuống' : 'load'}</span>
                    </button>
                 </div>
            )}
        </div>
    );
};

const BatchResultGallery: React.FC<BatchResultGalleryProps> = ({ results, styles, onClear, onImagePreview, language = 'vi' }) => {
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    const successfulResults = results.filter(r => r.imageUrl);
    if (successfulResults.length === 0) return;
    
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < successfulResults.length; i++) {
        const result = successfulResults[i];
        const style = styles.find(s => s.id === result.styleId);
        const fileName = `result-${i+1}-${style?.label.replace(/\s/g, '_') || result.styleId}.png`;
        const base64Data = result.imageUrl!.split(',')[1];
        zip.file(fileName, base64Data, { base64: true });
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `ai-style-batch-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Zip failed:", error);
    } finally {
      setIsZipping(false);
    }
  };
  
  const hasSuccessfulResults = results.some(r => r.imageUrl);

  return (
    <div className="w-full animate-fade-in p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">
                {language === 'vi' ? 'Kết quả chuyển đổi' : 'Conversion Results'}
            </h2>
            <div className="flex items-center gap-3">
              {hasSuccessfulResults && (
                <button
                  onClick={handleDownloadAll}
                  disabled={isZipping}
                  className="px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-300 flex items-center gap-2 bg-[#4A6B5D] text-white shadow-lg shadow-[#4A6B5D]/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isZipping ? <LoadingSpinner /> : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  )}
                  {language === 'vi' ? 'Tải xuống tất cả' : 'Download All'}
                </button>
              )}
              <button
                  onClick={onClear}
                  className="px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-300 bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm"
              >
                  {language === 'vi' ? 'Xóa' : 'Clear'}
              </button>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((result, index) => {
                const style = styles.find(s => s.id === result.styleId);
                return <BatchResultItem key={`${result.styleId}-${index}`} result={result} style={style} onPreview={onImagePreview} language={language} />;
            })}
        </div>
    </div>
  );
};

export default BatchResultGallery;
