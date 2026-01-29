
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ComparisonViewProps {
  originalImage: string;
  generatedImage: string;
  imageStyle?: React.CSSProperties;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, generatedImage, imageStyle }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    e.preventDefault();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  }, [handleMove]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging.current) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    
    currentContainer?.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      currentContainer?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  return (
    <div className="w-full">
        <h3 className="text-lg font-normal text-center mb-3 text-gray-600">Compare Images</h3>
        <div 
            ref={containerRef}
            className="relative w-full aspect-square bg-gray-200/50 rounded-2xl border border-gray-300 overflow-hidden select-none cursor-ew-resize"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <img 
                src={originalImage} 
                alt="Original Image" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                draggable="false"
            />
            <div 
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img 
                    src={generatedImage} 
                    alt="AI Result" 
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-200" 
                    style={imageStyle}
                    draggable="false"
                />
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
                Original
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md pointer-events-none">
                AI
            </div>
            <div 
                className="absolute top-0 bottom-0 w-1 bg-[#4A6B5D]/80 pointer-events-none"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-[#4A6B5D] border-2 border-white flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </div>
            </div>
        </div>
        <div className="text-center text-gray-500 mt-2 text-sm">
            Drag slider to compare
        </div>
    </div>
  );
};

export default ComparisonView;
