import { appConfig } from '../../app/config';
import type { LocationContent } from '../../types/content';
import './LocationBlock.css';

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
            color: #12202c;
            background: linear-gradient(135deg, #e6edf2 0%, #ccd9e2 100%);
          }
          .card {
            width: min(92%, 420px);
            padding: 24px;
            border-radius: 20px;
            background: rgba(245, 248, 250, 0.9);
            box-shadow: 0 18px 40px rgba(16, 32, 45, 0.16);
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
          <p>Если встроенная карта не открылась, используйте адрес и координаты объекта для построения маршрута в Яндекс Картах.</p>
          <strong>${content.addressLabel}</strong>
          <p>${content.coordinates.lat.toFixed(6)}, ${content.coordinates.lng.toFixed(6)}</p>
        </div>
      </body>
    </html>
  `;
}

function buildYandexMapsUrl(content: LocationContent): string {
  return `https://yandex.ru/maps/?ll=${content.coordinates.lng},${content.coordinates.lat}&z=${appConfig.yandexMaps.zoom}&pt=${content.coordinates.lng},${content.coordinates.lat},pm2rdm&text=${encodeURIComponent(content.addressLabel)}`;
}

type LocationBlockProps = {
  content: LocationContent;
};

export function LocationBlock({ content }: LocationBlockProps) {
  const previewCaption =
    content.previewCaption ??
    'Подъезд к объекту в промышленном парке «Софийский» удобен для сервисных машин, регулярного пополнения запаса и коротких маршрутов по Санкт-Петербургу.';

  return (
    <section className="location-block section-shell" id="location">
      <div className="container">
        <div className="location-block__overview">
          {content.previewImage ? (
            <div className="location-block__preview surface-panel">
              <img
                alt={content.previewImage.alt}
                decoding="async"
                height={content.previewImage.height}
                loading="lazy"
                sizes={content.previewImage.sizes}
                src={content.previewImage.src}
                srcSet={content.previewImage.srcSet}
                width={content.previewImage.width}
              />
            </div>
          ) : null}

          <div className="location-block__details surface-panel">
            <span className="section-heading__eyebrow">Расположение</span>
            <h2>{content.title}</h2>
            <p className="location-block__description">{content.description}</p>
            <p className="location-block__caption">{previewCaption}</p>

            <div className="location-block__address" aria-label="Адрес объекта">
              <span>Адрес объекта</span>
              <strong>{content.addressLabel}</strong>
              <p>
                {content.coordinates.lat.toFixed(6)}, {content.coordinates.lng.toFixed(6)}
              </p>
            </div>

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
          <iframe
            allowFullScreen
            id="location-map-shell"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={content.mapEmbedUrl || undefined}
            srcDoc={content.mapEmbedUrl ? undefined : buildMapFallback(content)}
            title={`Яндекс Карты: ${content.addressLabel}`}
          />
        </div>
      </div>
    </section>
  );
}
