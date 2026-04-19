import { appConfig } from '../app/config';

export function scrollToSection(targetId: string): void {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - appConfig.headerOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function handleAnchorNavigation(
  event: React.MouseEvent<HTMLElement>,
  href: string,
): void {
  if (!href.startsWith('#')) {
    return;
  }

  event.preventDefault();
  scrollToSection(href.slice(1));
}
