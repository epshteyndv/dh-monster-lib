# dh-monster-lib

Статический каталог монстров: данные в YAML в репозитории, сайт на **GitHub Pages** (Vite + TypeScript).

## Данные

- Файл **`data/monsters.yaml`** — корневой ключ **`monsters`**: массив объектов.
- У каждой записи обязательны поля:
  - **`id`** — уникальная строка в пределах каталога (дубликаты при сборке вызовут ошибку);
  - **`name`** — отображаемое имя.
- Любые дополнительные поля (например `description`, `tags`) сохраняются и показываются в карточке.

При сборке скрипт генерирует **`public/monsters.json`** (не коммитьте его — файл в `.gitignore`; он создаётся командами `npm run dev` и `npm run build`).

## Локальная разработка

```bash
npm ci
npm run dev
```

Откройте адрес из консоли Vite (обычно `http://localhost:5173/`). Каталог подгружается с того же origin (`/monsters.json`).

## Сборка с base path (как на GitHub Pages)

Для сайта вида `https://<user>.github.io/<repo>/` нужен base **`/<имя-репозитория>/`**.

Пример для репозитория `dh-monster-lib` (PowerShell):

```powershell
$env:VITE_BASE_PATH="/dh-monster-lib/"; npm run build
```

Bash:

```bash
VITE_BASE_PATH=/dh-monster-lib/ npm run build
```

Просмотр результата:

```bash
npx vite preview
```

## GitHub Pages

1. В репозитории: **Settings → Pages → Build and deployment → Source**: выберите **GitHub Actions** (не «Deploy from a branch»).
2. После успешного workflow `Deploy to GitHub Pages` сайт будет по адресу  
   `https://<user>.github.io/<repo>/`.

В workflow переменная **`VITE_BASE_PATH`** задаётся как `/${{ github.event.repository.name }}/`, чтобы совпадало с URL project pages.

## Проверка после деплоя (вручную)

После merge в `main` или `master`:

1. Дождитесь зелёного workflow **Deploy to GitHub Pages** на вкладке Actions.
2. Откройте URL из **Settings → Pages** (или из summary job **deploy**).
3. Убедитесь, что загружается список монстров и карточка без ошибки в консоли.

Если стили или JSON не грузятся, проверьте, что **имя репозитория** совпадает с сегментом в URL и что в CI передаётся тот же `VITE_BASE_PATH`.
