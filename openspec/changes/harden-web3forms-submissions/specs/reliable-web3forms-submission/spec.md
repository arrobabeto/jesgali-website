## ADDED Requirements

### Requirement: Configuración pública validada en build
El sistema SHALL obtener la access key de Web3Forms exclusivamente desde `PUBLIC_WEB3FORMS_ACCESS_KEY` y SHALL insertar ese valor en el campo oculto `access_key` de los tres formularios. Un build de producción MUST terminar con error antes de publicar artefactos cuando la variable falte, esté vacía o sea un placeholder conocido.

#### Scenario: Build de producción configurado
- **WHEN** se ejecuta un build de producción con `PUBLIC_WEB3FORMS_ACCESS_KEY` definida con un valor no vacío y no placeholder
- **THEN** el build puede continuar y los tres formularios contienen ese valor en `access_key`

#### Scenario: Variable ausente en producción
- **WHEN** se ejecuta un build de producción sin `PUBLIC_WEB3FORMS_ACCESS_KEY`
- **THEN** el build falla con un mensaje que identifica la variable requerida y cómo corregir la configuración

#### Scenario: Placeholder rechazado
- **WHEN** se ejecuta un build de producción con `PUBLIC_WEB3FORMS_ACCESS_KEY` igual a `TU_ACCESS_KEY_WEB3FORMS` u otro placeholder reconocido
- **THEN** el build falla y ningún artefacto de producción válido se considera generado

#### Scenario: Configuración inválida durante desarrollo
- **WHEN** el formulario enriquecido se inicializa en un entorno no productivo sin una clave válida
- **THEN** el sistema no realiza la solicitud, conserva los datos y muestra un error comprensible de configuración

### Requirement: Cobertura uniforme de los tres formularios
La capacidad de envío confiable SHALL aplicarse al contacto general de `src/pages/contacto.astro`, al CV espontáneo de `src/pages/vacantes/index.astro` y a la aplicación de `src/pages/vacantes/[slug].astro`, conservando los campos y mensajes específicos de cada caso.

#### Scenario: Inicialización de formularios
- **WHEN** cualquiera de las tres páginas se carga con JavaScript y configuración válida
- **THEN** su formulario usa la misma lógica compartida de estados, envío, validación y errores

#### Scenario: Datos específicos de una vacante
- **WHEN** se envía una aplicación desde una página de vacante
- **THEN** la solicitud conserva `vacante_id`, `vacante_titulo` y el asunto específico de esa vacante

### Requirement: Progressive enhancement
Cada formulario SHALL conservar `action="https://api.web3forms.com/submit"` y `method="POST"` y SHALL incluir todos los campos ocultos requeridos para que el navegador pueda enviarlo sin JavaScript.

#### Scenario: Envío sin JavaScript
- **WHEN** JavaScript está deshabilitado y el usuario envía un formulario válido
- **THEN** el navegador publica directamente el formulario a Web3Forms mediante su `action` y `method`

#### Scenario: Envío enriquecido con JavaScript
- **WHEN** JavaScript está disponible y el usuario envía un formulario válido
- **THEN** la lógica compartida intercepta el envío y usa el `action`, el `method` y los datos del propio formulario

### Requirement: Estados de envío observables
Cada formulario SHALL implementar exactamente los estados `idle`, `submitting`, `success` y `error`, y SHALL comunicar los cambios relevantes mediante texto visible y semántica accesible.

#### Scenario: Estado inicial
- **WHEN** el formulario está listo y no existe una solicitud activa ni un resultado pendiente
- **THEN** permanece en `idle`, el botón está habilitado y no se anuncia un error

#### Scenario: Solicitud iniciada
- **WHEN** comienza un envío enriquecido
- **THEN** el formulario pasa a `submitting`, muestra una indicación de progreso, marca la región como ocupada y deshabilita el botón

#### Scenario: Envío confirmado
- **WHEN** Web3Forms confirma funcionalmente el envío
- **THEN** el formulario pasa a `success`, limpia los campos editables y muestra la confirmación específica del formulario

