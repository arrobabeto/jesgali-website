# Sitemap — Grupo Jesgali Empresarial

> Todas las páginas, secciones y formularios del sitio.

## Mapa de rutas

| Ruta | Página | Tipo |
|------|--------|------|
| `/` | Homepage | Estática |
| `/equipo` | Equipo + Sobre nosotros | Estática |
| `/vacantes` | Listado de vacantes | Estática |
| `/vacantes/[slug]` | Vacante individual | Dinámica (generada en build) |
| `/talento` | Blog de desarrollo profesional | Estática |
| `/talento/[slug]` | Artículo individual | Dinámica (generada en build) |
| `/contacto` | Contacto | Estática |
| `/politica-de-privacidad` | Aviso de privacidad | Estática |

---

## Detalle por página

---

### `/` — Homepage

**Propósito:** Generar el deseo de trabajar en Jesgali en los primeros segundos. Es la página más importante del sitio.

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Hero** | Headline de impacto + subheadline breve sobre el tipo de empresa. CTAs: *Ver vacantes* → `/vacantes` y *Conoce el equipo* → `/equipo`. Imagen IA de fondo (oficina, ambiente cálido). |
| 2 | **Propuesta de valor** | Tres pilares visuales que responden "¿por qué Jesgali?". Ejemplos: Crecimiento real, Equipo que te respalda, Impacto que se siente. Cada pilar: ícono + título + 2–3 líneas. |
| 3 | **La vida en Jesgali** | Mosaico de imágenes generadas IA (personas en oficina, colaboración, trabajo en equipo). Texto breve de cultura al lado o superpuesto. |
| 4 | **Quiénes somos (snippet)** | 3–4 líneas sobre la empresa + 3–4 datos duros (años en el mercado, número de colaboradores, etc.). Link *Conoce más* → `/equipo`. |
| 5 | **Vacantes destacadas** | 3 cards de las posiciones más relevantes. Cada card: título, área, tipo. Botón *Ver todas las vacantes* → `/vacantes`. |
| 6 | **Voz del equipo** | 2–3 testimonios de colaboradores (nombre, área, foto IA generada, cita). Formato de quote card. |
| 7 | **CTA de cierre** | Banner de llamada final: headline fuerte + botón *Aplica ahora* → `/vacantes`. |

---

### `/equipo` — Equipo

**Propósito:** Construir confianza. El candidato quiere saber con quién va a trabajar y si le gustan los valores de la empresa.

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Hero** | Foto de equipo (IA, oficina amplia, grupo de personas). Headline: "Somos Jesgali" + 2 líneas. |
| 2 | **Nuestra historia** | Narrativa breve sobre el origen y evolución de la empresa. Puede incluir un timeline visual simple con hitos clave. |
| 3 | **Misión, Visión y Valores** | Tres bloques. Redactados como compromisos reales, no frases genéricas. |
| 4 | **El liderazgo** | Cards del equipo directivo: foto IA generada, nombre, cargo, 1 línea de quién es. |
| 5 | **Beneficios y perks** | Listado visual de los beneficios reales de trabajar en Jesgali. Decisivo para el candidato. TBD: confirmar beneficios con el cliente. |
| 6 | **Galería de ambiente** | 4–6 imágenes del día a día en la empresa (IA generadas). Sin texto, solo visual. |

> **TBD:** Confirmar beneficios reales, datos del equipo directivo (nombres y cargos) y hitos para el timeline.

---

### `/vacantes` — Vacantes

**Propósito:** El candidato ya quiere aplicar. Esta página facilita que encuentre su posición y no se rinda en el proceso.

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Hero breve** | Headline: "Encuentra tu lugar" + 1 línea de subtexto + contador de posiciones abiertas. |
| 2 | **Filtros** | Por área (Ventas, Operaciones, Administración…) y por tipo (Tiempo completo, Por proyecto). Simple, sin sobreingeniería. |
| 3 | **Grid de vacantes** | Cards: título del puesto, área, ubicación, tipo. Al hacer clic → `/vacantes/[slug]`. |
| 4 | **Proceso de selección** | 4 pasos visuales: *Aplica → Revisamos tu perfil → Entrevista → Bienvenida*. Reduce el miedo al proceso. |
| 5 | **CV espontáneo** | Sección al final: "¿No ves tu vacante? Igual queremos conocerte." + form simplificado. |

