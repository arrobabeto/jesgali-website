# Migración de Astro 4 a Astro 6

**Fecha:** 2026-06-08

## Resumen

La cadena de build se actualizó para corregir vulnerabilidades conocidas en Astro, Vite, esbuild y Vitest sin cambiar la arquitectura del sitio:

- `astro`: 4.16.x -> 6.4.x
- `@astrojs/mdx`: 3.1.x -> 6.0.x
- `@astrojs/sitemap`: 3.2.x -> 3.7.x
- `vitest`: 2.1.x -> 4.1.x
- Tailwind permanece en 3.4.x
- `output: 'static'` permanece sin cambios

## Cambio mínimo de runtime

Astro 6 requiere Node.js `>=22.12.0`; Node 20 ya no está soportado. El proyecto fija este mínimo mediante:

- `engines.node` en `package.json`
- `.nvmrc`
- Node `22.12.0` en GitHub Actions

El hosting no cambia: HostGator continúa recibiendo únicamente los archivos estáticos de `dist/`.

## Cambios de compatibilidad

### Content Collections

Las colecciones migraron de la API legacy a Content Layer:

- `src/content/config.ts` pasó a `src/content.config.ts`
- Las colecciones locales usan `glob()` de `astro/loaders`
- Los esquemas usan `z` de `astro/zod`
- `entry.slug` se reemplazó por `entry.id`
- `entry.render()` se reemplazó por `render(entry)`

Los IDs generados conservan los slugs basados en nombre de archivo, por lo que las rutas públicas no cambian.

### Tailwind CSS 3

Tailwind permanece en la versión 3. La integración `@astrojs/tailwind` no declara compatibilidad con Astro 6, así que se sustituyó por la configuración PostCSS nativa de Vite con `tailwindcss` y `autoprefixer`.

No se modificaron `tailwind.config.mjs`, las directivas `@tailwind` ni las clases existentes.

### Scripts de página

Astro 6 conserva la posición de los scripts procesados con mayor precisión. Los scripts que estaban como hermanos de `<Layout>` podían terminar después de `</html>`; se movieron dentro del contenido del layout para mantener HTML válido sin cambiar su lógica ni sus imports.

## Validación requerida

Ejecutar con Node `>=22.12.0`:

```sh
npm ci
npm run check
npm test
PUBLIC_WEB3FORMS_ACCESS_KEY=test-access-key-123 npm run build
npm run verify:modal-html
npm audit
```

El build debe generar 22 páginas, incluyendo las rutas de vacantes y talento, además de `sitemap-index.xml`.

## Riesgos residuales

`npm audit` conserva hallazgos moderados exclusivos de desarrollo en la cadena de `@astrojs/check`:

`@astrojs/check` -> `@astrojs/language-server` -> `volar-service-yaml` -> `yaml-language-server`

No afectan el bundle ni el sitio estático desplegado. Al 2026-06-08, npm no ofrece una actualización corregida de esta cadena; propone bajar `@astrojs/check` a una versión anterior. Se conserva la versión actual para no degradar la compatibilidad con Astro 6. El audit no contiene vulnerabilidades high o critical.

## Referencias

- [Guía oficial de actualización a Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Guía oficial de actualización a Astro 5 y Content Layer](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Estilos, PostCSS y Tailwind](https://docs.astro.build/en/guides/styling/)
