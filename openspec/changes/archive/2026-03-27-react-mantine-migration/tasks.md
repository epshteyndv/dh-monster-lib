## 1. Зависимости и конфигурация

- [x] 1.1 Добавить `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `@mantine/core`, при необходимости `@mantine/hooks`.
- [x] 1.2 Обновить `vite.config.ts`: подключить `plugin-react`, сохранить настройку `base` / `VITE_BASE_PATH`.
- [x] 1.3 Обновить `tsconfig.json` для JSX (`jsx: react-jsx`, `lib` с DOM), включить `src/**/*.tsx`.

## 2. Точка входа и провайдер

- [x] 2.1 Заменить `index.html` при необходимости (script на `src/main.tsx`).
- [x] 2.2 Создать `src/main.tsx`: импорт стилей Mantine, `MantineProvider`, `createRoot`, монтирование `<App />`.

## 3. UI приложения

- [x] 3.1 Реализовать `App` (или разбить на компоненты): загрузка `monsters.json` через `fetch` с `import.meta.env.BASE_URL`, состояния loading / error / data.
- [x] 3.2 Список монстров и панель деталей на компонентах Mantine; отображение полей записи (как минимум `id`, `name`, остальные поля).
- [x] 3.3 Ошибки и загрузка: Mantine `Loader`, `Alert` или эквивалент.

## 4. Очистка и проверка

- [x] 4.1 Удалить неиспользуемый vanilla-код (`main.ts`, старый `style.css` если не нужен).
- [x] 4.2 Запустить `npm run build` и при необходимости `VITE_BASE_PATH=/dh-monster-lib/` для проверки base path.
