# Skill: /delete-vacant-id

Elimina una vacante de Grupo Jesgali por su ID, manteniendo el registro histórico intacto.

## Cómo se invoca

```
/delete-vacant-id JES-003
```

El ID puede pasarse como argumento o Claude lo pedirá si no se especificó.

## Proceso que Claude debe ejecutar

### 1. Leer el registro
```
Leer: src/content/vacantes/_registro.json
```
- Buscar la entrada con el ID proporcionado
- Si no existe → responder: "No se encontró ninguna vacante con ID {ID} en el registro."
- Si `activa: false` → responder: "La vacante {ID} ya fue eliminada anteriormente."

### 2. Confirmar con el usuario ANTES de borrar
Mostrar en el chat:
```
⚠ ¿Confirmas eliminar esta vacante?

   ID:    JES-XXX
   Título: {titulo}
   Archivo: src/content/vacantes/{slug}.md
   URL:    /vacantes/{slug}

Esta acción es irreversible. El ID JES-XXX quedará reservado en el registro
y no se reutilizará. Responde "sí" o "confirmar" para proceder.
```

Esperar confirmación explícita del usuario ("sí", "confirmar", "adelante", "ok"). Si no confirma, abortar.

### 3. Con confirmación: eliminar el archivo
- Verificar que el archivo `src/content/vacantes/{slug}.md` existe
- Eliminarlo con `rm` o la herramienta de Bash disponible
- Si el archivo no existe, continuar igual (puede haberse borrado manualmente)

### 4. Actualizar el registro
Leer `src/content/vacantes/_registro.json`:
- Encontrar la entrada con el ID
- Cambiar `"activa": true` → `"activa": false`
- **NO borrar la entrada** — el ID debe permanecer en el registro para siempre
- Escribir el archivo completo actualizado

### 5. Confirmar en el chat
```
✓ Vacante eliminada:

   JES-XXX · {titulo}
   Archivo src/content/vacantes/{slug}.md borrado
   ID JES-XXX marcado como inactivo en _registro.json — no se reutilizará

   La URL /vacantes/{slug} mostrará el 404 editorial con vacantes activas.
```

## Notas
- El archivo `.md` se borra de forma permanente (hard delete)
- La entrada en `_registro.json` se mantiene con `activa: false` para evitar reusar el ID
- El listado `/vacantes` dejará de mostrar la vacante automáticamente (filtra por `activa: true`)
- Las páginas del build deben regenerarse (`npm run build`) para que el cambio se refleje en producción
- Si el usuario quiere desactivar temporalmente sin borrar, editar manualmente el frontmatter: `activa: false`
