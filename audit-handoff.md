# Warehouse Landing Audit Handoff

Дата: 2026-04-19
Проект: `D:\Projects\FL\warehouse_landing`

## Статус

- Базовый аудит был снят до внесения правок.
- Итерация 1 (`Performance First`) выполнена.
- `npm run build` после изменений проходит успешно.
- Следующий этап: `Итерация 2. SEO Architecture`.

## Baseline до фиксов

### Сборка на момент аудита

- `index.html`: `1.74 kB`
- `assets/index.css`: `28.46 kB`, gzip `5.83 kB`
- `assets/index.js`: `240.60 kB`, gzip `73.76 kB`
- Суммарный вес `dist`: примерно `11.23 MB`

### Ключевые проблемные ассеты до фиксов

- `warehouse-location-road.png`: `2,622,476`
- `warehouse-storage-corridor.png`: `2,403,772`
- `warehouse-exterior.png`: `2,382,555`
- `warehouse-interior.png`: `2,344,649`
- `warehouse-floor-plan.png`: `1,200,046`
- Суммарно только эти 5 runtime-изображений: `10,953,498 bytes` (`10.45 MiB`)

### Основные выводы baseline-аудита

- Главная просадка была в media payload, а не в JS/CSS.
- Hero прогревал 2-й и 3-й кадры через `new Image()`, то есть тянул лишние запросы уже на старте.
- У runtime-изображений не было полноценной responsive-стратегии: без `srcset`, `sizes`, `width`, `height`.
- Яндекс.Карты могли начать грузиться слишком рано.
- Google Fonts подключались дважды: через `<link>` в `index.html` и `@import` в `src/index.css`.

## Что сделано в Итерации 1

### 1. Оптимизация runtime-изображений

- Тяжелые PNG выведены из runtime-пути `public/assets/images`.
- Для 5 ключевых изображений собраны runtime-варианты `768w` и `1536w` в JPEG:
  - `warehouse-exterior`
  - `warehouse-storage-corridor`
  - `warehouse-interior`
  - `warehouse-location-road`
  - `warehouse-floor-plan`
- Оригинальные PNG сохранены в каталоге `img/`, то есть не потеряны, но больше не попадают в `dist`.
- `og:image` и служебные `assetTarget` в `src/data/imagePrompts.ts` переведены на новые runtime-файлы.

### 2. Responsive image strategy

Изменены файлы:

- `src/types/media.ts`
- `src/data/siteContent.ts`
- `src/components/MediaPreview/MediaPreview.tsx`
- `src/components/PremisesBlock/PremisesBlock.tsx`
- `src/components/LocationBlock/LocationBlock.tsx`

Что сделано:

- Добавлены `srcSet`, `sizes`, `width`, `height` в модель медиа.
- Контент переведен на responsive runtime-ассеты.
- Hero, блок объекта, планировка и превью локации теперь отдают браузеру правильные размеры источников.
- Зафиксированы `width`/`height`, чтобы уменьшить риск layout shift.

### 3. Hero sequence без раннего прогрева всех кадров

Изменен файл:

- `src/components/HeroBlock/HeroBlock.tsx`

Что сделано:

- Удален eager preload 2-го и 3-го hero-кадра через `new Image()`.
- На первом рендере hero показывает только первый кадр.
- Полная fade-sequence включается только после первого взаимодействия пользователя (`pointerdown`, `keydown`, `scroll`).
- В `index.html` добавлен preload только первого hero-изображения, а не всей последовательности.

### 4. Отложенная загрузка Яндекс.Карт

Изменены файлы:

- `src/components/LocationBlock/LocationBlock.tsx`
- `src/components/LocationBlock/LocationBlock.css`

Что сделано:

- Карта больше не грузится автоматически при открытии страницы.
- Вместо этого сначала показывается placeholder с объяснением и кнопкой `Загрузить карту`.
- Third-party script/embed подключается только по явному действию пользователя.
- Ссылка `Открыть карту в Яндекс Картах` сохранена отдельно и работает без автозагрузки embed/API.

### 5. Убран дублирующий способ подключения шрифтов

Изменен файл:

- `src/index.css`

Что сделано:

- Удален `@import` Google Fonts из CSS.
- Оставлен один способ подключения шрифтов через `index.html`.

## Новые метрики после Итерации 1

### Сборка

- `index.html`: `2.00 kB`, gzip `0.89 kB`
- `assets/index.css`: `29.11 kB`, gzip `5.85 kB`
- `assets/index.js`: `242.64 kB`, gzip `74.31 kB`
- Суммарный вес `dist`: `1,666,116 bytes` (`1.59 MiB`)
- Снижение общего веса `dist` относительно baseline: примерно `85.2%`

### Runtime-изображения

- Новый суммарный вес JPEG runtime-ассетов: `1,385,639 bytes` (`1.32 MiB`)
- Снижение по этим 5 ключевым изображениям относительно baseline: примерно `87.3%`

Текущие runtime-файлы по размеру:

- `warehouse-location-road-1536.jpg`: `257,683`
- `warehouse-storage-corridor-1536.jpg`: `253,266`
- `warehouse-interior-1536.jpg`: `213,506`
- `warehouse-exterior-1536.jpg`: `191,539`
- `warehouse-floor-plan-1536.jpg`: `157,383`
- `warehouse-storage-corridor-768.jpg`: `77,979`
- `warehouse-location-road-768.jpg`: `73,393`
- `warehouse-interior-768.jpg`: `61,226`
- `warehouse-exterior-768.jpg`: `50,501`
- `warehouse-floor-plan-768.jpg`: `49,163`

### Поведенческий результат

- Первый экран больше не тянет все hero-кадры на старте.
- Карта не создает ранний third-party запрос без действия пользователя.
- Шрифты больше не запрашиваются двумя разными способами.

## Что осталось к Итерации 2

Цель следующего этапа: сделать лендинг более предсказуемым для индексации и шаринга.

### Обязательные задачи

1. Убрать искусственную асинхронность локального контента.
   - `src/App.tsx`
   - `src/services/contentService.ts`

2. Перенести минимум SEO-baseline в build-time HTML.
   - `index.html`
   - `src/app/seo.ts`

3. Добавить недостающие SEO-элементы.
   - `canonical`
   - `twitter:card`
   - нормализованный `og:url`
   - `sitemap.xml`
   - ссылка на sitemap в `public/robots.txt`

4. Проверить JSON-LD/schema.
   - `src/app/schema.ts`
   - решить, что можно зафиксировать заранее в HTML, а не инжектить только после старта клиента

### Критерии готовности Итерации 2

- Head предсказуем без ожидания клиентского эффекта.
- Страница имеет минимальный SEO-baseline уже в build-time HTML.
- Есть `sitemap.xml` и корректная ссылка на него в `robots.txt`.
- `og:url` не зависит от `window.location.href` с UTM/hash.

## Файлы, с которых логично продолжать

- `audit-handoff.md`
- `index.html`
- `src/App.tsx`
- `src/services/contentService.ts`
- `src/app/seo.ts`
- `src/app/schema.ts`
- `public/robots.txt`
- при необходимости: `src/data/siteContent.ts`

## Локальные оговорки

- `git status` без safe-directory все еще может падать из-за `dubious ownership`.
- Во время изначального аудита browser-preview полноценно не подтверждался; текущие выводы основаны на коде, сборке и размере runtime-ассетов.
- В `.playwright-mcp` лежат старые артефакты, их по-прежнему не нужно трогать без отдельной причины.
