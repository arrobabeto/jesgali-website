# ADR-004: Tailwind CSS para estilos

**Estado:** ✅ Aceptada
**Fecha:** 2025-06

---

## Contexto

Se necesita un sistema de estilos consistente, mantenible y con buen rendimiento para el sitio.

## Decisión

Usar **Tailwind CSS 3** procesado por PostCSS durante el build de Astro.

Desde la migración a Astro 6 del 2026-06-08, se retiró `@astrojs/tailwind` porque no declara compatibilidad con esa línea de Astro. Tailwind permanece en la versión mayor 3 y usa `postcss.config.cjs` con `autoprefixer`.

## Razones

- Configuración estable y compatible con Astro 6 sin migrar a Tailwind 4
- Purge automático de CSS no utilizado: el CSS final pesa muy poco
- Consistencia visual a través de utilidades predefinidas
- Alta velocidad de desarrollo (sin cambiar entre archivos CSS)

## Consecuencias

| | Detalle |
|-|---------|
| ✅ | CSS de producción mínimo (solo clases usadas en el HTML generado) |
| ✅ | Sin archivos `.css` separados que mantener |
| ✅ | Design tokens en una sola fuente: `src/styles/tokens.css`. `tailwind.config.mjs` solo expone un puente semántico que referencia esos tokens (`var(--…)`). Ver **ADR-006**. |
| ⚠️ | Tailwind 3 queda en modo de mantenimiento; una migración futura a Tailwind 4 debe validarse visualmente |
| ⚠️ | `var()` en colores de Tailwind 3 no admite `<alpha-value>`: las utilidades de opacidad (`bg-accent/50`) no aplican; usar OKLCH directo para transparencias |
