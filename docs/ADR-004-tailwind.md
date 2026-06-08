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
| ✅ | Design tokens centralizados en `tailwind.config.mjs` (colores de marca, tipografía) |
| ⚠️ | Tailwind 3 queda en modo de mantenimiento; una migración futura a Tailwind 4 debe validarse visualmente |
| ⚠️ | Los colores de marca y tipografía deben configurarse en `tailwind.config.mjs` una vez definido el branding (**TBD**) |
