import React from 'react';

interface ImageEditorControlsProps {
    brightness: number;
    onBrightnessChange: (value: number) => void;
    contrast: number;
    onContrastChange: (value: number) => void;
    saturation: number;
    onSaturationChange: (value: number) => void;
    onCommitSliderAdjustments: () => void;
    onRotate: (direction: 'left' | 'right') => void;
    onFlip: (axis: 'horizontal' | 'vertical') => void;
    onReset: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void; onMouseUp: () => void }> = ({ label, value, onChange, onMouseUp }) => (
    <div className="mb-4">
        <label className="block text-sm font-normal text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-2">
            <input
                type="range"
                min="0"
                max="200"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                onMouseUp={onMouseUp}
                onTouchEnd={onMouseUp}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A98768]
                           [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#A98768]"
            />
            <span className="text-xs font-mono text-gray-600 w-10 text-center">{value}%</span>
        </div>
    </div>
);

const ImageEditorControls: React.FC<ImageEditorControlsProps> = ({
    brightness, onBrightnessChange,
    contrast, onContrastChange,
    saturation, onSaturationChange,
    onCommitSliderAdjustments,
    onRotate, onFlip, onReset,
    onUndo, onRedo, canUndo, canRedo
}) => {
    return (
        <details className="mt-6 w-full max-w-lg mx-auto animate-fade-in group" open>
            <summary className="text-lg font-normal text-center text-gray-600 list-none cursor-pointer flex items-center justify-center">
                Image Adjustments
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </summary>
            <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200">
                <Slider label="Brightness" value={brightness} onChange={onBrightnessChange} onMouseUp={onCommitSliderAdjustments} />
                <Slider label="Contrast" value={contrast} onChange={onContrastChange} onMouseUp={onCommitSliderAdjustments} />
                <Slider label="Saturation" value={saturation} onChange={onSaturationChange} onMouseUp={onCommitSliderAdjustments} />

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-300/70">
                    <button 
                        onClick={onUndo} 
                        disabled={!canUndo} 
                        className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Undo adjustment"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 010 10H9" />
                        </svg>
                        Undo
                    </button>
                    <button 
                        onClick={onRedo} 
                        disabled={!canRedo} 
                        className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Redo adjustment"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H8a5 5 0 000 10h1" />
                        </svg>
                        Redo
                    </button>
                    <button onClick={onReset} className="p-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors">
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                     <button onClick={() => onRotate('left')} className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Rotate
                    </button>
                    <button onClick={() => onRotate('right')} className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Rotate
                    </button>
                    <button onClick={() => onFlip('horizontal')} className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L3 8m4 8l4-8m1 9v6m0-6l4-4m-4 4l4 4" />
                        </svg>
                        Flip
                    </button>
                     <button onClick={() => onFlip('vertical')} className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L3 8m4 8l4-8m1 9v6m0-6l4-4m-4 4l4 4" />
                        </svg>
                        Flip
                    </button>
                </div>
            </div>
        </details>
    );
};

export default ImageEditorControls;