## ADDED Requirements

### Requirement: Los diálogos forman parte de un documento HTML válido
El sistema SHALL renderizar los modales de confirmación de contacto, candidatura espontánea y postulación a vacante dentro del `Layout`, como descendientes de `<body>` y antes de las etiquetas de cierre `</body>` y `</html>`.

#### Scenario: HTML generado de cada formulario
- **GIVEN** que se ejecutó una compilación de producción
- **WHEN** se inspecciona el HTML generado para contacto, listado de vacantes y detalle de vacante
- **THEN** el modal correspondiente aparece dentro de `<body>` y antes de `</body>`
- **AND** no existe contenido significativo después de `</html>`

#### Scenario: Identificadores válidos y únicos
- **GIVEN** el HTML generado de una página con modal
- **WHEN** se analizan sus IDs y referencias ARIA
- **THEN** cada ID del modal, título, descripción y control de cierre aparece una sola vez
- **AND** cada valor de `aria-labelledby` y `aria-describedby` resuelve a un elemento existente

### Requirement: Los tres formularios usan un componente compartido
El sistema SHALL representar las tres confirmaciones mediante un único componente Astro reutilizable y SHALL conservar en cada página su título, descripción, enlaces y texto complementario específicos.

#### Scenario: Renderizado de una variante
- **GIVEN** una página que configura el componente compartido con contenido de confirmación
- **WHEN** Astro renderiza la página
- **THEN** el resultado contiene la estructura común del modal
- **AND** contiene el texto y los enlaces específicos de esa confirmación

#### Scenario: Dependencias de interfaz
- **GIVEN** la implementación del componente y su controlador
- **WHEN** se revisan sus imports y las dependencias de producción
- **THEN** la solución utiliza Astro, CSS y TypeScript o JavaScript nativos
- **AND** no añade una librería de UI ni una librería externa de focus trap

### Requirement: El diálogo expone nombre, descripción y modalidad
Cada modal abierto SHALL contener un elemento con `role="dialog"` y `aria-modal="true"`, y SHALL usar `aria-labelledby` y `aria-describedby` para referenciar un título visible y una descripción existente. Esta estructura SHALL satisfacer WCAG 2.2 criterios 1.3.1 Info and Relationships y 4.1.2 Name, Role, Value.

#### Scenario: Semántica accesible
- **GIVEN** un modal renderizado
- **WHEN** una tecnología de asistencia inspecciona el elemento de diálogo
- **THEN** identifica el rol de diálogo modal
- **AND** obtiene su nombre desde el título visible referenciado
- **AND** obtiene su descripción desde el contenido referenciado

### Requirement: La apertura administra el foco
Al abrir un modal, el sistema SHALL recordar el control que inició el envío y SHALL mover el foco programáticamente al contenedor del diálogo o a un elemento inicial definido dentro de él sin desplazar innecesariamente la página. El orden resultante SHALL satisfacer WCAG 2.2 criterio 2.4.3 Focus Order.

#### Scenario: Apertura tras envío exitoso
- **GIVEN** que el foco está en el botón de envío de uno de los tres formularios
- **WHEN** el envío termina exitosamente y se abre la confirmación
- **THEN** el foco se encuentra dentro del diálogo
- **AND** el contenido anterior de la página no recibe la navegación por `Tab`

#### Scenario: Apertura sin origen explícito
- **GIVEN** que se solicita abrir el modal sin proporcionar un submitter
- **WHEN** se abre el diálogo
- **THEN** el sistema usa como respaldo el elemento activo que admita foco
- **AND** mueve el foco dentro del diálogo

### Requirement: El foco permanece contenido en el diálogo
Mientras el modal esté abierto, el sistema SHALL contener la navegación secuencial por teclado dentro del diálogo y SHALL mantener un indicador de foco visible, satisfaciendo WCAG 2.2 criterios 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order y 2.4.7 Focus Visible.

#### Scenario: Tab desde el último control
- **GIVEN** un diálogo abierto con el foco en su último elemento enfocable
- **WHEN** la persona presiona `Tab`
- **THEN** el foco pasa al primer elemento enfocable del diálogo

#### Scenario: Shift+Tab desde el primer control
- **GIVEN** un diálogo abierto con el foco en su primer elemento enfocable
- **WHEN** la persona presiona `Shift+Tab`
- **THEN** el foco pasa al último elemento enfocable del diálogo

#### Scenario: Diálogo sin controles enfocables
- **GIVEN** un diálogo abierto sin descendientes enfocables
- **WHEN** la persona intenta navegar con `Tab` o `Shift+Tab`
- **THEN** el foco permanece en el contenedor del diálogo

