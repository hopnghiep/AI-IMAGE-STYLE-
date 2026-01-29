
import React, { useState, useRef, useEffect } from 'react';

interface ImageZoomModalProps {
  imageUrl: string;
  onClose: () => void;
  imageFilter?: string;
  language?: 'vi' | 'en';
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, onClose, imageFilter, language = 'vi' }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoom('in');
        } else {
            handleZoom('out');
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    const container = imageRef.current?.parentElement?.parentElement;
    container?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        container?.removeEventListener('wheel', handleWheel);
    }
  }, [onClose]);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prevScale => {
      const newScale = direction === 'in' ? prevScale * 1.2 : prevScale / 1.2;
      if (newScale < 1) {
          setPosition({ x: 0, y: 0 });
          return 1;
      }
      if (newScale > 5) return 5;
      return newScale;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      isDragging.current = true;
      startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      if(imageRef.current) imageRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current && scale > 1) {
      e.preventDefault();
      const newX = e.clientX - startPos.current.x;
      const newY = e.clientY - startPos.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    if(imageRef.current) imageRef.current.style.cursor = 'grab';
  };
  
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai_image_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full p-4 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="overflow-hidden">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Zoomed view"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            style={{ 
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                filter: imageFilter,
                transition: 'transform 0.2s ease-out, filter 0.2s linear',
                cursor: scale > 1 ? 'grab' : 'default'
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button 
          onClick={handleDownload}
          className="text-white bg-[#4A6B5D] rounded-full p-3 hover:bg-[#3e5a4e] transition-colors shadow-lg flex items-center gap-2"
          aria-label="Download"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline font-bold text-sm">{language === 'vi' ? 'Lưu ảnh' : 'Save'}</span>
        </button>
        <button 
          onClick={onClose}
          className="text-white bg-black/50 rounded-full p-3 hover:bg-black/75 transition-colors shadow-lg"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full p-2 z-10">
        <button onClick={() => handleZoom('out')} disabled={scale <= 1} className="text-white p-2 rounded-full hover:bg-black/75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Zoom out">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
        </button>
        <button onClick={resetZoom} className="text-white p-2 rounded-full hover:bg-black/75 disabled:opacity-50 transition-colors" aria-label="Reset zoom">
          <span className="font-mono text-sm w-12 text-center">{(scale * 100).toFixed(0)}%</span>
        </button>
        <button onClick={() => handleZoom('in')} disabled={scale >= 5} className="text-white p-2 rounded-full hover:bg-black/75 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Zoom in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ImageZoomModal;
