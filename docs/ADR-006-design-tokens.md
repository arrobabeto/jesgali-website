# ADR-006: Design tokens — fuente única de verdad

**Estado:** ✅ Aceptada
**Fecha:** 2026-06-08
**Reemplaza parcialmente:** ADR-004 (sección "tokens en tailwind.config")

---

## Contexto

Existían **tres representaciones divergentes** de los design tokens:

1. `global.css` `:root` — la única fuente realmente importada (escala de tipo fluida con `clamp()`).
2. `tokens.css` (raíz del repo) — **huérfano**, nunca importado, con una escala de tipo **estática** que no coincidía con la viva.
3. `tailwind.config.mjs` `theme.extend` — rampas `brand/accent/slate/paper/ink` con ~30 literales OKLCH duplicados, además de `fontFamily`, `maxWidth`, `letterSpacing`.

Auditoría de uso: las rampas de color de Tailwind y las utilidades `font-display`/`font-sans`/`max-w-prose`/`tracking-tightish` tenían **0 usos**. El sitio consume los tokens vía variables CSS (`var(--…)`). Las tres fuentes habían driftado.

## Decisión

**`src/styles/tokens.css` es la ÚNICA fuente de verdad de los design tokens.**

- Los tokens se definen **solo** en `src/styles/tokens.css` (`:root`).
- `global.css` lo importa (`@import './tokens.css';` antes de `@tailwind`) y ya **no** declara `:root`.
- `tailwind.config.mjs` **no** redefine valores: expone un **puente semántico** que referencia los tokens (`accent: 'var(--color-accent)'`, etc.). Las rampas muertas y los literales OKLCH se eliminaron.
- Los valores canónicos son los que ya se renderizaban (escala fluida). La escala estática del `tokens.css` huérfano se descartó.
- Los literales OKLCH repetidos fuera del canon se sustituyeron por tokens semánticos: `--color-on-dark`, `--color-hairline-dark`, `--color-scrim`, `--shadow-modal`.
- Se eliminaron tokens muertos (0 usos): `--text-4xl`, `--text-xs/sm/base`, `--space-xs/sm/md`, `--radius-sm/lg`, `--dur-fast`, `--ease-in`, `--ease-in-out`.

## Nomenclatura, propiedad y proceso

- **Nomenclatura:** `--<categoría>-<rol>[-<variante>]`. Categorías: `color`, `text`, `space`, `rule`, `radius`, `dur`, `ease`, `font`, `shadow`. Roles **semánticos**, no por valor (`--color-accent-deep`, no `--color-clay-700`).
- **Propiedad:** prohibido redeclarar `:root`/tokens en otro archivo; prohibido repetir literales OKLCH/hex en plantillas → crear un token.
- **Añadir un token:** (1) decláralo en `src/styles/tokens.css`; (2) si Tailwind debe exponerlo, añade el alias `var(--…)` en `tailwind.config.mjs`; (3) consúmelo vía `var(--…)`; (4) nunca dupliques el valor.

## Consecuencias

| | Detalle |
|-|---------|
| ✅ | Una sola fuente; imposible que las tres copias vuelvan a divergir |
| ✅ | Tailwind queda conectado al canon vía `var(--…)` |
| ✅ | Sin tokens muertos ni literales OKLCH repetidos fuera del canon |
| ⚠️ | Tailwind 3 + `var()` en colores **no** admite `<alpha-value>`: utilidades de opacidad (`bg-accent/50`) no aplican. Las transparencias se manejan con OKLCH directo en CSS (p. ej. `--color-scrim`). |
| ⚠️ | Los grises de un solo uso del hero oscuro de `index.astro` se dejaron como literales locales (tokenizarlos no reduce duplicación); posible seguimiento. |

## Verificación

- `:root` aparece **una sola vez** en `src/` y en el CSS generado.
- Escala de tipo fluida presente; la estática divergente ausente.
- `grep` de los literales tokenizados en `src/` → 0 (salvo sus definiciones en `tokens.css`).
- Build 22 páginas, `npm run test` 35/35, `npx astro check` 0 errores. Paridad visual confirmada (capturas A/B).