#### Scenario: Envío fallido
- **WHEN** el envío no puede confirmarse por cualquier error contemplado
- **THEN** el formulario pasa a `error`, vuelve a habilitar el botón y muestra un mensaje recuperable en una región anunciable

### Requirement: Prevención de envíos duplicados
La lógica compartida MUST impedir más de una solicitud simultánea por instancia de formulario, incluso si se dispara otro evento de submit mientras el estado es `submitting`.

#### Scenario: Doble activación del botón
- **WHEN** el usuario activa el envío dos veces antes de recibir la primera respuesta
- **THEN** se crea una sola solicitud de red

#### Scenario: Submit programático durante envío
- **WHEN** otro código intenta volver a enviar la misma instancia mientras está en `submitting`
- **THEN** la lógica ignora el segundo intento y mantiene el botón deshabilitado

#### Scenario: Reintento después de error
- **WHEN** una solicitud termina en `error` y el usuario vuelve a enviar
- **THEN** se permite una nueva solicitud con los datos conservados

### Requirement: Validación funcional de la respuesta
El sistema MUST considerar exitoso un envío únicamente cuando la respuesta HTTP sea exitosa, el cuerpo sea JSON válido y el campo de nivel superior `success` sea exactamente `true`.

#### Scenario: Respuesta exitosa válida
- **WHEN** Web3Forms responde con HTTP exitoso y JSON que contiene `success: true`
- **THEN** el sistema entra en `success` y puede limpiar el formulario

#### Scenario: Rechazo funcional con HTTP exitoso
- **WHEN** Web3Forms responde con HTTP exitoso y JSON que contiene `success: false`
- **THEN** el sistema entra en `error`, no muestra confirmación y conserva los datos

#### Scenario: JSON inválido
- **WHEN** la respuesta HTTP contiene un cuerpo vacío, HTML o JSON malformado
- **THEN** el sistema informa que no pudo confirmar el envío y conserva los datos

#### Scenario: Esquema de respuesta desconocido
- **WHEN** el cuerpo es JSON válido pero no contiene `success` como booleano
- **THEN** el sistema trata la respuesta como inválida y no asume éxito

### Requirement: Manejo recuperable de errores
El sistema SHALL clasificar errores de red, timeout, configuración, rate limiting, rechazo del proveedor, servidor y respuesta inválida, y SHALL presentar un mensaje en español que indique una acción razonable sin borrar los datos.

#### Scenario: Error de red o CORS
- **WHEN** `fetch` falla antes de obtener una respuesta
- **THEN** se informa que no fue posible conectar, se rehabilita el envío y se conservan todos los datos

#### Scenario: Timeout
- **WHEN** no se obtiene una respuesta antes de 10 segundos
- **THEN** se cancela la espera, se indica que el envío no pudo confirmarse, se conservan los datos y no se reintenta automáticamente

#### Scenario: Rate limiting
- **WHEN** Web3Forms responde con HTTP `429`
- **THEN** se indica que existe un límite temporal y que el usuario debe intentar más tarde, sin reintento automático

#### Scenario: Error del cliente o rechazo del proveedor
- **WHEN** Web3Forms responde con otro `4xx` o con `success: false`
- **THEN** se muestra un error comprensible que permite revisar o reintentar y no se limpia el formulario

#### Scenario: Error del servidor
- **WHEN** Web3Forms responde con `5xx`
- **THEN** se informa indisponibilidad temporal, se rehabilita el botón y se conservan los datos

### Requirement: Conservación y limpieza de datos
El sistema MUST conservar todos los valores introducidos por el usuario ante cualquier error y MUST limpiar los campos editables solamente después de confirmar `success: true`.

#### Scenario: Fallo después de capturar datos
- **WHEN** el usuario completa el formulario y ocurre un error de cualquier categoría
- **THEN** cada valor editable permanece disponible para corregir o reintentar

#### Scenario: Limpieza posterior al éxito
- **WHEN** el proveedor confirma `success: true`
- **THEN** el formulario se limpia una sola vez después de la confirmación y no antes

