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
          <span className="section-heading__eyebrow">Объект для бизнеса</span>
          <h2>{premises.title}</h2>
          <p>{premises.intro}</p>
        </div>

        <p className="mobile-swipe-hint">Свайпните по панелям, чтобы посмотреть площади, схему и варианты размещения</p>

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
                Комплекс, в котором можно быстро запустить склад, производство или логистическую базу в одной локации.
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
            <p className="premises-block__summary-kicker">Гибкая аренда без лишних метров</p>
            <h3>Выбирайте формат под задачу, а не под ограничения типового склада</h3>
            <p className="premises-block__summary-text">
              Можно зайти с частью площади, арендовать отдельный корпус или собрать связку из помещений и открытой площадки.
              Это удобно, когда бизнесу нужен не абстрактный метраж, а рабочая конфигурация под реальные процессы.
            </p>

            <ul className="premises-block__utility-list">
              <li>Отдельные здания для самостоятельного запуска площадки</li>
              <li>Часть корпуса под склад, производство, сборку или запас</li>
              <li>Мини-склады и небольшие площади для быстрого старта</li>
              <li>Открытые площадки 5 500 м² под технику, хранение и маневровые задачи</li>
            </ul>

            <a
              className="button-link button-link--primary premises-block__summary-cta"
              href="#contact"
              onClick={(event) => handleAnchorNavigation(event, '#contact')}
            >
              Подобрать формат и согласовать просмотр
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
              Схема помогает быстро обсудить размещение, подъезды и распределение площадей под вашу задачу. Текущая
              визуализация показывает посадку объекта; финальные цвета могут незначительно отличаться, для здания 1
              предусмотрена синяя кровля.
            </figcaption>
          </figure>

          <div className="premises-block__specs surface-panel">
            <p className="premises-block__summary-kicker">Что получает арендатор</p>
            <h3>Параметры, на которые можно опираться при подборе</h3>
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