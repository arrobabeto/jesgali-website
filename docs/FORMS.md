# Formularios Web3Forms

El sitio envía tres formularios directamente a Web3Forms:

- contacto general: `/contacto`;
- candidatura espontánea: `/vacantes#cv-espontaneo`;
- aplicación a vacante: `/vacantes/<slug>#aplicar`.

La integración conserva `action` y `method`, por lo que sigue funcionando sin JavaScript. Con JavaScript habilitado añade estados de progreso, validación funcional de la respuesta y errores recuperables.

## Variable requerida

```dotenv
PUBLIC_WEB3FORMS_ACCESS_KEY=<access-key-de-web3forms>
```

La access key es pública por diseño de Web3Forms: aparece en el HTML generado. Aun así, no debe escribirse directamente en el repositorio. Mantenerla en variables de entorno permite rotarla y evita valores divergentes entre formularios.

Los builds de producción fallan cuando la variable:

- no existe;
- está vacía;
- contiene un placeholder conocido.

El error comienza con:

```text
[config] PUBLIC_WEB3FORMS_ACCESS_KEY es obligatoria para builds de producción.
```

## Desarrollo local

1. Crear una access key en el panel de Web3Forms para el correo receptor autorizado.
2. Crear `.env.local`; este archivo está ignorado por Git.
3. Añadir `PUBLIC_WEB3FORMS_ACCESS_KEY` con la clave real.
4. Ejecutar `npm run check`, `npm test` y `npm run build`.

`.env.example` solo documenta el nombre. Su valor ficticio es rechazado deliberadamente.

## GitHub Actions y producción

El despliegue construye en GitHub Actions y publica `dist/` por FTP a HostGator.

1. Abrir `GitHub repository → Settings → Secrets and variables → Actions`.
2. Crear el repository secret `PUBLIC_WEB3FORMS_ACCESS_KEY`.
3. Pegar la access key autorizada, sin comillas ni espacios.
4. Ejecutar nuevamente el workflow o hacer push a `main`.
5. Confirmar que los pasos `Validar código y formularios` y `Build Astro` terminan antes del deploy FTP.

Los previews que necesiten enviar formularios deben recibir la misma variable o una clave de Web3Forms separada. No habilitar dominios de preview desconocidos.

## Migración

Orden obligatorio:

1. Rotar la clave que haya estado escrita directamente en código.
2. Configurar `PUBLIC_WEB3FORMS_ACCESS_KEY` en GitHub Actions y entornos de preview.
3. Configurar `.env.local` en los equipos que necesiten pruebas reales.
4. Desplegar el código con validación de build.
5. Probar una vez cada formulario y confirmar recepción.
6. Monitorear errores, spam y respuestas `429`.

Un despliegue sin variable se detiene antes del FTP, por lo que no reemplaza el sitio que ya está en producción.

## Rotación y rollback

Para rotar:

1. Generar o regenerar la access key en Web3Forms.
2. Actualizar el secret de GitHub y los entornos autorizados.
3. Ejecutar un nuevo build y validar un envío controlado.
4. Invalidar la clave anterior.

Para rollback de código, mantener la variable configurada. Si el rollback restaura un formulario antiguo, verificar que no vuelva a introducir una clave hardcodeada ni `TU_ACCESS_KEY_WEB3FORMS`.

## Spam y rate limiting

- Los tres formularios incluyen el honeypot `botcheck`.
- El bloqueo del botón solo previene duplicados de interfaz; no es una defensa de seguridad.
- Ante HTTP `429`, no repetir pruebas inmediatamente. Esperar unos minutos y revisar el volumen de envíos.
- No hay reintentos automáticos: un timeout puede ocurrir aunque Web3Forms haya recibido el mensaje.
- Monitorear los mensajes recibidos y el panel del proveedor.
- Si aumenta el spam, habilitar hCaptcha con Web3Forms.
- Evaluar restricción por dominio si el plan contratado la incluye, autorizando `jesgali.com.mx` y únicamente los dominios de preview necesarios.

## Validación manual

Usar mocks de red o DevTools para los casos de error; reservar las llamadas reales para una prueba final por formulario.

1. Cargar cada formulario y confirmar estado inicial, botón habilitado y datos editables.
2. Enviar con una respuesta demorada y confirmar texto de progreso, `aria-busy` y botón deshabilitado.
3. Intentar doble clic o `requestSubmit()` durante el envío y confirmar una sola solicitud.
4. Simular `success: true` y confirmar limpieza de campos y modal correcto.
5. Simular `success: false`, JSON inválido, error de red, timeout, `429`, `422` y `503`.
6. En cada error, confirmar mensaje visible, botón rehabilitado y datos intactos.
7. Deshabilitar JavaScript y enviar un formulario de prueba para confirmar el POST nativo a su `action`.
8. Con una clave y dominio autorizados, realizar un envío real por formulario y confirmar recepción.

No usar datos personales reales en pruebas automatizadas o mocks.
