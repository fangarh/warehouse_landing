import type { HeroMediaConfig, MediaAsset, StoryStep } from './media';

export type CtaVariant = 'primary' | 'secondary' | 'link';

export type SectionCta = {
  id: string;
  label: string;
  href: string;
  variant: CtaVariant;
};

export type SiteSeo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
};

export type NavigationLink = {
  id: string;
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  badges: string[];
  summary: string;
  primaryCta: SectionCta;
  secondaryCta: SectionCta;
  media: HeroMediaConfig;
};

export type AdvantageItem = {
  id: string;
  title: string;
  description: string;
};

export type PremisesSpec = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

export type PricingValue = {
  mode: 'fixed-from' | 'by-request';
  amount?: number;
  currency: 'RUB';
  periodLabel?: string;
  annualDiscountPercent?: number;
  note?: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  audienceLabel?: string;
  description: string;
  pricing: PricingValue;
  features: string[];
  note?: string;
  cta: SectionCta;
  highlighted?: boolean;
};

export type PricingBillingContent = {
  label: string;
  monthlyLabel: string;
  monthlyHint: string;
  yearlyLabel: string;
  yearlyHint: string;
};

export type LocationContent = {
  title: string;
  description: string;
  addressLabel: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapEmbedUrl: string;
  benefits: string[];
  previewImage?: MediaAsset;
  previewCaption?: string;
};

export type ContactContent = {
  title: string;
  description: string;
  phone: string;
  email: string;
  messengers: Array<{
    id: string;
    label: string;
    href?: string;
  }>;
  consentText: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
};

export type ScrollMediaStoryContent = {
  title: string;
  intro: string;
  steps: StoryStep[];
};

export type SiteContent = {
  brandName: string;
  navigation: NavigationLink[];
  seo: SiteSeo;
  hero: HeroContent;
  advantages: {
    title: string;
    intro: string;
    items: AdvantageItem[];
  };
  premises: {
    title: string;
    intro: string;
    mainImage: MediaAsset;
    floorPlanImage: MediaAsset;
    specs: PremisesSpec[];
  };
  objectStory?: ScrollMediaStoryContent;
  pricing: {
    title: string;
    intro: string;
    billing: PricingBillingContent;
    note: string;
    plans: PricingPlan[];
  };
  location: LocationContent;
  contact: ContactContent;
  footer: {
    smallPrint: string;
  };
};