### Requirement: Solución compartida y pequeña
La lógica de red, timeout, validación de respuesta, estados y clasificación de errores SHALL residir en un único módulo reutilizable sin añadir un framework ni duplicarse entre las tres páginas.

#### Scenario: Cambio del contrato de respuesta
- **WHEN** se modifica la regla compartida que interpreta una respuesta de Web3Forms
- **THEN** el cambio se realiza en un solo módulo y afecta de forma consistente a los tres formularios

#### Scenario: Personalización de éxito
- **WHEN** un formulario necesita un modal o texto de éxito diferente
- **THEN** la página proporciona esa presentación sin duplicar la lógica común de envío

### Requirement: Protección compatible contra spam y abuso
Los tres formularios SHALL conservar el campo honeypot `botcheck` con el nombre y tipo compatibles con Web3Forms. La solución SHALL tratar el control de solicitudes simultáneas como protección de experiencia, no como rate limiting de seguridad, y la documentación SHALL describir medidas del proveedor para escalar la protección.

#### Scenario: Campo honeypot presente
- **WHEN** se inspecciona cualquiera de los tres formularios
- **THEN** existe un checkbox oculto llamado `botcheck` que se envía con el resto de los datos

#### Scenario: Límite del proveedor
- **WHEN** Web3Forms aplica su rate limit
- **THEN** el sistema respeta el `429`, no ejecuta reintentos automáticos y comunica espera temporal

#### Scenario: Escalamiento anti-spam
- **WHEN** el equipo consulta la documentación de despliegue por aumento de spam
- **THEN** encuentra instrucciones para evaluar hCaptcha, monitoreo y restricción por dominio según el plan de Web3Forms

### Requirement: Seguridad y accesibilidad de mensajes
Los mensajes de estado SHALL ser visibles y anunciables, SHALL mantener foco y controles utilizables después de un error, y MUST insertar cualquier texto externo como texto plano.

#### Scenario: Mensaje de error anunciado
- **WHEN** el formulario entra en `error`
- **THEN** el mensaje es visible, está asociado a una región `aria-live` o equivalente y el usuario puede volver a enviar

#### Scenario: Mensaje del proveedor
- **WHEN** una respuesta incluye texto de error del proveedor
- **THEN** el sistema no lo inserta mediante HTML y no permite ejecutar marcado o scripts

### Requirement: Documentación y migración de despliegue
El repositorio SHALL documentar la creación, configuración, rotación y validación de `PUBLIC_WEB3FORMS_ACCESS_KEY` para desarrollo, CI, preview y producción, sin versionar un valor real.

#### Scenario: Configuración de un entorno nuevo
- **WHEN** una persona prepara un entorno de build siguiendo la documentación
- **THEN** puede identificar dónde declarar la variable, cómo verificarla y qué error esperar si falta

#### Scenario: Archivo de ejemplo
- **WHEN** se consulta la plantilla de variables de entorno del repositorio
- **THEN** aparece `PUBLIC_WEB3FORMS_ACCESS_KEY` con un valor vacío o claramente ficticio y nunca una clave real

### Requirement: Verificación automatizada y manual
La implementación SHALL incluir pruebas automatizadas de la lógica compartida y una lista de validación manual de los tres formularios, incluyendo progressive enhancement y los principales errores.

#### Scenario: Matriz automatizada de respuestas
- **WHEN** se ejecutan las pruebas del módulo compartido
- **THEN** cubren éxito funcional, `success: false`, JSON inválido, timeout, red, `429`, `4xx`, `5xx` y prevención de duplicados

#### Scenario: Validación de build
- **WHEN** se ejecuta la prueba de configuración sin variable en modo producción
- **THEN** se verifica que el build falla con un diagnóstico accionable

#### Scenario: Recorrido manual completo
- **WHEN** se sigue la guía de validación manual
- **THEN** se comprueban los tres formularios con JavaScript, al menos uno sin JavaScript, preservación de datos en error, bloqueo durante envío y recepción real controlada
