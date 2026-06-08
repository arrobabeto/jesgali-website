## Context

El sitio Astro genera HTML estático y contiene tres formularios que publican directamente a `https://api.web3forms.com/submit`: contacto general, candidatura espontánea y aplicación a una vacante. Cada página incluye su propia variante de JavaScript, las tres insertan `TU_ACCESS_KEY_WEB3FORMS`, solo comprueban `Response.ok`, limpian el formulario ante cualquier `2xx` y silencian errores.

Web3Forms está diseñado para uso desde el navegador y su access key puede ser pública. Su API devuelve un indicador JSON `success`, además del estado HTTP; documenta `429` para rate limiting y recomienda medidas anti-spam del proveedor. El diseño debe conservar el envío HTML nativo porque `action` y `method` son parte del fallback sin JavaScript.

Referencias del proveedor:

- API y respuestas: https://docs.web3forms.com/getting-started/api-reference
- Solución de problemas y rate limiting: https://docs.web3forms.com/getting-started/troubleshooting
- Spam y CAPTCHA: https://docs.web3forms.com/getting-started/customizations/spam-protection
- Honeypot `botcheck`: https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection

## Goals / Non-Goals

**Goals:**

- Usar una única variable `PUBLIC_WEB3FORMS_ACCESS_KEY` en los tres formularios.
- Interrumpir un build de producción antes de emitir el sitio si la clave falta, está vacía o coincide con un placeholder conocido.
- Proporcionar estados consistentes `idle`, `submitting`, `success` y `error`, con mensajes accesibles y recuperables.
- Confirmar éxito únicamente cuando la respuesta HTTP y el cuerpo funcional de Web3Forms indiquen éxito.
- Evitar solicitudes simultáneas del mismo formulario y conservar los datos en cualquier fallo.
- Mantener envío nativo sin JavaScript.
- Reutilizar una utilidad cliente pequeña, sin incorporar un framework ni una dependencia de formularios.
- Cubrir errores de configuración, red, timeout, rate limiting, rechazo funcional y respuesta inválida.

**Non-Goals:**

- Cambiar de proveedor, ocultar la access key mediante un proxy o enviar desde servidor.
- Añadir adjuntos.
- Añadir CAPTCHA en esta entrega; sí se documentará como escalamiento si el honeypot resulta insuficiente.
- Implementar un rate limiter autoritativo en el navegador.
- Modificar contenido editorial de vacantes o artículos.

## Decisions

### 1. Variable pública única y validación en configuración de Astro

La variable canónica será `PUBLIC_WEB3FORMS_ACCESS_KEY`. La configuración de Astro cargará el entorno correspondiente al modo de build y ejecutará una validación explícita. En `astro build` de producción lanzará un error descriptivo cuando el valor no exista, sea whitespace o pertenezca a la lista de placeholders rechazados. Las páginas leerán el mismo nombre mediante `import.meta.env` y lo renderizarán en el campo oculto `access_key`.

Se elige una variable `PUBLIC_` porque el proveedor espera la clave en formularios cliente y la considera apta para exposición. Un secreto de servidor o un endpoint proxy contradicen el flujo recomendado por Web3Forms y complicarían el hosting estático.

Alternativas consideradas:

- Repetir la clave en cada página: descartado por duplicación y riesgo de divergencia.
- Validar solo en CI: descartado porque permitiría builds locales o de otros proveedores mal configurados.
- Añadir una integración de validación de entorno: descartado; una comprobación breve en la configuración existente es suficiente.

### 2. Controlador cliente compartido y configuración declarativa por formulario

Se creará un módulo cliente pequeño, por ejemplo `src/scripts/web3forms.ts`, que exporte una función de inicialización. Cada página conservará su marcado y pasará selectores o elementos para:

- formulario;
- botón submit;
- región de estado;
- modal o callback de éxito específico.

El módulo será responsable del ciclo de estados, envío, timeout, parseo, clasificación de errores, bloqueo de duplicados y limpieza tras éxito. El contenido específico de cada modal seguirá en su página.

Alternativas consideradas:

- Componente Astro único para todos los formularios: descartado porque los campos y mensajes de éxito son distintos y la extracción ampliaría el cambio.
- Custom Element: descartado porque añade un patrón nuevo sin aportar suficiente valor para tres instancias.
- Copiar una función en cada script: descartado porque perpetúa el problema central.

### 3. Progressive enhancement con interceptación condicional

Cada formulario conservará literalmente el endpoint en `action` y `POST` en `method`, además del `access_key` oculto. Con JavaScript disponible, el controlador interceptará `submit` y enviará `new FormData(form)` a `form.action` usando `form.method`; no duplicará el endpoint en el módulo.

Sin JavaScript, el navegador enviará el formulario directamente a Web3Forms. El fallback puede usar la página de éxito predeterminada del proveedor; no se añadirá un campo `redirect`, porque su semántica difiere en el flujo AJAX y no es necesario para conservar la funcionalidad básica.

### 4. Máquina de estados mínima y accesible

Cada formulario tendrá un estado único:

- `idle`: botón habilitado y región de estado sin error activo.
- `submitting`: botón deshabilitado, `aria-disabled`/`aria-busy` reflejados y texto de envío visible.
- `success`: formulario limpiado una sola vez y modal o confirmación específica visible.
- `error`: botón rehabilitado, datos intactos y mensaje recuperable en una región `role="status"` o `aria-live`.