#### `/vacantes/[slug]` — Vacante individual

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Encabezado** | Título del puesto, área, ubicación, tipo (tiempo completo / proyecto). |
| 2 | **Descripción del puesto** | Qué hace esta persona día a día. |
| 3 | **Requisitos** | Lo que buscamos en el candidato. |
| 4 | **Lo que ofrecemos** | Beneficios específicos de esta posición. |
| 5 | **Formulario de aplicación** | Nombre, email, teléfono, LinkedIn o portafolio, mensaje de motivación. Ver nota sobre CV abajo. |
| 6 | **Otras vacantes** | 2–3 vacantes relacionadas al final. |

> **Nota sobre CV:** Al ser sitio estático, subir archivos requiere soporte del proveedor de formularios. Opciones: (a) pedir que adjunten su CV por email, (b) usar Formspree paid que soporta adjuntos, (c) solicitar link de LinkedIn. **TBD: decidir con el cliente.**

---

### `/talento` — Talento (blog)

**Propósito:** Atraer talento orgánicamente vía SEO. Contenido enfocado en desarrollo profesional, habilidades y lo que buscan las empresas en nuevos candidatos. El lector llega por el contenido y descubre Jesgali.

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Hero de sección** | Título "Talento" + descripción: "Recursos, consejos y perspectivas para impulsar tu carrera." |
| 2 | **Grid de artículos** | Cards: imagen, categoría, título, extracto, fecha. 2–3 columnas. |
| 3 | **Categorías** | Soft skills · Búsqueda de empleo · Qué buscan las empresas · Desarrollo profesional |

#### `/talento/[slug]` — Artículo individual

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Imagen destacada** | Imagen IA generada, estilo profesional/abstracto. |
| 2 | **Encabezado** | Título, categoría, fecha, tiempo de lectura estimado. |
| 3 | **Contenido** | Cuerpo del artículo en MDX. |
| 4 | **CTA al final** | "¿Listo para dar el siguiente paso? Conoce nuestras vacantes." → `/vacantes`. |
| 5 | **Artículos relacionados** | 2–3 artículos de la misma categoría. |

---

### `/contacto` — Contacto

**Propósito:** Consultas generales. No es la ruta principal para aplicar (eso es `/vacantes`), sino para prensa, alianzas u otras inquietudes.

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Datos de contacto** | Email, teléfono, ciudad/estado. |
| 2 | **Formulario** | Nombre, email, asunto (dropdown: Reclutamiento · Prensa · Otro), mensaje. |
| 3 | **Redes sociales** | Links a LinkedIn, Instagram y las que apliquen. |
| 4 | **Mapa** | Solo si tienen dirección pública. **TBD.** |

---

## Formularios del sitio

| Formulario | Ruta | Campos | Backend |
|------------|------|--------|---------|
| Contacto general | `/contacto` | Nombre, email, asunto, mensaje | TBD (ADR-005) |
| Aplicación a vacante | `/vacantes/[slug]` | Nombre, email, teléfono, LinkedIn, motivación | TBD (ADR-005) |
| CV espontáneo | `/vacantes` | Nombre, email, área de interés, LinkedIn, motivación | TBD (ADR-005) |

> Todos los formularios requieren definir proveedor. Ver [ADR-005](adr/ADR-005-forms.md).

---

## Archivos especiales

| Archivo | Propósito |
|---------|-----------|
| `/sitemap.xml` | Indexación SEO |
| `/robots.txt` | Instrucciones para crawlers |
| `/favicon.ico` | Ícono del sitio |
