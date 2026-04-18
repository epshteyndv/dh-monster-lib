## Why

В описаниях способностей монстров часто встречаются игровые термины **Stress** и **Fear**; сейчас они не отличаются от остального текста, из‑за чего их сложнее быстро заметить при чтении карточки в энкаунтере.

## What Changes

- В блоке **Features** для поля **`description`** каждой фичи все вхождения целых слов **Stress** и **Fear** отображаются **полужирным курсивом** (остальной текст и переносы строк — без изменений по смыслу).
- Поведение каталога, YAML и `monsters.json` не меняется (**не** BREAKING для данных).

## Capabilities

### New Capabilities

_(нет — требование дополняет существующий UI-спек.)_

### Modified Capabilities

- `github-pages-monster-ui`: нормативно зафиксировать подсветку целых слов **Stress** и **Fear** в тексте `features[].description` на карточке монстра.

## Impact

- `src/components/MonsterCard.tsx` (или вынесенный маленький хелпер/компонент для рендера описания).
- Дельта-спек: `openspec/changes/feature-description-highlight-stress-fear/specs/github-pages-monster-ui/spec.md`.
