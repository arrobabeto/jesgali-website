## Why

Los tres formularios muestran su confirmación con modales duplicados que se renderizan después de `</Layout>`, produciendo HTML inválido y una experiencia inaccesible para personas que navegan con teclado o tecnologías de asistencia. Es necesario unificar el comportamiento para asegurar semántica de diálogo, administración completa del foco y cierre predecible sin incorporar dependencias de interfaz adicionales.

## What Changes

- Mover los modales de confirmación de contacto, postulación a vacante y candidatura espontánea dentro del contenido renderizado por `Layout`.
- Crear un componente compartido de modal de confirmación y una implementación reutilizable para abrir, cerrar y administrar el diálogo.
- Exponer semántica accesible mediante `role="dialog"`, `aria-modal="true"`, `aria-labelledby` y `aria-describedby` con referencias válidas y únicas.
- Al abrir, recordar el elemento que originó la acción, bloquear el scroll de fondo y mover el foco al diálogo o a un control inicial apropiado.
- Mantener el foco dentro del diálogo durante la navegación con `Tab` y `Shift+Tab`.
- Permitir el cierre mediante el botón visible, la tecla `Escape` y el clic directo sobre el overlay.
- Al cerrar, restaurar el scroll y devolver el foco al elemento de origen cuando siga disponible.
- Respetar `prefers-reduced-motion` en cualquier transición o animación del modal.
- Añadir pruebas automatizadas y verificaciones manuales de teclado, accesibilidad y validez del HTML generado.
- Mantener la implementación en Astro, CSS y TypeScript/JavaScript nativos, sin librerías de UI adicionales.

## Capabilities

### New Capabilities

- `accessible-confirmation-dialogs`: Define el marcado válido, la semántica accesible, el ciclo de foco, los mecanismos de cierre, el bloqueo de scroll, el movimiento reducido y la verificación de los tres diálogos de confirmación.

### Modified Capabilities

Ninguna.

## Impact

- Afecta `src/pages/contacto.astro`, `src/pages/vacantes/index.astro` y `src/pages/vacantes/[slug].astro`.
- Añade un componente compartido bajo `src/components/` y, si corresponde al patrón elegido, un módulo compartido bajo `src/scripts/`.
- Puede centralizar estilos actualmente duplicados en el componente o en `src/styles/global.css`.
- Extiende la cobertura de pruebas con Vitest/jsdom y la verificación del resultado de `astro build`.
- No cambia los contratos de envío de Web3Forms ni añade dependencias de producción.
