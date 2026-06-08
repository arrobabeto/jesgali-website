## 1. Componente compartido y estilos

- [x] 1.1 Crear el componente Astro compartido de confirmación con props o slots para título, descripción, contenido adicional e identificador único.
- [x] 1.2 Incorporar al componente `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, `tabindex="-1"` y estado cerrado mediante `hidden`.
- [x] 1.3 Centralizar los estilos de overlay y tarjeta, conservar un foco visible y añadir la variante `prefers-reduced-motion: reduce`.
- [x] 1.4 Añadir el estado global reversible que bloquea el scroll de fondo mientras exista un diálogo abierto.

## 2. Controlador accesible del modal

- [x] 2.1 Crear un controlador TypeScript reutilizable con operaciones idempotentes de apertura, cierre e inicialización por elemento.
- [x] 2.2 Capturar el elemento de retorno, mostrar el modal y mover el foco al diálogo al abrir sin provocar desplazamiento innecesario.
- [x] 2.3 Implementar la detección de elementos enfocables y el ciclo de `Tab` y `Shift+Tab`, incluido el caso sin controles enfocables.
- [x] 2.4 Implementar cierre por botón, tecla `Escape` y clic directo en overlay sin cerrar por clics dentro de la tarjeta.
- [x] 2.5 Restaurar el foco al origen conectado y enfocable, tolerar orígenes eliminados y restaurar exactamente el overflow previo al cerrar.

## 3. Migración de formularios

- [x] 3.1 Migrar `src/pages/contacto.astro` para renderizar la confirmación compartida antes de `</Layout>` y eliminar su marcado, estilos y listeners duplicados.
- [x] 3.2 Migrar `src/pages/vacantes/index.astro` para renderizar la confirmación compartida antes de `</Layout>` y eliminar su marcado, estilos y listeners duplicados.
- [x] 3.3 Migrar `src/pages/vacantes/[slug].astro` para renderizar la confirmación compartida antes de `</Layout>` y eliminar su marcado, estilos y listeners duplicados.
- [x] 3.4 Conectar cada `onSuccess` de Web3Forms con el controlador y capturar el `SubmitEvent.submitter` como origen preferente del foco.
- [x] 3.5 Confirmar que cada variante conserva su título, descripción, enlace de correo, asunto recomendado y texto complementario.

## 4. Pruebas automatizadas

- [x] 4.1 Configurar el script de pruebas del proyecto si aún no existe y añadir pruebas Vitest/jsdom para el controlador compartido.
- [x] 4.2 Probar apertura, foco inicial, referencias ARIA y ausencia de errores cuando no se proporciona un origen explícito.
- [x] 4.3 Probar el ciclo de foco con `Tab` y `Shift+Tab`, incluidos primer control, último control y diálogo sin controles enfocables.
- [x] 4.4 Probar cierre por botón, `Escape` y overlay, además de verificar que un clic dentro de la tarjeta no cierre el diálogo.
- [x] 4.5 Probar restauración de foco con origen presente y eliminado, y bloqueo/restauración del scroll con un valor inline preexistente.

## 5. HTML, WCAG y verificación por teclado

- [x] 5.1 Ejecutar `astro build` y añadir una comprobación reproducible de los HTML generados para contacto, listado de vacantes y al menos un detalle de vacante.
- [x] 5.2 Verificar en el HTML construido que cada modal está dentro de `<body>`, antes de `</body>`, que no hay contenido de aplicación después de `</html>` y que los IDs son únicos.
- [x] 5.3 Verificar que cada `aria-labelledby` y `aria-describedby` resuelve a un elemento existente y que cada diálogo expone rol, modalidad, nombre y descripción.
- [x] 5.4 Recorrer por teclado los tres formularios y documentar apertura, anuncio del diálogo, foco visible, ciclo con `Tab`/`Shift+Tab`, cierre con botón y `Escape`, y retorno al submitter.
- [x] 5.5 Verificar en navegador el clic de overlay, la ausencia de cierre al clicar la tarjeta, el bloqueo de scroll y el comportamiento con `prefers-reduced-motion: reduce`.
- [x] 5.6 Registrar el resultado contra WCAG 2.2 criterios 1.3.1, 2.1.1, 2.1.2, 2.4.3, 2.4.7, 4.1.2 y el apoyo a 2.3.3.
