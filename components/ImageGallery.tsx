
import React, { useState, useMemo } from 'react';
import type { GalleryImage } from '../types';
import ImageZoomModal from './ImageZoomModal';
import JSZip from 'jszip';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageGalleryProps {
  images: GalleryImage[];
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  language?: 'vi' | 'en';
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onRemoveImage, onClearAll, language = 'vi' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const filteredAndSortedImages = useMemo(() => {
    let result = [...images];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(img => 
        img.styleName.toLowerCase().includes(lowerSearch) || 
        img.prompt.toLowerCase().includes(lowerSearch)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });

    return result;
  }, [images, searchTerm, sortBy]);

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("ai_gallery_styles");
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const base64Data = img.url.split(',')[1];
        if (base64Data) {
            const fileName = `image_${i + 1}_${img.styleName.replace(/\s+/g, '_')}.png`;
            folder?.file(fileName, base64Data, { base64: true });
        }
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `bo_suu_tap_ai_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to generate zip", error);
    } finally {
      setIsZipping(false);
    }
  };

  if (images.length === 0) return null;

  return (
    <section className="bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-200 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
            <h2 className="text-2xl font-black text-[#4A6B5D] uppercase tracking-tighter">
                {language === 'vi' ? 'Bộ sưu tập đã tạo' : 'Image Gallery'}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
                {language === 'vi' ? 'Lưu trữ tất cả các tác phẩm nghệ thuật bạn đã biến hóa' : 'Stores all the artistic works you have transformed'}
            </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow min-w-[200px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder={language === 'vi' ? "Lọc theo phong cách..." : "Filter by style..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#4A6B5D] outline-none transition-all"
                />
            </div>

            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-[#4A6B5D] outline-none cursor-pointer"
            >
                <option value="newest">{language === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                <option value="oldest">{language === 'vi' ? 'Cũ nhất' : 'Oldest'}</option>
            </select>

            <div className="flex items-center gap-2">
                <button 
                    onClick={handleDownloadAll}
                    disabled={isZipping}
                    className="px-4 py-2 text-sm font-black rounded-xl bg-[#4A6B5D] text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isZipping ? <LoadingSpinner /> : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    )}
                    {language === 'vi' ? 'Lưu toàn bộ' : 'Save All'}
                </button>
                <button 
                    onClick={onClearAll}
                    className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    {language === 'vi' ? 'Xóa tất cả' : 'Clear All'}
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredAndSortedImages.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <img 
                src={img.url} 
                alt={img.styleName} 
                className="w-full h-full object-cover"
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-[10px] font-black uppercase tracking-wider mb-1">{img.styleName}</p>
                <p className="text-gray-300 text-[9px] line-clamp-2 leading-tight mb-2 italic">"{img.prompt}"</p>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setZoomedImage(img.url)}
                        className="flex-grow bg-white text-black py-1 rounded-lg text-[10px] font-bold hover:bg-[#4A6B5D] hover:text-white transition-colors"
                    >
                        {language === 'vi' ? 'Xem' : 'View'}
                    </button>
                    <button 
                        onClick={() => onRemoveImage(img.id)}
                        className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        aria-label={language === 'vi' ? "Xóa ảnh" : "Remove image"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedImages.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">
                {language === 'vi' ? 'Không tìm thấy ảnh phù hợp với tiêu chí lọc.' : 'No images found matching filter criteria.'}
              </p>
          </div>
      )}

      {zoomedImage && (
          <ImageZoomModal 
            imageUrl={zoomedImage} 
            onClose={() => setZoomedImage(null)}
            language={language}
          />
      )}
    </section>
  );
};

export default ImageGallery;
