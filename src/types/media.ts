export type MediaAsset = {
  id: string;
  type: 'image';
  src: string;
  srcSet?: string;
  sizes?: string;
  mobileSrc?: string;
  alt: string;
  width?: number;
  height?: number;
};

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
