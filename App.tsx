
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { stylizeImage, generateImageFromPrompt, animateImage, upscaleImage, RateLimitError } from './services/geminiService';
import { ART_STYLES, DEFAULT_FOLDERS } from './constants';
import type { ArtStyle, Preset, ImageEditorAdjustments, StyleFolder, GalleryImage } from './types';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import StyleReferenceUploader from './components/StyleReferenceUploader';
import ColorAdjustmentSliders from './components/ColorAdjustmentSliders';
import AspectRatioSelector from './components/AspectRatioSelector';
import CustomStyleInput from './components/CustomStyleInput';
import StylePresets from './components/StylePresets';
import ImageCropperModal from './components/ImageCropperModal';
import StylePreviewModal from './components/StylePreviewModal';
import FolderManager from './components/FolderManager';
import ImageGallery from './components/ImageGallery';
import SaveStyleModal from './components/SaveStyleModal';
import EditStyleModal from './components/EditStyleModal';
import StyleSearch from './components/StyleSearch';
import DeletedStyles from './components/DeletedStyles';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

interface ImageState {
  id: string;
  name: string;
  originalData: string;
  originalType: string;
  history: string[];
  historyIndex: number;
  animatedVideoUrl: string | null;
  adjustments: ImageEditorAdjustments;
  adjustmentHistory: ImageEditorAdjustments[];
  adjustmentHistoryIndex: number;
}

const initialAdjustmentsState: ImageEditorAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
};

const DEFAULT_PRESETS: Preset[] = [
  { id: 'default_1', name: 'Chân dung Điện ảnh', styleId: null, customStylePrompt: 'Cinematic portrait, moody lighting', styleInfluence: 80, vibrancy: 10, mood: -10, aspectRatio: '3:4' },
  { id: 'default_2', name: 'Phim Cổ điển', styleId: null, customStylePrompt: 'Vintage film aesthetic', styleInfluence: 70, vibrancy: -15, mood: -20, aspectRatio: '4:3' },
];

const createThumbnail = (base64: string, size: number = 300): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > size) {
                    height *= size / width;
                    width = size;
                }
            } else {
                if (height > size) {
                    width *= size / height;
                    height = size;
                }
            }
            canvas.width = width;
            canvas.height = height;
            if (ctx) ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => resolve(base64);
        img.src = base64;
    });
};

