import { useEffect, useState } from 'react';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { AdvantagesBlock } from './components/AdvantagesBlock/AdvantagesBlock';
import { ContactBlock } from './components/ContactBlock/ContactBlock';
import { HeroBlock } from './components/HeroBlock/HeroBlock';
import { LocationBlock } from './components/LocationBlock/LocationBlock';
import { PremisesBlock } from './components/PremisesBlock/PremisesBlock';
import { PricingBlock } from './components/PricingBlock/PricingBlock';
import { injectSchemaMarkup } from './app/schema';
import { applySeoMetadata } from './app/seo';
import { getSiteContent } from './services/contentService';
import type { SiteContent } from './types/content';

export default function App() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    getSiteContent()
      .then((response) => {
        if (!active) {
          return;
        }
        setContent(response);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!content) {
      return;
    }
    applySeoMetadata(content.seo);
    injectSchemaMarkup(content);
  }, [content]);

  if (status === 'loading' || !content) {
    return (
      <div className="page-loading">
        <div className="page-loading__box">
          <h1>Открываем страницу аренды склада в промышленном парке «Софийский»</h1>
          <p>Загружаем фото объекта, форматы аренды и информацию по расположению.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page-error">
        <div className="page-error__box">
          <h1>Не удалось открыть страницу склада</h1>
          <p>Обновите страницу немного позже. Сейчас не получилось загрузить данные по объекту.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Перейти к основному содержанию
      </a>
      <Header brandName={content.brandName} navigation={content.navigation} primaryCta={content.hero.primaryCta} />
      <main className="page-main" id="main-content">
        <HeroBlock content={content.hero} />
        <AdvantagesBlock content={content.advantages} />
        <PremisesBlock premises={content.premises} story={content.objectStory} />
        <PricingBlock content={content.pricing} />
        <LocationBlock content={content.location} />
        <ContactBlock content={content.contact} />
      </main>
      <Footer brandName={content.brandName} content={content.contact} smallPrint={content.footer.smallPrint} />
    </div>
  );
}