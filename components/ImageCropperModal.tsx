import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageCropperModalProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio: string;
}

function getCroppedImage(
    image: HTMLImageElement,
    crop: PixelCrop,
): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error('Could not get 2d context from canvas');
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    );
    
    return canvas.toDataURL('image/png');
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ imageUrl, onCropComplete, onCancel, aspectRatio }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isLoading, setIsLoading] = useState(false);

    const aspectValue = aspectRatio === 'auto' ? undefined : (() => {
        const [width, height] = aspectRatio.split(':').map(Number);
        if (width && height) {
            return width / height;
        }
        return undefined;
    })();

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspectValue,
                width,
                height,
            ),
            width,
            height,
        );
        setCrop(newCrop);
    }

    function handleApplyCrop() {
        if (!completedCrop || !imgRef.current || completedCrop.width === 0 || completedCrop.height === 0) {
            return;
        }
        setIsLoading(true);
        try {
            const croppedImageUrl = getCroppedImage(imgRef.current, completedCrop);
            onCropComplete(croppedImageUrl);
        } catch (e) {
            console.error("Cropping failed", e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-[#f8f5f2] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-normal text-[#423a3a]">Crop Image</h2>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50"
                        aria-label="Close cropper"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <main className="p-6 flex-grow overflow-auto flex items-center justify-center bg-gray-200">
                    <ReactCrop
                        crop={crop}
                        onChange={(c, p) => setCrop(p)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={aspectValue}
                        ruleOfThirds
                        className="max-w-full max-h-[60vh]"
                    >
                        <img 
                            ref={imgRef}
                            src={imageUrl} 
                            alt="Image to crop" 
                            onLoad={onImageLoad}
                            style={{ maxHeight: '65vh' }}
                        />
                    </ReactCrop>
                </main>
                <footer className="p-4 flex justify-end items-center gap-4 bg-white/50 border-t border-gray-200 rounded-b-2xl">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-6 py-2 text-sm font-normal rounded-lg transition-colors duration-300 ease-in-out bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApplyCrop}
                        disabled={isLoading}
                        className="px-6 py-2 text-sm font-normal rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-[#4A6B5D] hover:bg-[#3e5a4e] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Apply Crop'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ImageCropperModal;