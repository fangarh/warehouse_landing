import type { SiteSeo } from '../types/content';

function upsertMeta(
  selector: `meta[name="${string}"]` | `meta[property="${string}"]`,
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function applySeoMetadata(seo: SiteSeo): void {
  document.title = seo.title;

  upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.ogTitle);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.ogDescription);
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', seo.ogImage);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
}
