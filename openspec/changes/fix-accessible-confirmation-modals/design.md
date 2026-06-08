## Context

Las páginas `contacto.astro`, `vacantes/index.astro` y `vacantes/[slug].astro` contienen variantes casi idénticas de un modal de confirmación. En los tres casos el marcado aparece después de `</Layout>`, por lo que Astro lo emite después del documento HTML generado. Cada página también mantiene sus propios estilos y listeners, y la apertura actual solo alterna una clase visual: no comunica un diálogo a tecnologías de asistencia, no administra el foco, no responde a `Escape` y no bloquea el scroll de fondo.

La aplicación usa Astro 4, TypeScript en scripts del cliente y CSS propio. Vitest y jsdom ya están disponibles como dependencias de desarrollo. La solución debe conservar el flujo actual de `initWeb3Forms`, funcionar sin hidratación de un framework y no añadir librerías de UI.

## Goals / Non-Goals

**Goals:**

- Producir HTML válido con los tres diálogos como descendientes de `<body>` a través del slot de `Layout`.
- Compartir marcado, estilos y comportamiento accesible sin perder el contenido específico de cada confirmación.
- Implementar apertura, foco inicial, contención de foco, tres mecanismos de cierre, restauración de foco y bloqueo de scroll.
- Cumplir los criterios aplicables de WCAG 2.2: 1.3.1, 2.1.1, 2.1.2, 2.4.3, 2.4.7 y 4.1.2; considerar 2.3.3 mediante `prefers-reduced-motion`.
- Permitir pruebas unitarias del controlador y comprobaciones reproducibles del HTML construido.

**Non-Goals:**

- Cambiar el proveedor, validación o contrato de envío de Web3Forms.
- Convertir otros overlays o patrones de navegación del sitio.
- Añadir una librería de componentes, focus trap o framework cliente.
- Implementar apilamiento de múltiples diálogos simultáneos.
- Rediseñar el contenido visual de las confirmaciones más allá de lo necesario para compartir el componente y mantener foco visible.

## Decisions

### Componente Astro compartido con slots

