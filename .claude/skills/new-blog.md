# Skill: /new-blog

Crea un nuevo artículo de blog para la sección Talento de Grupo Jesgali — el archivo de contenido y el registro de tracking.

## Cómo se invoca

```
/new-blog "Título del artículo" "Contenido en markdown..."
```

Input mínimo: **Título** y **Contenido** (markdown). La **categoría** es opcional.

## Datos

| Campo | Requerido | Descripción |
|---|---|---|
| `titulo` | ✓ | Título del artículo |
| `contenido` | ✓ | Cuerpo en markdown. Usar `## headings` para que el Table of Contents se genere |
| `categoria` | opcional | Si no se da, Claude elige una existente afín o crea una nueva |

## Proceso que Claude debe ejecutar

### 1. Resolver la categoría
- Leer `src/content/talento/_registro.json` para ver las categorías existentes.
- Si el usuario dio una categoría → usarla (puede ser nueva o existente, es texto libre).
- Si NO dio categoría → analizar el contenido y elegir la categoría existente más afín, o crear una nueva apropiada (ej. "Liderazgo", "Bienestar Laboral"). Informar cuál se eligió.

### 2. Generar el slug
- Kebab-case ASCII del título, sin acentos, ñ → n, sin caracteres especiales.
- Ej: "Cómo crecer en tu carrera" → `como-crecer-en-tu-carrera`.
- Si ya existe el archivo, agregar sufijo `-2`.

### 3. Derivar campos automáticos
- `descripcion`: primera oración del contenido (o resumen de ≤160 caracteres). Limpiar markdown (sin `#`, `*`, etc.).
- `tiempoLectura`: `Math.ceil(número_de_palabras_del_contenido / 200)`. Mínimo 1.
- `fechaPublicacion`: fecha de hoy en formato `YYYY-MM-DD`.
- `imagen`: rotar entre las imágenes del proyecto. Contar cuántos blogs hay y asignar `/images/vida/vida-{(n % 4) + 1}.avif`. (Imágenes disponibles: `vida-1.avif` … `vida-4.avif`.)

### 4. Crear el archivo `.md`
Ruta: `src/content/talento/{slug}.md`

```markdown
---
titulo: {titulo}
descripcion: {descripcion}
categoria: {categoria}
fechaPublicacion: {YYYY-MM-DD}
tiempoLectura: {n}
imagen: /images/vida/vida-{x}.avif
---

{contenido tal cual, respetando sus ## headings}
```

⚠ Si el `titulo` o la `descripcion` contienen `:` u otros caracteres especiales de YAML, envolver el valor en comillas dobles.

### 5. Actualizar el registro
Leer `src/content/talento/_registro.json` y agregar al array:
```json
{ "titulo": "{titulo}", "slug": "{slug}", "url": "/talento/{slug}", "categoria": "{categoria}" }
```
Escribir el archivo completo actualizado (nunca borrar entradas existentes).

### 6. Confirmar en el chat
```
✓ Blog creado: {titulo}
   URL:       /talento/{slug}
   Categoría: {categoria}
   Lectura:   {n} min · Imagen: vida-{x}.avif
   Registro actualizado: _registro.json
```

## Notas
- El Table of Contents se genera automáticamente desde los `## headings` (h2) del contenido. Si el artículo no tiene `##`, el TOC no aparece — recomendar al usuario estructurar con headings.
- Astro auto-inyecta `id` en los headings, así que las anclas del TOC funcionan sin configuración extra.
- No editar `[slug].astro` ni `index.astro` — ya leen toda la colección automáticamente.
- El build recoge el nuevo artículo en el siguiente `npm run build`.
- La categoría es texto libre (el schema usa `z.string()`), así que cualquier categoría nueva aparece como filtro en `/talento` automáticamente.
