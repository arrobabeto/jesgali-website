## Why

Los tres formularios públicos dependen de una clave placeholder y de lógica cliente duplicada que puede reportar éxito ante respuestas funcionalmente fallidas, ocultar errores y permitir envíos repetidos. Se necesita un contrato común y verificable que haga obligatoria la configuración de producción y ofrezca una experiencia de envío confiable sin perder progressive enhancement.

## What Changes

- Sustituir `TU_ACCESS_KEY_WEB3FORMS` por una variable de entorno pública y documentada para Web3Forms.
- Validar la configuración durante el build y hacer fallar los builds de producción cuando la clave requerida falte, esté vacía o conserve un valor placeholder.
- Unificar los formularios de contacto general, CV espontáneo y aplicación a vacante bajo estados `idle`, `submitting`, `success` y `error`.
- Deshabilitar el control de envío mientras exista una solicitud activa y bloquear envíos duplicados.
- Validar tanto la respuesta HTTP como el resultado funcional devuelto por Web3Forms antes de mostrar éxito o limpiar el formulario.
- Tratar de forma recuperable errores de red, timeout, rate limiting, configuración y respuestas inválidas o rechazadas por el proveedor.
- Conservar los datos capturados cuando el envío falle y limpiarlos solamente después de una confirmación funcional de éxito.
- Mantener `action="https://api.web3forms.com/submit"` y `method="POST"` para que el envío nativo siga disponible sin JavaScript.
- Centralizar la lógica repetida en una solución compartida, pequeña y reutilizable, manteniendo mensajes y contenido específico por formulario.
- Mantener y documentar medidas compatibles con Web3Forms para spam y abuso, incluyendo el campo honeypot `botcheck`, limitación de reintentos simultáneos y tratamiento explícito de respuestas de rate limiting.
- Añadir pruebas automatizadas, validación manual y documentación de migración/despliegue para la nueva variable.

Fuera de alcance:

- Reemplazar Web3Forms por otro proveedor.
- Adjuntar o subir archivos.
- Editar contenido de vacantes o artículos.

## Capabilities

### New Capabilities

- `reliable-web3forms-submission`: Configuración validada, progressive enhancement, estados de envío, validación funcional de respuestas, recuperación de errores y controles antiabuso para los tres formularios Web3Forms.

### Modified Capabilities

Ninguna.

## Impact

- Páginas afectadas: `src/pages/contacto.astro`, `src/pages/vacantes/index.astro` y `src/pages/vacantes/[slug].astro`.
- Se incorporará una utilidad cliente compartida y, si conviene a las convenciones existentes, marcado o estilos compartidos mínimos para estados y mensajes.
- La configuración de Astro/build deberá leer y validar `PUBLIC_WEB3FORMS_ACCESS_KEY`.
- Los entornos locales, CI y hosting de producción deberán declarar la nueva variable antes de construir el sitio.
- No se cambia el endpoint público ni el esquema principal de campos enviado a Web3Forms.
