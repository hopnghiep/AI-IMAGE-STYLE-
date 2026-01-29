
import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface CameraHandles {
    capture: () => string | null;
}

interface CameraProps {
    onStreamReady?: () => void;
    onError?: (error: string) => void;
}

const Camera = forwardRef<CameraHandles, CameraProps>(({ onStreamReady, onError }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isCameraInitializing, setIsCameraInitializing] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cleanupCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        const startCamera = async () => {
            setIsCameraInitializing(true);
            setError(null);
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    let stream;
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                        setIsFlipped(false);
                    } catch (e) {
                        console.warn("Could not get rear camera, trying default camera.", e);
                        stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        const settings = stream.getVideoTracks()[0]?.getSettings();
                        if (settings.facingMode === 'user') {
                            setIsFlipped(true);
                        } else {
                            setIsFlipped(false);
                        }
                    }
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } else {
                    throw new Error("Camera not supported by your browser.");
                }
            } catch (err) {
                 let errorMessage = "An unknown error occurred while starting the camera.";
                 if (err instanceof Error) {
                     if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                        errorMessage = "Camera permission denied. Please enable it in your browser settings and refresh the page.";
                    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                        errorMessage = "No camera found on this device.";
                    } else {
                        errorMessage = `Could not start camera: ${err.message}`;
                    }
                 }
                 setError(errorMessage);
                 if (onError) onError(errorMessage);
            } finally {
                setIsCameraInitializing(false);
            }
        };

        startCamera();
        
        return () => {
            cleanupCamera();
        };
    }, [cleanupCamera, onError]);

    useImperativeHandle(ref, () => ({
        capture: () => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                if (context) {
                    if (isFlipped) {
                        context.translate(video.videoWidth, 0);
                        context.scale(-1, 1);
                    }
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    return canvas.toDataURL('image/jpeg');
                }
            }
            return null;
        }
    }));

    const handleCanPlay = () => {
        setIsCameraInitializing(false);
        if (onStreamReady) {
            onStreamReady();
        }
    };
    
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-contain transition-opacity duration-300 ${isCameraInitializing || error ? 'opacity-0' : 'opacity-100'}`}
                onCanPlay={handleCanPlay}
                style={{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {(isCameraInitializing || error) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                   {isCameraInitializing && !error && (
                        <>
                            <LoadingSpinner />
                            <p className="mt-2">Starting camera...</p>
                        </>
                    )}
                    {error && <p className="text-center text-red-400">{error}</p>}
                </div>
            )}
        </div>
    );
});

export default Camera;
