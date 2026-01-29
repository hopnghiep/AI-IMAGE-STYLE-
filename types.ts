
export interface ArtStyle {
  id: string;
  label: string;
  label_vi?: string;
  prompt: string;
  // prompt_vi is used to store the Vietnamese translation of the art style prompt
  prompt_vi?: string;
  thumbnail: string;
  preview: string;
  exampleImage: string;
  referenceImage?: string; // Lưu trữ ảnh tham chiếu nếu đây là phong cách do người dùng tạo
  isDeleted?: boolean;
  isFavorite?: boolean;
  rating?: number;
  category?: string;
  folderId?: string | null;
}

export interface GalleryImage {
  id: string;
  url: string;
  styleName: string;
  prompt: string;
  timestamp: number;
  aspectRatio: string;
}

export interface Preset {
  id:string;
  name: string;
  styleId: string | null;
  customStylePrompt: string;
  styleInfluence: number;
  vibrancy: number;
  mood: number;
  aspectRatio: string;
}

export interface ImageEditorAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export interface StyleFolder {
  id: string;
  name: string;
  name_en?: string;
}
