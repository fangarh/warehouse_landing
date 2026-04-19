/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_YANDEX_MAPS_API_KEY?: string;
}

type YandexMapCoordinates = [number, number];

interface YandexMapInstance {
  geoObjects: {
    add: (object: unknown) => void;
  };
  behaviors: {
    disable: (name: string | string[]) => void;
  };
  destroy: () => void;
}

interface YandexMapsApi {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    state: {
      center: YandexMapCoordinates;
      zoom: number;
      controls?: string[];
    },
    options?: Record<string, unknown>,
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: YandexMapCoordinates,
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => unknown;
}

interface Window {
  ymaps?: YandexMapsApi;
  __warehouseYandexMapsPromise__?: Promise<YandexMapsApi>;
}