### Requirement: El diálogo ofrece mecanismos equivalentes de cierre
El sistema SHALL cerrar el modal mediante su botón visible, la tecla `Escape` y un clic directo en el overlay. Un clic dentro de la tarjeta SHALL NOT cerrar el modal. Los mecanismos de teclado SHALL satisfacer WCAG 2.2 criterios 2.1.1 Keyboard y 2.1.2 No Keyboard Trap.

#### Scenario: Cierre mediante botón
- **GIVEN** un diálogo abierto
- **WHEN** la persona activa el botón visible de cierre
- **THEN** el diálogo se cierra

#### Scenario: Cierre mediante Escape
- **GIVEN** un diálogo abierto y el foco dentro de él
- **WHEN** la persona presiona `Escape`
- **THEN** el diálogo se cierra

#### Scenario: Cierre mediante overlay
- **GIVEN** un diálogo abierto
- **WHEN** la persona hace clic directamente en el overlay fuera de la tarjeta
- **THEN** el diálogo se cierra

#### Scenario: Interacción dentro de la tarjeta
- **GIVEN** un diálogo abierto
- **WHEN** la persona hace clic en contenido dentro de la tarjeta
- **THEN** el diálogo permanece abierto salvo que el contenido sea el control de cierre

### Requirement: El cierre restaura el foco
Al cerrar el modal por cualquier mecanismo, el sistema SHALL devolver el foco al elemento que originó la apertura si continúa conectado al documento y admite foco. Si el origen ya no está disponible, el sistema SHALL cerrar sin lanzar errores.

#### Scenario: Restauración al botón de envío
- **GIVEN** que un botón de envío abrió el diálogo y permanece en el documento
- **WHEN** la persona cierra el diálogo por botón, `Escape` u overlay
- **THEN** el foco regresa a ese botón de envío

#### Scenario: Origen eliminado
- **GIVEN** que el elemento que abrió el diálogo fue eliminado del documento
- **WHEN** se cierra el diálogo
- **THEN** el modal se oculta correctamente
- **AND** no se produce una excepción al intentar restaurar el foco

### Requirement: El fondo no se desplaza durante la modalidad
Mientras un modal esté abierto, el sistema SHALL impedir el scroll del documento de fondo y SHALL restaurar exactamente el estado de overflow previo al cerrar.

#### Scenario: Bloqueo y restauración de scroll
- **GIVEN** una página desplazable con un valor de overflow previo
- **WHEN** se abre el diálogo
- **THEN** el documento de fondo queda bloqueado
- **AND WHEN** se cierra el diálogo
- **THEN** se restaura el valor de overflow previo

### Requirement: El modal respeta movimiento reducido
Los estilos del modal SHALL consultar `prefers-reduced-motion` y SHALL eliminar o reducir las animaciones y transiciones no esenciales cuando la preferencia sea `reduce`, en apoyo de WCAG 2.2 criterio 2.3.3 Animation from Interactions.

#### Scenario: Preferencia de movimiento reducido
- **GIVEN** que el sistema operativo o navegador expresa `prefers-reduced-motion: reduce`
- **WHEN** el modal abre o cierra
- **THEN** no se ejecutan animaciones o transiciones de movimiento no esenciales
- **AND** la administración de foco y los mecanismos de cierre conservan el mismo comportamiento

### Requirement: La accesibilidad se verifica por teclado y sobre el artefacto construido
La entrega SHALL incluir pruebas automatizadas del controlador y una estrategia reproducible de verificación manual para los tres formularios, además de comprobar el HTML emitido por la compilación.

#### Scenario: Recorrido manual completo por teclado
- **GIVEN** una persona que usa únicamente teclado en cada uno de los tres formularios
- **WHEN** envía el formulario, recorre el diálogo con `Tab` y `Shift+Tab`, y lo cierra por botón y `Escape`
- **THEN** el foco nunca sale del diálogo mientras está abierto
- **AND** cada foco es visible
- **AND** el foco regresa al control de envío al cerrar

#### Scenario: Verificación automatizada del comportamiento
- **GIVEN** la suite de pruebas en Vitest y jsdom
- **WHEN** se ejecutan las pruebas del controlador de modal
- **THEN** se cubren apertura, foco inicial, contención, los tres cierres, restauración de foco y bloqueo de scroll

#### Scenario: Verificación del HTML de producción
- **GIVEN** una compilación exitosa de Astro
- **WHEN** se ejecuta la comprobación estructural sobre las páginas generadas
- **THEN** los tres modales están dentro de `<body>`
- **AND** sus relaciones ARIA resuelven correctamente
- **AND** el documento no contiene nodos de aplicación después de `</html>`
