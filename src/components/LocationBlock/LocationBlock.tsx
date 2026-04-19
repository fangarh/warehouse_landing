import { useEffect, useRef, useState } from 'react';
import { appConfig } from '../../app/config';
import type { LocationContent } from '../../types/content';
import './LocationBlock.css';

const YANDEX_MAPS_SCRIPT_ID = 'warehouse-yandex-maps-api';

function buildMapFallback(content: LocationContent): string {
  return `
    <!doctype html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            margin: 0;
            display: grid;
            place-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            color: #14212a;
            background: linear-gradient(135deg, #f6efe4 0%, #e0d5c4 100%);
          }
          .card {
            width: min(92%, 420px);
            padding: 24px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.88);
            box-shadow: 0 18px 40px rgba(19, 32, 43, 0.14);
          }
          h2 {
            margin: 0;
            font-size: 22px;
          }
          p {
            margin: 12px 0 0;
            line-height: 1.6;
          }
          strong {
            display: block;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Расположение объекта</h2>
          <p>Если интерактивная карта не открылась, используйте координаты объекта для построения маршрута в Яндекс Картах.</p>
          <strong>${content.addressLabel}</strong>
          <p>${content.coordinates.lat.toFixed(6)}, ${content.coordinates.lng.toFixed(6)}</p>
        </div>
      </body>
    </html>
  `;
}

function buildYandexMapsUrl(content: LocationContent): string {
  return `https://yandex.ru/maps/?ll=${content.coordinates.lng},${content.coordinates.lat}&z=${appConfig.yandexMaps.zoom}&pt=${content.coordinates.lng},${content.coordinates.lat},pm2rdm`;
}

function waitForYandexReady(ymaps: YandexMapsApi): Promise<void> {
  return new Promise((resolve) => {
    ymaps.ready(resolve);
  });
}

function loadYandexMapsApi(apiKey: string, lang: string): Promise<YandexMapsApi> {
  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  if (window.__warehouseYandexMapsPromise__) {
    return window.__warehouseYandexMapsPromise__;
  }

  window.__warehouseYandexMapsPromise__ = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(YANDEX_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

    const resetPromise = () => {
      window.__warehouseYandexMapsPromise__ = undefined;
    };

    const handleLoad = () => {
      if (window.ymaps) {
        resolve(window.ymaps);
        return;
      }

      resetPromise();
      reject(new Error('Yandex Maps API loaded without ymaps on window.'));
    };

    const handleExistingError = () => {
      existingScript?.remove();
      resetPromise();
      reject(new Error('Failed to load Yandex Maps API script.'));
    };

    if (existingScript) {
      if (window.ymaps) {
        resolve(window.ymaps);
        return;
      }

      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleExistingError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = YANDEX_MAPS_SCRIPT_ID;
    script.async = true;
    script.src = `https://api-maps.yandex.ru/2.1/?lang=${encodeURIComponent(lang)}&apikey=${encodeURIComponent(apiKey)}`;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener(
      'error',
      () => {
        script.remove();
        resetPromise();
        reject(new Error('Failed to load Yandex Maps API script.'));
      },
      { once: true },
    );
    document.head.append(script);
  });

  return window.__warehouseYandexMapsPromise__;
}

type LocationBlockProps = {
  content: LocationContent;
};

export function LocationBlock({ content }: LocationBlockProps) {
  const previewCaption =
    content.previewCaption ??
    'Подъезд к объекту и логистическая привязка по Колпино удобны для сервисных машин, регулярного пополнения запаса и коротких маршрутов по югу города.';
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapMode, setMapMode] = useState<'loading' | 'interactive' | 'fallback'>(
    appConfig.yandexMaps.apiKey ? 'loading' : 'fallback',
  );

  useEffect(() => {
    if (!appConfig.yandexMaps.apiKey) {
      setMapMode('fallback');
      return;
    }

    if (!mapRef.current) {
      return;
    }

    let isDisposed = false;
    let mapInstance: YandexMapInstance | null = null;

    setMapMode('loading');

    const mountMap = async () => {
      try {
        const ymaps = await loadYandexMapsApi(appConfig.yandexMaps.apiKey, appConfig.yandexMaps.lang);
        await waitForYandexReady(ymaps);

        if (isDisposed || !mapRef.current) {
          return;
        }

        mapInstance = new ymaps.Map(
          mapRef.current,
          {
            center: [content.coordinates.lat, content.coordinates.lng],
            zoom: appConfig.yandexMaps.zoom,
            controls: ['zoomControl', 'fullscreenControl'],
          },
          {
            suppressMapOpenBlock: true,
          },
        );

        const placemark = new ymaps.Placemark(
          [content.coordinates.lat, content.coordinates.lng],
          {
            balloonContentHeader: content.addressLabel,
            balloonContentBody: 'Склад под сервисные маршруты, монтаж и выездные работы',
            hintContent: content.addressLabel,
          },
          {
            preset: 'islands#redDotIcon',
          },
        );

        mapInstance.geoObjects.add(placemark);
        mapInstance.behaviors.disable('scrollZoom');
        setMapMode('interactive');
      } catch {
        if (!isDisposed) {
          setMapMode('fallback');
        }
      }
    };

    void mountMap();

    return () => {
      isDisposed = true;
      mapInstance?.destroy();
    };
  }, [content.addressLabel, content.coordinates.lat, content.coordinates.lng]);

  return (
    <section className="location-block section-shell" id="location">
      <div className="container">
        <div className="location-block__overview">
          {content.previewImage ? (
            <figure className="location-block__preview surface-panel">
              <img alt={content.previewImage.alt} loading="lazy" src={content.previewImage.src} />
            </figure>
          ) : null}

          <div className="location-block__details surface-panel">
            <span className="section-heading__eyebrow">Расположение</span>
            <h2>{content.title}</h2>
            <p className="location-block__description">{content.description}</p>
            <p className="location-block__caption">{previewCaption}</p>

            <ul className="location-block__benefits">
              {content.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <a
              className="button-link button-link--secondary-dark location-block__map-link"
              href={buildYandexMapsUrl(content)}
              rel="noreferrer"
              target="_blank"
            >
              Открыть карту в Яндекс Картах
            </a>
          </div>
        </div>

        <div className="location-block__map surface-panel">
          {mapMode === 'fallback' ? (
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={content.mapEmbedUrl || undefined}
              srcDoc={content.mapEmbedUrl ? undefined : buildMapFallback(content)}
              title={`Яндекс Карты: ${content.addressLabel}`}
            />
          ) : (
            <div className="location-block__map-shell">
              <div aria-label={`Яндекс Карты: ${content.addressLabel}`} className="location-block__map-canvas" ref={mapRef} />
              {mapMode === 'loading' ? <div className="location-block__map-loading">Загружаем карту проезда к складу</div> : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}