export default function App() {
  const [images, setImages] = useState<ImageState[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isOriginalImageLoading, setIsOriginalImageLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [styleReferenceImage, setStyleReferenceImage] = useState<string | null>(null);
  const [vibrancy, setVibrancy] = useState(0);
  const [mood, setMood] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [batchResults, setBatchResults] = useState<{ styleId: string; imageUrl: string | null; error?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [artStyles, setArtStyles] = useState<ArtStyle[]>([]);
  const [styleFolders, setStyleFolders] = useState<StyleFolder[]>([]);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isBlendMode, setIsBlendMode] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [blendStyleA, setBlendStyleA] = useState<ArtStyle | null>(null);
  const [blendStyleB, setBlendStyleB] = useState<ArtStyle | null>(null);
  const [batchSelectedStyleIds, setBatchSelectedStyleIds] = useState<Set<string>>(new Set());

  const [styleSearchTerm, setStyleSearchTerm] = useState('');
  const [progress, setProgress] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [previewingStyle, setPreviewingStyle] = useState<ArtStyle | null>(null);
  const [editingStyle, setEditingStyle] = useState<ArtStyle | null>(null);
  const [croppingTarget, setCroppingTarget] = useState<{ id: string, type: 'original' | 'generated' } | null>(null);
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);
  const [editPrompt, setEditPrompt] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [hasStyleRefResult, setHasStyleRefResult] = useState(false);
  const [lastStyleRefUsed, setLastStyleRefUsed] = useState<string | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string | null>(null);

  const progressIntervalRef = useRef<number | null>(null);

  const selectedImage = useMemo(() => images.find(img => img.id === selectedImageId), [images, selectedImageId]);
  const originalImage = useMemo(() => selectedImage?.originalData ?? null, [selectedImage]);
  const generatedImage = useMemo(() => {
    if (!selectedImage || !selectedImage.history || selectedImage.history.length === 0) return null;
    const idx = selectedImage.historyIndex;
    if (idx < 0 || idx >= selectedImage.history.length) return selectedImage.history[selectedImage.history.length - 1];
    return selectedImage.history[idx] || null;
  }, [selectedImage]);
  
  const adjustments = useMemo(() => selectedImage?.adjustments ?? initialAdjustmentsState, [selectedImage]);

  useEffect(() => {
    try {
      const savedStylesString = localStorage.getItem('artStyles');
      const savedStyles = savedStylesString ? JSON.parse(savedStylesString) : [];
      const reconciled = ART_STYLES.map(s => {
        const saved = Array.isArray(savedStyles) ? savedStyles.find((ss: any) => ss?.id === s.id) : null;
        return saved ? { 
          ...s, 
          rating: saved.rating || 0, 
          isDeleted: !!saved.isDeleted, 
          folderId: saved.folderId,
          // Quan trọng: Cho phép ghi đè ảnh mặc định nếu đã có ảnh tùy chỉnh lưu trong máy
          thumbnail: saved.thumbnail || s.thumbnail,
          preview: saved.preview || s.preview,
          exampleImage: saved.exampleImage || s.exampleImage
        } : s;
      });
      const customStyles = Array.isArray(savedStyles) ? savedStyles.filter((ss: any) => ss && !ART_STYLES.find(s => s.id === ss.id)) : [];
      setArtStyles([...reconciled, ...customStyles]);
      
      const savedPresets = localStorage.getItem('stylePresets');
      setPresets(savedPresets && JSON.parse(savedPresets).length > 0 ? JSON.parse(savedPresets) : DEFAULT_PRESETS);
      
      const savedFolders = localStorage.getItem('styleFolders');
      setStyleFolders(savedFolders ? JSON.parse(savedFolders) : DEFAULT_FOLDERS);
      
      const savedGallery = localStorage.getItem('imageGallery');
      setGalleryImages(savedGallery ? JSON.parse(savedGallery) : []);
    } catch (e) {
      console.error("Failed to load storage", e);
      setArtStyles(ART_STYLES);
      setPresets(DEFAULT_PRESETS);
      setStyleFolders(DEFAULT_FOLDERS);
      setGalleryImages([]);
    }
  }, []);

  useEffect(() => {
    const persist = () => {
        try {
            const limitedGallery = galleryImages.slice(0, 10);
            localStorage.setItem('artStyles', JSON.stringify(artStyles));
            localStorage.setItem('stylePresets', JSON.stringify(presets));
            localStorage.setItem('styleFolders', JSON.stringify(styleFolders));
            localStorage.setItem('imageGallery', JSON.stringify(limitedGallery));
        } catch (e) {
            console.error("Storage persist failed", e);
        }
    };
    if (artStyles.length > 0 || galleryImages.length > 0) persist();
  }, [artStyles, presets, styleFolders, galleryImages, language]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startProgressSimulation = () => {
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(p => (p >= 95 ? 95 : p + Math.random() * 5));
    }, 400);
  };

  const stopProgressSimulation = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  };

  const handleImageUpload = (files: File[]) => {
    setIsOriginalImageLoading(true);
    const newImageStates: ImageState[] = [];
    let completedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newImg: ImageState = {
          id: newId, name: file.name, originalData: dataUrl, originalType: file.type,
          history: [dataUrl], historyIndex: 0, animatedVideoUrl: null,
          adjustments: { ...initialAdjustmentsState }, 
          adjustmentHistory: [{ ...initialAdjustmentsState }], 
          adjustmentHistoryIndex: 0
        };
        newImageStates.push(newImg);
        completedCount++;

        if (completedCount === files.length) {
          setImages(prev => [...prev, ...newImageStates]);
          if (!selectedImageId && newImageStates.length > 0) {
            setSelectedImageId(newImageStates[0].id);
          }
          setIsOriginalImageLoading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateClick = async () => {
    if (images.length === 0 || (!selectedStyle && !customStylePrompt.trim() && !isBlendMode && !styleReferenceImage)) return;
    
    setIsLoading(true);
    setError(null);
    setHasStyleRefResult(false);
    startProgressSimulation();

    let basePrompt = "";
    let styleName = "Custom";
    let currentStyleId = "custom";

    if (isBlendMode && blendStyleA && blendStyleB) {
      basePrompt = `A creative fusion of two artistic styles. Style A: ${blendStyleA.prompt}. Style B: ${blendStyleB.prompt}. Mix them naturally into a unique hybrid aesthetic.`;
      styleName = `Blend: ${blendStyleA.label} + ${blendStyleB.label}`;
      currentStyleId = `blend_${blendStyleA.id}_${blendStyleB.id}`;
      if (customStylePrompt.trim()) {
        basePrompt += ` Also apply this specific instruction: ${customStylePrompt}`;
      }
    } else if (selectedStyle) {
      const stylePrompt = language === 'vi' ? (selectedStyle.prompt_vi || selectedStyle.prompt) : selectedStyle.prompt;
      basePrompt = customStylePrompt.trim() 
        ? `${stylePrompt}. Also, incorporate this specific instruction: ${customStylePrompt}`
        : stylePrompt;
      styleName = language === 'vi' ? (selectedStyle.label_vi || selectedStyle.label) : selectedStyle.label;
      currentStyleId = selectedStyle.id;
    } else {
      basePrompt = customStylePrompt.trim() || "An artistic transformation.";
      styleName = 'Custom';
      currentStyleId = 'custom';
    }
    
    if (!basePrompt.trim() && styleReferenceImage) {
      basePrompt = "Replicate the artistic style, color palette, and textures from the provided reference image precisely.";
      styleName = "Ref Image Style";
    }

    setLastUsedPrompt(basePrompt);

    try {
      if (images.length > 1 || isBatchMode) {
        setIsBatchProcessing(true);
        const initialBatchResults = images.map(() => ({ styleId: currentStyleId, imageUrl: null }));
        setBatchResults(initialBatchResults);
        
        for (let i = 0; i < images.length; i++) {
          setBatchProgress({ current: i + 1, total: images.length });
          const img = images[i];
          try {
            const res = await stylizeImage(img.originalData.split(',')[1], img.originalType, basePrompt, styleReferenceImage?.split(',')[1] || null, styleReferenceImage ? 'image/png' : null, undefined, aspectRatio);
            if (res) {
              const fullRes = `data:image/png;base64,${res}`;
              setImages(prev => prev.map(item => item.id === img.id ? { ...item, history: [...item.history, fullRes], historyIndex: item.history.length } : item));
              setBatchResults(prev => prev.map((resItem, idx) => idx === i ? { ...resItem, imageUrl: fullRes } : resItem));
              const newEntry = { id: `gal_${Date.now()}_${Math.random()}`, url: fullRes, styleName, prompt: basePrompt, timestamp: Date.now(), aspectRatio };
              setGalleryImages(prev => [newEntry, ...prev]);
              setHasStyleRefResult(true);
              if (styleReferenceImage) setLastStyleRefUsed(styleReferenceImage);
            }
          } catch (err: any) {
             setBatchResults(prev => prev.map((resItem, idx) => idx === i ? { ...resItem, error: err.message } : resItem));
          }
        }
        setIsBatchProcessing(false);
      } else if (selectedImage) {
        const res = await stylizeImage(selectedImage.originalData.split(',')[1], selectedImage.originalType, basePrompt, styleReferenceImage?.split(',')[1] || null, styleReferenceImage ? 'image/png' : null, undefined, aspectRatio);
        if (res) {
          const fullRes = `data:image/png;base64,${res}`;
          setImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, history: [...img.history, fullRes], historyIndex: img.history.length } : img));
          const newEntry = { id: `gal_${Date.now()}`, url: fullRes, styleName, prompt: basePrompt, timestamp: Date.now(), aspectRatio };
          setGalleryImages(prev => [newEntry, ...prev]);
          setHasStyleRefResult(true);
          if (styleReferenceImage) setLastStyleRefUsed(styleReferenceImage);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      stopProgressSimulation();
      setBatchProgress(null);
      setIsBatchProcessing(false);
    }
  };

  const handleAnimate = async () => {
    if (!selectedImage || !generatedImage) return;
    setIsAnimating(true);
    try {
      const mimeType = generatedImage.substring(5, generatedImage.indexOf(';'));
      const videoUrl = await animateImage(generatedImage.split(',')[1], mimeType);
      if (videoUrl) {
        setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, animatedVideoUrl: videoUrl } : img));
      }
    } catch (e: any) { setError(e.message); }
    finally { setIsAnimating(false); }
  };

  const handleUpscale = async (size: '2K' | '4K') => {
    if (!selectedImage || !generatedImage) return;
    setIsUpscaling(true);
    startProgressSimulation();
    try {
      const mimeType = generatedImage.substring(5, generatedImage.indexOf(';'));
      const res = await upscaleImage(generatedImage.split(',')[1], mimeType, size);
      if (res) {
        const fullRes = `data:image/png;base64,${res}`;
        setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, history: [...img.history, fullRes], historyIndex: img.history.length } : img));
      }
    } catch (e: any) { setError(e.message); }
    finally { setIsUpscaling(false); stopProgressSimulation(); }
  };

  const handleStyleSelect = (style: ArtStyle) => {
    if (selectedStyle?.id === style.id) {
        setSelectedStyle(null);
    } else {
        setSelectedStyle(style);
    }
  };

  const handleBatchStyleToggle = (styleId: string) => {
    setBatchSelectedStyleIds(prev => {
      const next = new Set(prev);
      if (next.has(styleId)) next.delete(styleId);
      else next.add(styleId);
      return next;
    });
    
    if (selectedStyle?.id === styleId) {
        setSelectedStyle(null);
    } else {
        const style = artStyles.find(s => s.id === styleId);
        if (style) setSelectedStyle(style);
    }
  };

  const handleBlendStyleSelect = (style: ArtStyle) => {
    if (!blendStyleA) {
      setBlendStyleA(style);
    } else if (!blendStyleB) {
      if (blendStyleA.id === style.id) setBlendStyleA(null);
      else setBlendStyleB(style);
    } else {
      if (blendStyleA.id === style.id) {
        setBlendStyleA(blendStyleB);
        setBlendStyleB(null);
      } else if (blendStyleB.id === style.id) {
        setBlendStyleB(null);
      } else {
        setBlendStyleA(style);
        setBlendStyleB(null);
      }
    }
  };

  const handleSaveStyle = async (name: string, folderId: string | null) => {
    if (!generatedImage) return;
    setIsLoading(true);
    try {
        const [thumb, refThumb] = await Promise.all([
          createThumbnail(generatedImage, 300),
          (lastStyleRefUsed || styleReferenceImage) ? createThumbnail((lastStyleRefUsed || styleReferenceImage)!, 200) : Promise.resolve(undefined)
        ]);
        const ns: ArtStyle = {
            id: `c_${Date.now()}`,
            label: name, label_vi: name,
            prompt: lastUsedPrompt || customStylePrompt || "Custom hybrid style.",
            thumbnail: thumb, preview: thumb, exampleImage: thumb, referenceImage: refThumb,
            folderId: folderId, rating: 0, isDeleted: false
        };
        setArtStyles(prev => [...prev, ns]);
        showToast(language === 'vi' ? 'Lưu phong cách thành công!' : 'Style saved successfully!');
        setShowSaveModal(false);
    } catch (err) {
        showToast(language === 'vi' ? 'Lỗi khi lưu phong cách!' : 'Error saving style!', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const handlePreviewGenerated = async (styleId: string, newUrl: string) => {
    try {
        // Tự động tạo thumbnail nhỏ cho Style để không làm nặng bộ nhớ và cập nhật giao diện
        const thumb = await createThumbnail(newUrl, 300);
        setArtStyles(prev => prev.map(s => s.id === styleId ? {
            ...s, 
            preview: newUrl, 
            thumbnail: thumb, 
            exampleImage: thumb 
        } : s));
        showToast(language === 'vi' ? 'Đã cập nhật ảnh minh họa mới cho phong cách này!' : 'Style preview updated!');
    } catch (e) {
        console.error("Failed to update style preview", e);
    }
  };

  const visibleArtStyles = useMemo(() => {
    return artStyles.filter(s => !s.isDeleted && (
      s.label.toLowerCase().includes(styleSearchTerm.toLowerCase()) || 
      (s.label_vi && s.label_vi.toLowerCase().includes(styleSearchTerm.toLowerCase()))
    ));
  }, [artStyles, styleSearchTerm]);

  const deletedStyles = useMemo(() => {
    return artStyles.filter(s => !!s.isDeleted);
  }, [artStyles]);

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#423a3a] flex flex-col font-sans">
      <Header language={language} onLanguageChange={setLanguage} />
      {toast && (
        <div className={`fixed top-24 right-6 z-[100] p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex items-center gap-3 border ${toast.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'}`}>
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    {toast.type === 'success' ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
                </svg>
            </div>
            <span className="font-bold">{toast.message}</span>
        </div>
      )}

      <main className="flex-grow w-full px-2 md:px-6 py-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-[#4A6B5D] uppercase tracking-wide">1. {language === 'vi' ? 'Tải ảnh' : 'Upload'}</h2>
              <ImageUploader 
                onImageUpload={handleImageUpload} images={images.map(i => ({ id: i.id, name: i.name, data: i.originalData }))}
                selectedImageId={selectedImageId} onSelectImage={setSelectedImageId} onRemoveImage={id => setImages(prev => prev.filter(img => img.id !== id))}
                onClearAll={() => {setImages([]); setSelectedImageId(null);}} onCropClick={id => setCroppingTarget({ id, type: 'original' })} isLoading={isOriginalImageLoading} language={language}
              />
              <button onClick={handleGenerateClick} disabled={isLoading || images.length === 0 || (!selectedStyle && !customStylePrompt.trim() && !isBlendMode && !styleReferenceImage)} className="w-full py-4 mt-6 bg-[#4A6B5D] text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50">
                {isLoading ? <LoadingSpinner /> : (language === 'vi' ? "Chuyển đổi ngay" : "Convert Now")}
              </button>
              {error && <p className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm font-bold">{error}</p>}
            </section>
            <section className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200">
                <ColorAdjustmentSliders vibrancy={vibrancy} onVibrancyChange={setVibrancy} mood={mood} onMoodChange={setMood} />
                <AspectRatioSelector selectedValue={aspectRatio} onChange={setAspectRatio} />
            </section>
            <section className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200">
                <StylePresets presets={presets} onSave={n => setPresets(prev => [...prev, { id: `p_${Date.now()}`, name: n, styleId: selectedStyle?.id || null, customStylePrompt, styleInfluence: 70, vibrancy, mood, aspectRatio }])} onApply={p => { setSelectedStyle(artStyles.find(s => s.id === p.styleId) || null); setCustomStylePrompt(p.customStylePrompt); setVibrancy(p.vibrancy); setMood(p.mood); setAspectRatio(p.aspectRatio); }} onDelete={id => setPresets(prev => prev.filter(p => p.id !== id))} isSaveEnabled={!!(selectedStyle || customStylePrompt)} styles={artStyles} language={language} />
            </section>
          </div>

          <div className="lg:col-span-4">
             <section className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
                <h2 className="text-lg font-black mb-3 text-gray-600 uppercase tracking-tighter">2. CHỌN HOẶC MÔ TẢ PHONG CÁCH</h2>
                <div className="flex items-center gap-6 mb-4 px-1">
                   <label className="flex items-center cursor-pointer select-none group">
                      <div className="relative">
                        <input type="checkbox" checked={isBatchMode} onChange={() => setIsBatchMode(!isBatchMode)} className="sr-only" />
                        <div className={`block w-10 h-5 rounded-full transition-colors ${isBatchMode ? 'bg-[#4A6B5D]' : 'bg-[#ced4da]'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform transform ${isBatchMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-[#4A6B5D] transition-colors">Hàng loạt</span>
                   </label>
                   <label className="flex items-center cursor-pointer select-none group">
                      <div className="relative">
                        <input type="checkbox" checked={isBlendMode} onChange={() => setIsBlendMode(!isBlendMode)} className="sr-only" />
                        <div className={`block w-10 h-5 rounded-full transition-colors ${isBlendMode ? 'bg-[#4A6B5D]' : 'bg-[#ced4da]'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform transform ${isBlendMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-bold text-gray-700 group-hover:text-[#4A6B5D] transition-colors">Hòa trộn</span>
                   </label>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-grow">
                        <StyleSearch value={styleSearchTerm} onChange={setStyleSearchTerm} />
                    </div>
                    <button 
                        type="button"
                        onClick={() => setShowTrash(!showTrash)}
                        className={`p-2 rounded-xl transition-all border-2 flex items-center justify-center min-w-[44px] min-h-[44px] relative ${showTrash ? 'bg-red-500 border-red-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm'} ${deletedStyles.length > 0 && !showTrash ? 'animate-pulse' : ''}`}
                        title={language === 'vi' ? 'Thùng rác' : 'Trash bin'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deletedStyles.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                {deletedStyles.length}
                            </span>
                        )}
                    </button>
                </div>

                <FolderManager folders={styleFolders} onCreateFolder={n => setStyleFolders([...styleFolders, { id: `f_${Date.now()}`, name: n }])} onDeleteFolder={id => setStyleFolders(styleFolders.filter(f => f.id !== id))} onRenameFolder={(id, n) => setStyleFolders(styleFolders.map(f => f.id === id ? { ...f, name: n } : f))} language={language} />
                
                {showTrash ? (
                    <div className="animate-in fade-in zoom-in duration-200">
                        <DeletedStyles 
                            deletedStyles={deletedStyles} 
                            onRestore={id => {
                                setArtStyles(prev => prev.map(s => s.id === id ? { ...s, isDeleted: false } : s));
                                showToast(language === 'vi' ? 'Đã khôi phục phong cách' : 'Style restored');
                            }}
                            onRestoreAll={() => {
                                setArtStyles(prev => prev.map(s => ({ ...s, isDeleted: false })));
                                showToast(language === 'vi' ? 'Đã khôi phục tất cả' : 'All styles restored');
                            }}
                            onPermanentlyDelete={id => {
                                setArtStyles(prev => prev.filter(s => s.id !== id));
                                showToast(language === 'vi' ? 'Đã xóa vĩnh viễn' : 'Permanently deleted', 'error');
                            }}
                            language={language}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowTrash(false)}
                            className="w-full mt-4 py-2 text-xs font-bold text-[#4A6B5D] bg-[#4A6B5D]/10 rounded-xl hover:bg-[#4A6B5D]/20 transition-all"
                        >
                            {language === 'vi' ? 'Quay lại danh sách phong cách' : 'Back to styles'}
                        </button>
                    </div>
                ) : (
                    <StyleSelector 
                        styles={visibleArtStyles} selectedStyle={selectedStyle} styleFolders={styleFolders}
                        onStyleSelect={handleStyleSelect} onStylePreview={setPreviewingStyle} 
                        onStyleDelete={id => {
                            const styleToTrash = artStyles.find(s => s.id === id);
                            const name = language === 'vi' ? (styleToTrash?.label_vi || styleToTrash?.label) : styleToTrash?.label;
                            if (window.confirm(language === 'vi' ? `Bạn có chắc muốn đưa phong cách "${name}" vào thùng rác không?` : `Are you sure you want to move "${name}" to trash?`)) {
                                setArtStyles(prev => prev.map(s => s.id === id ? { ...s, isDeleted: true } : s));
                                if (selectedStyle?.id === id) setSelectedStyle(null);
                                showToast(language === 'vi' ? 'Đã chuyển vào thùng rác' : 'Moved to trash');
                            }
                        }}
                        onStyleEdit={setEditingStyle} onSetRating={(id, r) => setArtStyles(prev => prev.map(s => s.id === id ? { ...s, rating: r } : s))}
                        onMoveStyleToFolder={(sId, fId) => setArtStyles(prev => prev.map(s => s.id === sId ? { ...s, folderId: fId } : s))}
                        onSelectAll={() => {}} onDeselectAll={() => {}} language={language}
                        isBlendMode={isBlendMode} isBatchMode={isBatchMode}
                        blendStyleA={blendStyleA} blendStyleB={blendStyleB}
                        onBlendStyleSelect={handleBlendStyleSelect}
                        batchSelectedIds={batchSelectedStyleIds}
                        onBatchStyleToggle={handleBatchStyleToggle}
                    />
                )}

                <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                  <CustomStyleInput 
                    value={customStylePrompt} 
                    onChange={setCustomStylePrompt} 
                    language={language} 
                    isModifierMode={!!selectedStyle}
                    styleName={selectedStyle ? (language === 'vi' ? selectedStyle.label_vi : selectedStyle.label) : undefined}
                  />
                  <StyleReferenceUploader styleReferenceImage={styleReferenceImage} onImageUpload={f => { const r = new FileReader(); r.onload = (e) => setStyleReferenceImage(e.target?.result as string); r.readAsDataURL(f); }} onImageClear={() => setStyleReferenceImage(null)} language={language} />
                </div>
             </section>
          </div>

          <div className="lg:col-span-5">
             <section className="bg-white/40 p-4 rounded-2xl shadow-inner min-h-[600px] border border-gray-100 h-full">
               <ResultDisplay 
                 originalImage={originalImage} generatedImage={generatedImage} styleReferenceImage={styleReferenceImage} selectedStyle={selectedStyle} customStylePrompt={customStylePrompt}
                 isLoading={isLoading} progress={progress} adjustments={adjustments} onAdjustmentChange={(k, v) => setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, adjustments: { ...img.adjustments, [k]: v } } : img))}
                 isPreviewing={false} animatedVideoUrl={selectedImage?.animatedVideoUrl || null} isAnimating={isAnimating} onAnimate={handleAnimate} isEditing={isEditing} editPrompt={editPrompt} onEditPromptChange={setEditPrompt}
                 onEditTextFileUpload={() => {}} onEdit={() => {}} onCrop={() => setCroppingTarget({ id: selectedImageId!, type: 'generated' })} onUndo={() => setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, historyIndex: Math.max(0, img.historyIndex - 1) } : img))} onRedo={() => setImages(prev => prev.map(img => img.id === selectedImageId ? { ...img, historyIndex: Math.min(img.history.length - 1, img.historyIndex + 1) } : img))} canUndo={selectedImage ? selectedImage.historyIndex > 0 : false} canRedo={selectedImage ? selectedImage.historyIndex < selectedImage.history.length - 1 : false} isUpscaling={isUpscaling} onUpscale={handleUpscale}
                 rateLimitCooldown={rateLimitCooldown} onCommitSliderAdjustments={() => {}} onRotate={() => {}} onFlip={() => {}} onResetAdjustments={() => {}} onUndoAdjustment={() => {}} onRedoAdjustment={() => {}}
                 canUndoAdjustment={false} canRedoAdjustment={false} isBatchMode={isBatchMode} isBatchProcessing={isBatchProcessing} batchProgress={batchProgress} batchResults={batchResults}
                 allArtStyles={artStyles} onClearBatchResults={() => { setBatchResults([]); setIsBatchMode(false); }} isParsingFile={false} editReferenceImages={[]} isEditReferenceLoading={false} onEditReferenceImageUpload={() => {}}
                 onClearEditReferenceImage={() => {}} language={language}
                 onSaveReferenceStyle={() => setShowSaveModal(true)}
                 hasReferenceStyleToSave={hasStyleRefResult}
               />
             </section>
          </div>
        </div>
        <ImageGallery images={galleryImages} onRemoveImage={id => setGalleryImages(prev => prev.filter(img => img.id !== id))} onClearAll={() => { if(window.confirm(language === 'vi' ? 'Xóa toàn bộ ảnh?' : 'Clear all gallery?')) setGalleryImages([]); }} language={language} />
      </main>
      <Footer />
      {croppingTarget && (
        <ImageCropperModal 
          imageUrl={croppingTarget.type === 'original' 
            ? images.find(img => img.id === croppingTarget.id)?.originalData || '' 
            : images.find(img => img.id === croppingTarget.id)?.history[images.find(img => img.id === croppingTarget.id)?.historyIndex || 0] || ''} 
          aspectRatio={aspectRatio} onCancel={() => setCroppingTarget(null)} 
          onCropComplete={url => { 
            if (croppingTarget.type === 'original') { 
              setImages(prev => prev.map(img => img.id === croppingTarget.id ? { ...img, originalData: url, history: [url], historyIndex: 0 } : img)); 
            } else { 
              setImages(prev => prev.map(img => img.id === croppingTarget.id ? { ...img, history: [...img.history, url], historyIndex: img.history.length } : img)); 
            } 
            setCroppingTarget(null); 
          }} 
        />
      )}
      {showSaveModal && (
        <SaveStyleModal 
            folders={styleFolders} 
            onClose={() => setShowSaveModal(false)} 
            onSave={handleSaveStyle} 
            language={language} 
        />
      )}
      {previewingStyle && (
        <StylePreviewModal 
            style={previewingStyle} 
            onClose={() => setPreviewingStyle(null)} 
            onPreviewGenerated={handlePreviewGenerated} 
            language={language}
        />
      )}
      {editingStyle && <EditStyleModal style={editingStyle} onClose={() => setEditingStyle(null)} onSave={(id, n, p) => setArtStyles(prev => prev.map(s => s.id === id ? {...s, label: n, label_vi: n, prompt: p} : s))} language={language} />}
    </div>
  );
}
