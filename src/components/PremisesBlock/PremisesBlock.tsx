import './PremisesBlock.css';
import { appConfig } from '../../app/config';
import type { ScrollMediaStoryContent, SiteContent } from '../../types/content';
import { handleAnchorNavigation } from '../../utils/scroll';

type PremisesBlockProps = {
  premises: SiteContent['premises'];
  story?: ScrollMediaStoryContent;
};

export function PremisesBlock({ premises, story }: PremisesBlockProps) {
  const storySteps = appConfig.features.enableScrollStory && story ? story.steps : [];
  const visualHighlights = storySteps
    .slice(0, 3)
    .map((step) => step.highlights?.[0] ?? step.title)
    .filter(Boolean);

  return (
    <section className="premises-block section-shell" id="premises">
      <div className="container">
        <div className="section-heading premises-block__heading">
          <span className="section-heading__eyebrow">Объект и формат</span>
          <h2>{premises.title}</h2>
          <p>{premises.intro}</p>
        </div>

        <p className="mobile-swipe-hint">Свайпните по панелям, чтобы посмотреть фото, сценарии и параметры склада</p>

        <div className="premises-block__showcase">
          <figure className="premises-block__hero surface-panel">
            <img
              alt={premises.mainImage.alt}
              decoding="async"
              height={premises.mainImage.height}
              loading="lazy"
              sizes={premises.mainImage.sizes}
              src={premises.mainImage.src}
              srcSet={premises.mainImage.srcSet}
              width={premises.mainImage.width}
            />
            <figcaption className="premises-block__hero-caption">
              <p className="premises-block__hero-lead">
                Склад под сервис, монтаж и выездные работы, где запас, загрузка и подготовка бригад собраны в одной точке.
              </p>
              {visualHighlights.length > 0 ? (
                <ul className="premises-block__hero-highlights">
                  {visualHighlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </figcaption>
          </figure>

          <aside className="premises-block__summary surface-panel">
            <p className="premises-block__summary-kicker">Склад под рабочий ритм сервиса</p>
            <h3>Одна база для инструмента, расходников, запчастей и ежедневной загрузки машин</h3>
            <p className="premises-block__summary-text">
              Блок собран не как каталог помещения, а как понятный сервисный сценарий: где хранится запас, как комплектуется выезд,
              как пополняются расходники и насколько быстро бригада стартует на объект.
            </p>

            <ul className="premises-block__utility-list">
              <li>Комплектация бригад перед выездом на объект</li>
              <li>Хранение инструмента, расходников, крепежа и запчастей</li>
              <li>Пополнение запаса между заявками без хаоса в офисе</li>
              <li>Ежедневная загрузка сервисных и грузовых машин</li>
            </ul>

            <a
              className="button-link button-link--primary premises-block__summary-cta"
              href="#contact"
              onClick={(event) => handleAnchorNavigation(event, '#contact')}
            >
              Запросить просмотр склада
            </a>
          </aside>
        </div>

        {storySteps.length > 0 ? (
          <div className="premises-block__workflow">
            {storySteps.map((step) => (
              <article className="premises-block__workflow-card surface-panel" key={step.id}>
                {step.eyebrow ? <span className="premises-block__workflow-label">{step.eyebrow}</span> : null}
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        ) : null}

        <div className="premises-block__support">
          <figure className="premises-block__plan surface-panel">
            <img
              className="premises-block__plan-image"
              alt={premises.floorPlanImage.alt}
              decoding="async"
              height={premises.floorPlanImage.height}
              loading="lazy"
              sizes={premises.floorPlanImage.sizes}
              src={premises.floorPlanImage.src}
              srcSet={premises.floorPlanImage.srcSet}
              width={premises.floorPlanImage.width}
            />
            <figcaption>
              Планировка помогает заранее обсудить зоны хранения, путь загрузки и место под подготовку выездов без длинных
              согласований на просмотре.
            </figcaption>
          </figure>

          <div className="premises-block__specs surface-panel">
            <p className="premises-block__summary-kicker">Для бизнеса</p>
            <h3>Ключевые параметры склада</h3>
            <dl>
              {premises.specs.map((spec) => (
                <div className="premises-block__spec-row" key={spec.id}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
