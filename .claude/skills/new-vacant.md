# Skill: /new-vacant

Crea una nueva vacante para Grupo Jesgali — tanto el archivo de contenido como el registro histórico.

## Cómo se invoca

```
/new-vacant
```

Después de invocar, Claude pedirá los datos mínimos si no se pasaron como argumento. Si el usuario los pasa en el mensaje, úsalos directamente.

## Datos requeridos

| Campo | Descripción |
|---|---|
| `titulo` | Nombre del puesto (ej. "Especialista en TI") |
| `area` | Área de la empresa (ej. "Tecnología", "Ventas", "Operaciones") |
| `tipo` | `Tiempo completo` / `Por proyecto` / `Medio tiempo` |
| `salarioMin` | Número (sin comas ni signos) |
| `salarioMax` | Número (sin comas ni signos) |
| `resumen` | Una oración de máx. 140 caracteres describiendo la posición |

**Opcionales:**
- `ubicacion` → default: `"Ciudad de México / Remoto"`
- `destacada` → default: `false`

## Proceso que Claude debe ejecutar

### 1. Leer el registro de IDs
```
Leer: src/content/vacantes/_registro.json
```
- Encontrar el número más alto en los IDs (formato `JES-XXX`)
- El nuevo ID = ese número + 1, formateado a 3 dígitos (ej. si el máximo es `JES-006`, el nuevo es `JES-007`)
- **NUNCA reusar un ID que ya existe en el registro**, aunque la vacante esté marcada como `activa: false`

### 2. Generar el slug
- Convertir el `titulo` a kebab-case ASCII minúsculas
- Ejemplos: "Especialista en TI" → `especialista-en-ti`, "Coordinador de Compras" → `coordinador-de-compras`
- Remover acentos, ñ → n, caracteres especiales → omitir

### 3. Crear el archivo `.md`
Ruta: `src/content/vacantes/{slug}.md`

Estructura del frontmatter:
```yaml
---
id: JES-XXX
titulo: {titulo}
area: {area}
tipo: {tipo}
ubicacion: {ubicacion}
salarioMin: {salarioMin}
salarioMax: {salarioMax}
destacada: false
activa: true
fechaPublicacion: {YYYY-MM-DD de hoy}
resumen: {resumen}
---
```

Después del frontmatter, generar el cuerpo en markdown con **3 secciones** apropiadas al área y título:

```markdown
## ¿Qué hace esta persona día a día?

[Párrafo de 2-3 oraciones describiendo el rol en contexto de Jesgali (comercializadora de línea blanca)]

- [Responsabilidad 1]
- [Responsabilidad 2]
- [Responsabilidad 3]
- [Responsabilidad 4]
- [Responsabilidad 5]

## ¿Qué buscamos?

- Licenciatura en [campo relevante] o afín
- **X a Y años de experiencia** en [área]
- [Habilidad técnica o soft skill clave]
- [Otra habilidad]
- [Otra habilidad]

## Lo que ofrecemos

- Sueldo base de **${salarioMin.toLocaleString()} a ${salarioMax.toLocaleString()} mensuales**
- [Beneficio específico del área]
- Seguro de gastos médicos mayores, vales de despensa, fondo de ahorro
- Prestaciones superiores a las de ley
- Plan de carrera estructurado con evaluaciones semestrales
- Capacitación continua en [área relevante]
```

### 4. Actualizar el registro
Leer `src/content/vacantes/_registro.json` y agregar al array:
```json
{ "id": "JES-XXX", "titulo": "{titulo}", "slug": "{slug}", "activa": true }
```
Escribir el archivo completo actualizado (nunca borrar entradas existentes).

### 5. Confirmar en el chat
```
✓ Vacante creada: JES-XXX · {titulo}
   Archivo: src/content/vacantes/{slug}.md
   URL:     /vacantes/{slug}
   Registro actualizado: _registro.json
```

## Notas
- El campo `id` en el frontmatter debe coincidir exactamente con el ID en `_registro.json`
- Si el slug ya existe como archivo, agregar un sufijo numérico (ej. `-2`)
- No crear `getStaticPaths` ni editar `[slug].astro` — ya está configurado para leer toda la colección
- El build de Astro recogerá la nueva vacante automáticamente en el siguiente `npm run build`
