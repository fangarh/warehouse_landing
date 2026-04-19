import './AdvantagesBlock.css';
import type { SiteContent } from '../../types/content';

type AdvantagesBlockProps = {
  content: SiteContent['advantages'];
};

export function AdvantagesBlock({ content }: AdvantagesBlockProps) {
  return (
    <section className="advantages-block section-shell" id="advantages">
      <div className="container">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Преимущества</span>
          <h2>{content.title}</h2>
          <p>{content.intro}</p>
        </div>

        <p className="mobile-swipe-hint">Свайпните карточки, чтобы посмотреть все преимущества</p>

        <div className="advantages-block__grid surface-panel">
          {content.items.map((item, index) => (
            <article className="advantages-block__item" key={item.id}>
              <span className="advantages-block__index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}