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
  preferStill?: boolean;
};

export function MediaPreview({
  items,
  activeIndex = 0,
  transitionMs = 900,
  className = '',
  priorityFirst = false,
  zoomActive = false,
  preferStill = false,
}: MediaPreviewProps) {
  const style = {
    '--media-transition-duration': `${transitionMs}ms`,
  } as CSSProperties;

  return (
    <div className={`media-preview ${className}`.trim()} style={style}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const itemStyle = item.objectPosition ? ({ objectPosition: item.objectPosition } as CSSProperties) : undefined;
        const mediaClassName = `${item.type === 'video' ? 'media-preview__video' : 'media-preview__image'}${
          isActive ? ' is-active' : ''
        }${zoomActive && isActive ? ' is-zoomed' : ''}`;

        if (item.type === 'video' && !(preferStill && item.poster)) {
          return (
            <video
              key={item.id}
              aria-hidden={isActive ? undefined : true}
              autoPlay={item.autoPlay ?? true}
              className={mediaClassName}
              disablePictureInPicture
              loop={item.loop ?? true}
              muted={item.muted ?? true}
              playsInline={item.playsInline ?? true}
              poster={item.poster}
              preload={priorityFirst && index === 0 ? item.preload ?? 'auto' : item.preload ?? 'metadata'}
              style={itemStyle}
              tabIndex={-1}
            >
              <source src={item.src} type="video/mp4" />
            </video>
          );
        }

        return (
          <img
            key={item.id}
            alt={isActive ? item.alt : ''}
            aria-hidden={isActive ? undefined : true}
            className={mediaClassName}
            decoding="async"
            fetchPriority={priorityFirst && index === 0 ? 'high' : 'auto'}
            height={item.height}
            loading={priorityFirst && index === 0 ? 'eager' : 'lazy'}
            sizes={item.type === 'image' ? item.sizes : undefined}
            src={item.type === 'video' ? item.poster ?? item.src : item.src}
            srcSet={item.type === 'image' ? item.srcSet : undefined}
            style={itemStyle}
            width={item.width}
          />
        );
      })}
    </div>
  );
}