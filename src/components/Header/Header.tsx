import { useState } from 'react';
import './Header.css';
import type { NavigationLink, SectionCta } from '../../types/content';
import { handleAnchorNavigation } from '../../utils/scroll';

type HeaderProps = {
  brandName: string;
  navigation: NavigationLink[];
  primaryCta: SectionCta;
};

export function Header({ brandName, navigation, primaryCta }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <button className="site-header__brand" type="button" onClick={handleBrandClick}>
          <span aria-hidden="true" className="site-header__brand-mark" />
          <span className="site-header__brand-copy">
            <span className="site-header__brand-label">{brandName}</span>
            <span className="site-header__brand-tagline">Последняя миля - наша зона ответственности</span>
          </span>
        </button>

        <button
          aria-controls="site-header-panel"
          aria-expanded={isMenuOpen}
          className="site-header__toggle"
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="visually-hidden">Открыть навигацию</span>
          <span />
          <span />
          <span />
        </button>

        <div className={`site-header__panel${isMenuOpen ? ' is-open' : ''}`} id="site-header-panel">
          <nav aria-label="Основная навигация" className="site-header__nav">
            {navigation.map((link) => (
              <a
                key={link.id}
                className="site-header__nav-link"
                href={link.href}
                onClick={(event) => {
                  handleAnchorNavigation(event, link.href);
                  setIsMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className="button-link button-link--primary site-header__cta"
            href={primaryCta.href}
            onClick={(event) => {
              handleAnchorNavigation(event, primaryCta.href);
              setIsMenuOpen(false);
            }}
          >
            {primaryCta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