Se creará un componente de presentación, por ejemplo `ConfirmationModal.astro`, que reciba un `id`, identificadores derivados o explícitos para título y descripción, y contenido mediante props/slots. El overlay incluirá un elemento de diálogo con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` y `tabindex="-1"`. El componente se renderizará antes del `</Layout>` de cada página y permanecerá oculto con el atributo `hidden` cuando esté cerrado.

Los identificadores se derivarán del `id` del modal para evitar colisiones entre título, descripción y botón. El contenido específico, incluidos enlaces y texto adicional, seguirá definido por cada página.

Alternativa considerada: mantener tres bloques de marcado y compartir solo el script. Se descarta porque conservaría la duplicación de semántica y estilos, y permitiría que las variantes diverjan.

### Controlador TypeScript reutilizable

Se añadirá un módulo cliente, por ejemplo `src/scripts/modal.ts`, que inicialice un elemento de modal y exponga al menos `open()` y `close()`. La página conectará `onSuccess` de `initWeb3Forms` con `open()` y proporcionará como origen el botón de envío que inició la operación cuando sea posible.

El controlador:

1. Guarda el elemento de retorno de foco válido.
2. Quita `hidden`, activa el estado visual y bloquea el scroll de fondo.
3. En el siguiente frame o microtarea enfoca el contenedor del diálogo con `preventScroll`.
4. Intercepta `Tab` y `Shift+Tab` para envolver la navegación entre elementos enfocables; si no hay controles enfocables, mantiene el foco en el diálogo.
5. Cierra con el botón identificado por un atributo de datos, `Escape` o clic cuyo `target` sea exactamente el overlay.
6. Al cerrar, vuelve a ocultar el modal, restaura el estado de scroll y devuelve el foco al origen si sigue conectado y admite foco.

El origen preferente será el `SubmitEvent.submitter` capturado al enviar el formulario. Como respaldo se utilizará `document.activeElement` en el momento de apertura. Esto hace determinista el retorno aun cuando la confirmación llegue después de una solicitud asíncrona.

Alternativa considerada: usar el elemento HTML `<dialog>`. Aunque ofrece parte de la semántica y foco nativo, su comportamiento de clic en backdrop, animación, restauración y pruebas requiere normalización adicional; además, el patrón actual puede migrarse con menor riesgo conservando el overlay. La solución con ARIA seguirá el patrón de diálogo modal de WAI-ARIA.

### Bloqueo de scroll reversible

El controlador aplicará una clase de estado a `document.documentElement` o `document.body` y preservará el valor inline previo antes de modificarlo. Al cerrar restaurará ese valor en lugar de asumir que estaba vacío. La clase compartida establecerá `overflow: hidden`.

Alternativa considerada: asignar y limpiar siempre `body.style.overflow`. Se descarta porque puede destruir un estilo inline preexistente.

### Movimiento y visibilidad

El modal podrá usar una transición breve de opacidad o transformación mediante las variables existentes. Una media query `@media (prefers-reduced-motion: reduce)` eliminará animaciones y transiciones no esenciales. El foco programático no dependerá de que finalice una animación y el diálogo o sus controles conservarán un indicador de foco visible.

### Estrategia de pruebas

Las pruebas unitarias con Vitest/jsdom cubrirán:

- atributos ARIA y referencias a IDs existentes;
- foco inicial en apertura;
- bucle de `Tab` y `Shift+Tab`, incluidos primer y último control;
- cierre por botón, `Escape` y overlay, y ausencia de cierre al hacer clic dentro de la tarjeta;
- retorno de foco al submitter;
- bloqueo y restauración del scroll;
- tolerancia cuando el origen se elimina del DOM o no existen controles enfocables.

La prueba manual por teclado recorrerá cada uno de los tres formularios: enviar, verificar anuncio y foco dentro del diálogo, recorrer todos los controles en ambos sentidos, cerrar por cada mecanismo y confirmar el retorno al botón de envío. Se repetirá con la preferencia de movimiento reducido activa.

Después de `astro build`, una verificación sobre `dist/contacto/index.html`, `dist/vacantes/index.html` y una página generada de detalle de vacante comprobará que:

- el ID esperado del modal aparece antes de `</body>`;
- no existe contenido significativo después de `</html>`;
- cada referencia de `aria-labelledby` y `aria-describedby` resuelve a un elemento único dentro del documento;
- solo existe una instancia de cada ID;
- el parser DOM ubica overlay y diálogo como descendientes de `<body>`.

## Risks / Trade-offs

- [La lista de elementos enfocables puede omitir casos poco comunes] → Usar un selector compartido que cubra enlaces, botones, inputs, selects, textareas, elementos con `tabindex` y excluya controles deshabilitados, ocultos o con `tabindex="-1"`; añadir pruebas para el contenido real de los tres diálogos.
- [La respuesta asíncrona puede cambiar el foco antes de abrir] → Capturar `SubmitEvent.submitter` al iniciar el envío y pasarlo explícitamente a `open()`.
- [Cerrar durante una transición puede dejar estado visual o scroll bloqueado] → Hacer que `close()` sea idempotente y que el estado funcional no dependa de eventos de transición.
- [Varias inicializaciones pueden duplicar listeners] → Diseñar el inicializador para ejecutarse una vez por elemento y devolver una función de limpieza o marcar la instancia.
- [El bloqueo de scroll puede causar un pequeño cambio de ancho por la barra vertical] → Mantener la primera implementación simple y añadir compensación de scrollbar solo si la verificación visual muestra desplazamiento perceptible.
- [jsdom no reproduce por completo el algoritmo de foco del navegador] → Complementar las pruebas unitarias con la matriz manual de teclado en un navegador real.

## Migration Plan

1. Crear el componente compartido y el controlador con pruebas aisladas.
2. Migrar cada página para renderizar el componente dentro de `Layout` y conectar `onSuccess` a su controlador.
3. Eliminar marcado, estilos y listeners duplicados.
4. Ejecutar pruebas, `astro build`, validación estructural del HTML generado y recorrido manual por teclado.
5. Desplegar como cambio compatible; no requiere migración de datos ni configuración.

La reversión consiste en restaurar el marcado y scripts por página. No hay cambios persistentes ni de API que deban revertirse.

## Open Questions

Ninguna bloqueante. Durante la implementación se elegirá la ubicación final del estilo compartido de acuerdo con el encapsulamiento de estilos de Astro, manteniendo el contrato de comportamiento definido en la especificación.
