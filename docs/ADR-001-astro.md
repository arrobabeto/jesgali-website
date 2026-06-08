# ADR-001: Astro como framework principal

**Estado:** ✅ Aceptada
**Fecha:** 2025-06

---

## Contexto

El proyecto es un sitio web corporativo con múltiples páginas, blog y SEO. No requiere interactividad compleja ni datos en tiempo real. El hosting es compartido (HostGator) y no soporta Node.js en producción.

## Decisión

Usar **Astro** con `output: 'static'` como framework de construcción.

Desde 2026-06-08, el build usa Astro 6 y requiere Node.js `>=22.12.0`. Este requisito aplica solo al entorno de desarrollo y CI; producción continúa sirviendo HTML, CSS, JavaScript e imágenes estáticos.

## Razones

- Genera HTML puro en build time: compatible con cualquier servidor Apache sin Node.js
- Excelente soporte de SEO (meta tags, sitemap, Open Graph integrados)
- Soporte nativo para Markdown y MDX (ideal para el blog)
- Islands Architecture: permite añadir interactividad solo donde se necesita (formularios, etc.)
- Sin JavaScript innecesario en el cliente por defecto

## Consecuencias

| | Detalle |
|-|---------|
| ✅ | Build produce archivos estáticos listos para cualquier servidor Apache/Nginx |
| ✅ | Performance excelente (Lighthouse scores altos) |
| ✅ | Tailwind CSS 3 procesado por PostCSS durante el build |
| ⚠️ | No soporta rutas dinámicas server-side (no requerido en este proyecto) |
| ⚠️ | El build debe ejecutarse en CI antes de cada deploy |
