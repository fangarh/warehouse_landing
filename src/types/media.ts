type BaseMediaAsset = {
  id: string;
  alt: string;
  width?: number;
  height?: number;
  objectPosition?: string;
  srcSet?: string;
  sizes?: string;
  mobileSrc?: string;
};

export type ImageMediaAsset = BaseMediaAsset & {
  type: 'image';
  src: string;
};

export type VideoMediaAsset = BaseMediaAsset & {
  type: 'video';
  src: string;
  poster?: string;
  preload?: 'auto' | 'metadata' | 'none';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
};

export type MediaAsset = ImageMediaAsset | VideoMediaAsset;

export type HeroMediaConfig = {
  mode: 'static' | 'fade-sequence';
  items: MediaAsset[];
  transition?: {
    intervalMs: number;
    durationMs: number;
    enableZoom: boolean;
  };
};

export type StoryStep = {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  media: MediaAsset;
  highlights?: string[];
};