
import React, { useState, useRef } from 'react';
import Camera, { CameraHandles } from './Camera';

interface CameraModalProps {
    onClose: () => void;
    onCapture: (file: File) => void;
}

// Helper to convert data URL to File
function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture }) => {
    const cameraRef = useRef<CameraHandles>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCapture = () => {
        const dataUrl = cameraRef.current?.capture();
        if (dataUrl) {
            try {
                const file = dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);
                onCapture(file);
                onClose();
            } catch(e) {
                 setError("Could not create file from captured image.");
                 console.error(e);
            }
        } else {
            setError("Could not capture image.");
        }
    };
    
    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-[#f8f5f2] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                 <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-normal text-[#423a3a]">Use Camera</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
                        aria-label="Close camera"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                 <main className="p-4 flex-grow overflow-auto flex items-center justify-center bg-gray-900 relative">
                    <Camera
                        ref={cameraRef}
                        onStreamReady={() => {
                            setIsCameraReady(true);
                            setError(null);
                        }}
                        onError={(err) => {
                            setIsCameraReady(false);
                            setError(err);
                        }}
                    />
                 </main>
                 <footer className="p-4 flex flex-col justify-center items-center gap-2 bg-white/50 border-t border-gray-200 rounded-b-2xl">
                     <button
                        onClick={handleCapture}
                        disabled={!isCameraReady || !!error}
                        className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:border-[#4A6B5D] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                        aria-label="Take Photo"
                     >
                        <div className="w-16 h-16 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors"></div>
                     </button>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                 </footer>
            </div>
        </div>
    );
};

export default CameraModal;
