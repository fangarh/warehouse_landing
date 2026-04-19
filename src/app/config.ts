export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headerOffset: 88,
  yandexMaps: {
    apiKey: import.meta.env.VITE_YANDEX_MAPS_API_KEY ?? '',
    lang: 'ru_RU',
    zoom: 14,
  },
  features: {
    enableHeroSequence: true,
    enableScrollStory: true,
  },
} as const;