## Why

Среда выполнения Node.js 20 перестаёт соответствовать ожиданиям платформы GitHub (поддержка версий на раннерах и рекомендации `actions/setup-node`), из‑за чего CI и локальная разработка расходятся с актуальной линейкой. Переход на **Node.js 24** выравнивает пайплайн и снижает риск неожиданных сбоев или предупреждений при сборке.

## What Changes

- Обновить **`actions/setup-node`** в GitHub Actions: **`node-version: "24"`** (вместо `"20"`).
- Зафиксировать ожидаемую версию Node для контрибьюторов: **`engines`** в `package.json` и/или **`.nvmrc`** с `24`.
- Обновить **README**: минимальная/рекомендуемая версия Node для локальной работы.

## Capabilities

### New Capabilities

- `nodejs-toolchain`: Требования к версии Node.js для CI и для разработчиков репозитория (согласованность GitHub Actions и локального окружения).

### Modified Capabilities

- *(в каталоге `openspec/specs/` нет заархивированных capability — изменений существующих спецификаций нет.)*

## Impact

- `.github/workflows/deploy-pages.yml`
- `package.json` (поле `engines`, при необходимости)
- новый файл `.nvmrc` (опционально, но рекомендуется)
- `README.md`
- `package-lock.json` после `npm install` под Node 24 (если lock пересоздаётся)
