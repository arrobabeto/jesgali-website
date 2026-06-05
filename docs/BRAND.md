# Brand Identity — Grupo Jesgali Empresarial

> Sistema de identidad visual del sitio de employer branding. Documento vivo: toda decisión de color, tipografía, voz y composición vive aquí. Generado con la skill **Hallmark** (genre: editorial).

---

## 1. Concepto de marca

**Idea central:** *Crecer juntos.*

Jesgali no vende productos en este sitio — atrae personas. La identidad gira en torno a la **calidez humana**, el **crecimiento real** y la **confianza profesional**. Nada corporativo y frío. La marca debe sentirse como una empresa mexicana, sólida y cercana, donde da gusto trabajar.

| Atributo | Cómo se traduce al diseño |
|----------|---------------------------|
| Humano | Tonos tierra cálidos, serif con calidez óptica, fotografía de personas |
| Crecimiento | Acento verde pino usado con moderación como "marca de crecimiento" |
| Confianza | Composición editorial, hairlines en vez de cajas, mucho aire |
| Aspiracional | Tipografía display grande, declaraciones cortas y directas |
| Mexicano | Paleta de barro/arcilla, calidez, español directo |

**Anti-marca (lo que NO somos):** indigo SaaS genérico, gradientes morados, glassmorphism, íconos en tres tarjetas iguales, stock corporativo frío.

---

## 2. Color

Todos los colores se definen en **OKLCH** (espacio perceptualmente uniforme). Tokens en `tokens.css` y `src/styles/global.css` (`:root`), mapeados al scale de Tailwind en `tailwind.config.mjs`.

### Núcleo

| Token | OKLCH | Rol |
|-------|-------|-----|
| `--color-paper` | `oklch(97.6% 0.009 83)` | Fondo principal — crema cálida (nunca blanco puro) |
| `--color-paper-2` | `oklch(94.8% 0.013 83)` | Superficies elevadas, bandas suaves |
| `--color-ink` | `oklch(24% 0.018 55)` | Texto principal — casi negro cálido (nunca negro puro) |
| `--color-ink-soft` | `oklch(44% 0.016 58)` | Texto secundario, metadatos |
| `--color-ink-deep` | `oklch(26% 0.028 50)` | Banda oscura cálida (espresso) para secciones de contraste |
| `--color-hairline` | `oklch(87% 0.012 78)` | Reglas y divisores (1px) |

### Acento — Arcilla / Terracota (color de marca)

| Token | OKLCH | Rol |
|-------|-------|-----|
| `--color-accent` | `oklch(54% 0.135 44)` | Acento de marca (clay) — usado < 5% del viewport |
| `--color-accent-deep` | `oklch(47% 0.125 43)` | Botones, estados hover/pressed (contraste AA con texto crema) |
| `--color-accent-soft` | `oklch(93% 0.030 55)` | Lavados de fondo, marcas sutiles |

### Secundario — Pino / Crecimiento

| Token | OKLCH | Rol |
|-------|-------|-----|
| `--color-pine` | `oklch(48% 0.070 158)` | Motivo "crecimiento". Uso mínimo (< 2%): puntos de estado, marcas pequeñas |

> **Regla de acento:** el barro (clay) es el único acento dominante. El pino aparece solo como guiño al concepto de crecimiento, nunca compitiendo con el barro. Total de tinta cromática < 7% de cualquier vista.

### Neutrales cálidos

El scale neutral (`slate` en Tailwind) está **redefinido a grises cálidos** (hue ~55–83) para armonizar con el papel crema. No usar grises fríos por defecto.

---

## 3. Tipografía

Emparejamiento de **2 fuentes** (display + body). Ambas gratuitas vía Google Fonts.

| Rol | Fuente | Uso |
|-----|--------|-----|
| **Display** | `Fraunces` (serif óptico, romano) | Titulares, declaraciones, números grandes. Peso 500–600. **Siempre romano — nunca itálica en headers.** |
| **Body** | `Hanken Grotesk` (sans humanista) | Texto corrido, UI, metadatos, botones. Peso 400–600. Soporta acentos del español. |

```
--font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
--font-body:    'Hanken Grotesk', system-ui, -apple-system, sans-serif;
```

**Reglas:**
- Headline del hero ≤ 7 palabras, ≤ 50 caracteres.
- Medida de lectura del body: 45–75 caracteres por línea.
- Itálica permitida **solo** en cuerpo de texto largo (citas, énfasis), nunca en titulares.
- Énfasis en titulares se logra con peso o color de acento, no con itálica.

---

## 4. Layout y composición

- **Escala de espaciado:** 4pt (`--space-xs` … `--space-3xl`). Mínimo `--space-3xl` entre secciones mayores.
- **Asimetría editorial:** columnas desiguales (2:5, 3:7) en prosa; titulares con sesgo a la izquierda, nunca todo centrado.
- **Hairlines, no cajas:** los divisores son reglas de 1px (`--color-hairline`), no bordes de tarjeta. Evitar card-in-card.
- **Pilares de valor:** filas numeradas (01/02/03) separadas por hairlines — **prohibido** el grid de tres tarjetas con ícono igual.
- **Aire generoso:** el espacio en blanco es parte del diseño.

---

## 5. Movimiento

Quieto y editorial. Máximo 3 primitivas:

1. **Entrada fade-up** — una sola orquestación al cargar el hero.
2. **Subrayado de enlace** — se dibuja en hover.
3. **Desplazamiento de fila** — leve shift en hover de cards/filas.

Animar solo `transform` y `opacity`. Easings nombrados (`--ease-out`, `--ease-in-out`), nunca bounce. Respeta `prefers-reduced-motion`.

---

## 6. Voz y copy

- Español mexicano, directo, humano. Verbos sobre adjetivos.
- Declaraciones cortas con punto final: *"Aquí tu carrera crece de verdad."*
- Sin métricas inventadas. Cifras solo si el cliente las confirma; placeholders honestos mientras tanto.
- CTAs en imperativo claro: *"Ver vacantes" · "Conoce el equipo" · "Aplica ahora."*

---

## 7. Componentes de marca

| Componente | Archetype Hallmark | Notas |
|------------|--------------------|-------|
| Nav | N6 Masthead (adaptado) | Wordmark serif + fila de enlaces + hairline inferior |
| Footer | Ft1 Mast-headed | Wordmark + tagline + enlaces pequeños en una banda |
| Hero | Marquee Hero | Declaración display que llena el fold + regla gruesa |
| Testimonios | T1 Pull-quote con marginalia | Cita en columna ancha, atribución al margen |
| Botón primario | — | Fondo `--color-accent-deep`, texto crema, radio `--radius-md` |

---

## 8. Logo (provisional)

No hay logo oficial del cliente (TBD). Placeholder actual: monograma **"J"** en cuadro de acento + wordmark **"Jesgali"** en Fraunces. Sustituir cuando el cliente entregue identidad oficial.

---

## 9. Pendientes de marca (TBD con cliente)

- [ ] Logo oficial y monograma
- [ ] ¿Confirma la paleta tierra/clay o tiene colores corporativos propios?
- [ ] Fotografía real del equipo (hoy: placeholders cálidos / imágenes IA)
- [ ] Cifras reales para el stat strip (años, colaboradores, retención)

---

*Macrostructure: Marquee Hero · Genre: editorial · Theme: custom (clay/cream/pine · Fraunces + Hanken Grotesk) · Generado con Hallmark.*
