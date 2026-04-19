import { useEffect, useState } from 'react';
import './HeroBlock.css';
import { appConfig } from '../../app/config';
import type { HeroContent } from '../../types/content';
import { handleAnchorNavigation } from '../../utils/scroll';
import { MediaPreview } from '../MediaPreview/MediaPreview';

type HeroBlockProps = {
  content: HeroContent;
};

export function HeroBlock({ content }: HeroBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sequenceUnlocked, setSequenceUnlocked] = useState(false);
  const canAnimateSequence =
    appConfig.features.enableHeroSequence &&
    content.media.mode === 'fade-sequence' &&
    content.media.items.length > 1 &&
    !reducedMotion;
  const previewItems = canAnimateSequence && sequenceUnlocked ? content.media.items : content.media.items.slice(0, 1);
  const previewActiveIndex = canAnimateSequence && sequenceUnlocked ? activeIndex : 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);

    return () => {
      mediaQuery.removeEventListener('change', syncPreference);
    };
  }, []);

  useEffect(() => {
    if (!canAnimateSequence) {
      setSequenceUnlocked(false);
      return;
    }

    if (sequenceUnlocked) {
      return;
    }

    const unlockSequence = () => {
      setSequenceUnlocked(true);
    };

    window.addEventListener('pointerdown', unlockSequence, { once: true, passive: true });
    window.addEventListener('keydown', unlockSequence, { once: true });
    window.addEventListener('scroll', unlockSequence, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockSequence);
      window.removeEventListener('keydown', unlockSequence);
      window.removeEventListener('scroll', unlockSequence);
    };
  }, [canAnimateSequence, sequenceUnlocked]);

  useEffect(() => {
    if (!(canAnimateSequence && sequenceUnlocked)) {
      setActiveIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % content.media.items.length);
    }, content.media.transition?.intervalMs ?? 6500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canAnimateSequence, content.media.items.length, content.media.transition?.intervalMs, sequenceUnlocked]);

  return (
    <section className="hero-block" id="top">
      <div className="hero-block__media" aria-hidden="true">
        <MediaPreview
          activeIndex={previewActiveIndex}
          className="hero-block__preview"
          items={previewItems}
          priorityFirst
          transitionMs={content.media.transition?.durationMs}
          zoomActive={Boolean(content.media.transition?.enableZoom && canAnimateSequence && sequenceUnlocked)}
        />
      </div>
      <div className="hero-block__veil" />
      <div className="container hero-block__inner">
        <div className="hero-block__content">
          {content.eyebrow ? <p className="hero-block__eyebrow">{content.eyebrow}</p> : null}
          <h1>{content.title}</h1>
          <p className="hero-block__subtitle">{content.subtitle}</p>

          <ul className="hero-block__badges" aria-label="Ключевые преимущества объекта">
            {content.badges.map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
          </ul>

          <div className="hero-block__actions">
            <a
              className="button-link button-link--primary"
              href={content.primaryCta.href}
              onClick={(event) => handleAnchorNavigation(event, content.primaryCta.href)}
            >
              {content.primaryCta.label}
            </a>
            <a
              className="button-link button-link--secondary"
              href={content.secondaryCta.href}
              onClick={(event) => handleAnchorNavigation(event, content.secondaryCta.href)}
            >
              {content.secondaryCta.label}
            </a>
          </div>

          <p className="hero-block__summary">{content.summary}</p>
        </div>
      </div>
    </section>
  );
}
