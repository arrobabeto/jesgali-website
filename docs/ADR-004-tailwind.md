# ADR-004: Tailwind CSS para estilos

**Estado:** ✅ Aceptada
**Fecha:** 2025-06

---

## Contexto

Se necesita un sistema de estilos consistente, mantenible y con buen rendimiento para el sitio.

## Decisión

Usar **Tailwind CSS** integrado con Astro vía `@astrojs/tailwind`.

## Razones

- Integración oficial con Astro sin configuración manual
- Purge automático de CSS no utilizado: el CSS final pesa muy poco
- Consistencia visual a través de utilidades predefinidas
- Alta velocidad de desarrollo (sin cambiar entre archivos CSS)

## Consecuencias

| | Detalle |
|-|---------|
| ✅ | CSS de producción mínimo (solo clases usadas en el HTML generado) |
| ✅ | Sin archivos `.css` separados que mantener |
| ✅ | Design tokens centralizados en `tailwind.config.mjs` (colores de marca, tipografía) |
| ⚠️ | Los colores de marca y tipografía deben configurarse en `tailwind.config.mjs` una vez definido el branding (**TBD**) |
