# dh-monster-lib

Статический каталог монстров: данные в YAML в репозитории, сайт на **GitHub Pages** (Vite + TypeScript).

**Node.js:** для локальной разработки и CI используйте **Node.js 24** (см. `.nvmrc` и поле `engines` в `package.json`). Если у вас другая версия, `npm` может вывести предупреждение `EBADENGINE` — переключитесь на 24 (например `nvm use` в корне репозитория после установки Node 24).

## Данные

- Файл **`data/monsters.yaml`** — корневой ключ **`monsters`**: массив карточек монстров в стиле **Daggerheart** (имя, тир, флейвор, мотивы, блок статов, опыт, фичи).
- У каждой записи **обязательны** поля (ключи на английском):

  | Поле | Тип | Описание |
  |------|-----|----------|
  | `id` | строка | Уникальный идентификатор в каталоге |
  | `name` | строка | Название на карточке |
  | `tier` | строка | Например `Tier 1 Solo` |
  | `flavor` | строка | Короткое описание («флейвор») |
  | `motives` | строка | Мотивы и тактики |
  | `experience` | строка | Строка опыта / чувств |
  | `stats` | объект | См. ниже |
  | `features` | массив | Хотя бы одна фича |

- **`stats`:** `difficulty` (число), `thresholds` (строка, напр. `8/15`), `hp`, `stress` (числа), `attack` — объект с полями `atk` (число, модификатор атаки), `name`, `range`, `damage` (строки).
- **`features[]`:** у каждой фичи — `name`, `type` (`passive` \| `action` \| `reaction`), `description`; опционально `cost` (число, как «Relentless (3)»).

При сборке скрипт **валидирует** схему и при ошибке завершается с ненулевым кодом. Сгенерированный **`public/monsters.json`** в git не коммитится (см. `.gitignore`); его создают `npm run dev` и `npm run build`.

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

1. Дождитесь зелёного workflow **Deploy to GitHub Pages** на вкладке Actions (сборка выполняется на **Node.js 24**).
2. Откройте URL из **Settings → Pages** (или из summary job **deploy**).
3. Убедитесь, что загружается список монстров и карточка без ошибки в консоли.

Если стили или JSON не грузятся, проверьте, что **имя репозитория** совпадает с сегментом в URL и что в CI передаётся тот же `VITE_BASE_PATH`.
