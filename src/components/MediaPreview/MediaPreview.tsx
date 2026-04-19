import type { CSSProperties } from 'react';
import './MediaPreview.css';
import type { MediaAsset } from '../../types/media';

type MediaPreviewProps = {
  items: MediaAsset[];
  activeIndex?: number;
  transitionMs?: number;
  className?: string;
  priorityFirst?: boolean;
  zoomActive?: boolean;
};

export function MediaPreview({
  items,
  activeIndex = 0,
  transitionMs = 900,
  className = '',
  priorityFirst = false,
  zoomActive = false,
}: MediaPreviewProps) {
  const style = {
    '--media-transition-duration': `${transitionMs}ms`,
  } as CSSProperties;

  return (
    <div className={`media-preview ${className}`.trim()} style={style}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <img
            key={item.id}
            alt={isActive ? item.alt : ''}
            aria-hidden={isActive ? undefined : true}
            className={`media-preview__image${isActive ? ' is-active' : ''}${zoomActive && isActive ? ' is-zoomed' : ''}`}
            decoding="async"
            fetchPriority={priorityFirst && index === 0 ? 'high' : 'auto'}
            height={item.height}
            loading={priorityFirst && index === 0 ? 'eager' : 'lazy'}
            sizes={item.sizes}
            src={item.src}
            srcSet={item.srcSet}
            width={item.width}
          />
        );
      })}
    </div>
  );
}
