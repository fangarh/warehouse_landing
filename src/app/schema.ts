import type { PricingPlan, SiteContent } from '../types/content';
import { hasMeaningfulEmail, hasMeaningfulHref, hasMeaningfulPhone } from '../utils/contact';

function createOfferSchema(plan: PricingPlan): Record<string, unknown> {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: plan.name,
      description: plan.description,
    },
    description: plan.note ?? plan.description,
    availability: 'https://schema.org/InStock',
    priceCurrency: plan.pricing.currency,
  };

  if (typeof plan.pricing.amount === 'number') {
    offer.price = plan.pricing.amount;
  }

  return offer;
}

export function createSiteSchema(content: SiteContent): Record<string, unknown>[] {
  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SelfStorage',
    name: content.brandName,
    description: content.seo.description,
    image: content.seo.ogImage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: content.location.addressLabel,
      addressCountry: 'RU',
    },
    areaServed: content.location.addressLabel,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: content.location.coordinates.lat,
      longitude: content.location.coordinates.lng,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Аренда складских помещений в промышленном парке «Софийский»',
      itemListElement: content.pricing.plans.map(createOfferSchema),
    },
  };

  if (hasMeaningfulPhone(content.contact.phone)) {
    organization.telephone = content.contact.phone;
  }

  if (hasMeaningfulEmail(content.contact.email)) {
    organization.email = content.contact.email;
  }

  const sameAs = content.contact.messengers
    .flatMap((messenger) => (hasMeaningfulHref(messenger.href) ? [messenger.href] : []));

  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  return [
    organization,
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: content.brandName,
      description: content.seo.description,
      inLanguage: 'ru-RU',
    },
  ];
}

export function injectSchemaMarkup(content: SiteContent): void {
  const scriptId = 'site-schema';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(createSiteSchema(content));
}