El controlador mantendrá una bandera por instancia y rechazará eventos adicionales mientras esté en `submitting`. El estado visual no será la única defensa: la bandera evita duplicados incluso si otro código dispara `requestSubmit`.

Los mensajes usarán `textContent`, no HTML del proveedor. Se priorizarán mensajes propios en español; un mensaje de proveedor solo podrá incorporarse como texto y cuando sea útil, sin exponer detalles técnicos.

### 5. Contrato estricto de éxito

La solicitud AJAX enviará `FormData` sin establecer manualmente `Content-Type` y solicitará JSON mediante `Accept: application/json`. El resultado solo será exitoso si:

- la respuesta HTTP es exitosa;
- el cuerpo puede parsearse como JSON;
- el objeto contiene `success === true`.

Un `2xx` con `success: false`, un cuerpo vacío, HTML, JSON malformado o un esquema sin booleano `success` será error. El formulario se limpiará y mostrará su modal únicamente después de cumplir las tres condiciones.

### 6. Timeout y taxonomía de errores recuperables

El módulo usará `AbortController` con un timeout constante de 10 segundos. La taxonomía de presentación será:

- configuración: no enviar; indicar indisponibilidad temporal y conservar datos;
- red/CORS: indicar que no se pudo conectar y permitir reintento;
- timeout: indicar que no se pudo confirmar el envío, conservar datos y recomendar esperar antes de reintentar;
- `429`: indicar límite temporal y pedir reintento posterior, sin reintento automático;
- `4xx` distinto de `429` o `success: false`: explicar que el proveedor rechazó la solicitud y permitir corregir/reintentar;
- `5xx`: indicar indisponibilidad temporal;
- respuesta inválida: indicar que no se pudo confirmar el envío.

No habrá reintentos automáticos: tras un timeout o pérdida de respuesta el proveedor podría haber procesado la solicitud, y repetirla automáticamente aumentaría duplicados.

### 7. Spam y rate limiting

Los tres formularios conservarán `botcheck` con el nombre y tipo esperados por Web3Forms. El botón se bloqueará durante una solicitud activa, pero este control solo evita duplicados de interfaz y no se presentará como seguridad.

La documentación de despliegue incluirá:

- monitorear volumen y spam recibido;
- activar hCaptcha desde Web3Forms si el honeypot deja de ser suficiente;
- considerar restricción por dominio si el plan contratado la soporta;
- no exponer la clave en repositorio aunque sea pública en el bundle;
- tratar `429` como bloqueo temporal del proveedor y evitar pruebas repetitivas rápidas.

### 8. Pruebas sin dependencia de llamadas reales

La lógica compartida separará, en la medida mínima necesaria, la clasificación de respuestas y errores para probarla con `fetch` simulado. Las pruebas de páginas verificarán el contrato de marcado y configuración. La validación manual usará DevTools o mocks para probar estados sin consumir el rate limit del proveedor; se realizará una única prueba real controlada por formulario en un entorno autorizado.

## Risks / Trade-offs

- [La access key aparece en el HTML] → Es el modelo cliente soportado por Web3Forms; se mitiga con controles del proveedor, monitoreo y posible restricción por dominio/CAPTCHA.
- [Un timeout puede ocurrir después de que el proveedor procese el mensaje] → No reintentar automáticamente y comunicar que el resultado no pudo confirmarse.
- [El fallback sin JavaScript tiene una experiencia distinta] → Mantener funcionalidad de envío nativo como prioridad; los estados enriquecidos requieren JavaScript.
- [`botcheck` ofrece protección limitada] → Mantenerlo por compatibilidad y documentar hCaptcha como siguiente nivel, sin ampliar el alcance actual.
- [Los mensajes o el esquema del proveedor pueden cambiar] → Tratar esquemas desconocidos como error recuperable y depender solo de `success === true`.
- [Validar solo producción permite desarrollo sin clave] → El controlador detectará configuración inválida y mostrará error; CI y despliegue de producción quedarán bloqueados.

## Migration Plan

1. Crear una access key en Web3Forms o identificar la actualmente aprobada para `contacto@jesgali.com.mx`.
2. Añadir `PUBLIC_WEB3FORMS_ACCESS_KEY` al entorno local no versionado, CI, previews que deban enviar y producción.
3. Documentar el nombre, propósito, carácter público y procedimiento de rotación en la guía de despliegue y en un archivo de ejemplo sin valor real.
4. Incorporar la validación de build y comprobar que un build de producción sin variable falla con un mensaje accionable.
5. Desplegar primero en preview con una clave autorizada; validar los tres formularios y revisar la recepción.
6. Promover a producción y monitorear errores, `429` y spam.
7. Retirar cualquier configuración antigua o referencia a `TU_ACCESS_KEY_WEB3FORMS`.

Rollback:

- Revertir el cambio de código conserva el endpoint y campos actuales, pero no se deberá restaurar el placeholder.
- Mantener la variable configurada durante el rollback es inocuo.
- Si la clave se ve comprometida, rotarla en Web3Forms y actualizar todos los entornos antes del siguiente build.

## Open Questions

- Confirmar qué plataforma ejecuta CI/despliegue para nombrar con precisión los pasos de configuración en la documentación final.
- Confirmar si el plan actual de Web3Forms permite restricción por dominio y qué dominios de preview deben autorizarse.
