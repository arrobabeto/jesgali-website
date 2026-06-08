## 1. Configuración y contrato de entorno

- [x] 1.1 Definir `PUBLIC_WEB3FORMS_ACCESS_KEY` como nombre canónico y añadir una validación reutilizable que rechace valores ausentes, vacíos y placeholders conocidos.
- [x] 1.2 Integrar la validación en `astro.config.mjs` para que `astro build` en modo producción falle con un diagnóstico accionable antes de emitir un despliegue válido.
- [x] 1.3 Añadir o actualizar la plantilla de variables de entorno con un valor ficticio y verificar que no se versiona ninguna access key real.
- [x] 1.4 Sustituir `TU_ACCESS_KEY_WEB3FORMS` en los tres formularios por el valor de `PUBLIC_WEB3FORMS_ACCESS_KEY`.

## 2. Controlador compartido de Web3Forms

- [x] 2.1 Crear un módulo cliente pequeño y tipado que inicialice una instancia de formulario a partir de sus elementos y callbacks de presentación.
- [x] 2.2 Implementar los estados `idle`, `submitting`, `success` y `error`, incluyendo botón deshabilitado, bloqueo interno de solicitudes simultáneas y atributos accesibles.
- [x] 2.3 Enviar `FormData` al `action` y `method` declarados por el formulario, solicitar JSON y aplicar un timeout de 10 segundos con `AbortController`.
- [x] 2.4 Validar conjuntamente HTTP exitoso, JSON parseable y `success === true`; tratar `success: false`, JSON inválido y esquema desconocido como errores.
- [x] 2.5 Clasificar configuración, red/CORS, timeout, `429`, otros `4xx`, `5xx` y rechazo funcional en mensajes recuperables en español, insertados como texto plano.
- [x] 2.6 Garantizar que no existan reintentos automáticos, que los datos se conserven ante cualquier error y que `form.reset()` se ejecute una sola vez tras éxito confirmado.

## 3. Integración de los formularios

- [x] 3.1 Integrar el controlador compartido en `src/pages/contacto.astro`, añadir su región de estado accesible y conservar el modal específico de éxito.
- [x] 3.2 Integrar el controlador compartido en `src/pages/vacantes/index.astro` sin interferir con los filtros de vacantes y conservar el modal de CV espontáneo.
- [x] 3.3 Integrar el controlador compartido en `src/pages/vacantes/[slug].astro`, conservando asunto, `vacante_id`, `vacante_titulo` y modal específico.
- [x] 3.4 Confirmar en los tres formularios que permanecen `action="https://api.web3forms.com/submit"`, `method="POST"` y el checkbox oculto `botcheck`.
- [x] 3.5 Eliminar los listeners de envío duplicados y cualquier ruta que silencie errores o use únicamente `res.ok` como señal de éxito.
- [x] 3.6 Ajustar estilos compartidos mínimos para estados, foco y botón deshabilitado sin alterar el contenido editorial ni el diseño ajeno a los formularios.

## 4. Pruebas automatizadas

- [x] 4.1 Incorporar el mínimo tooling y comando de pruebas compatible con el proyecto para ejecutar pruebas deterministas sin llamadas reales a Web3Forms.
- [x] 4.2 Probar la validación de entorno para clave válida, ausente, vacía y placeholder, incluyendo fallo de build de producción.
- [x] 4.3 Probar el controlador con `fetch` simulado para éxito funcional, `success: false`, JSON inválido, esquema desconocido, red, timeout, `429`, otros `4xx` y `5xx`.
- [x] 4.4 Probar que una doble activación y un submit programático durante `submitting` generan una sola solicitud.
- [x] 4.5 Probar que los datos se preservan en todos los fallos, que el botón se rehabilita y que el formulario solo se limpia tras `success === true`.
- [x] 4.6 Añadir verificaciones de marcado para los tres formularios: variable renderizada, `action`, `method`, `botcheck`, región anunciable y campos específicos de vacante.

## 5. Documentación y migración

- [x] 5.1 Documentar cómo obtener, configurar y rotar `PUBLIC_WEB3FORMS_ACCESS_KEY` en desarrollo, CI, preview y producción para la plataforma de despliegue identificada en el repositorio.
- [x] 5.2 Documentar el error esperado cuando falta la variable y un procedimiento de verificación previa al despliegue.
- [x] 5.3 Documentar que la clave es pública por diseño del proveedor, que no debe escribirse directamente en el repositorio y qué controles ofrece Web3Forms.
- [x] 5.4 Añadir una sección operativa sobre `429`, pruebas espaciadas, monitoreo de spam, `botcheck`, escalamiento a hCaptcha y restricción por dominio según el plan.
- [x] 5.5 Registrar el orden de migración y rollback para que la variable esté disponible antes de desplegar el código que bloquea builds sin configuración.

## 6. Validación final

- [x] 6.1 Ejecutar las pruebas automatizadas, type checking disponible y build de producción con una clave ficticia válida para confirmar que el sitio compila.
- [x] 6.2 Ejecutar un build de producción sin variable y con el placeholder para confirmar que ambos fallan con mensajes accionables.
- [ ] 6.3 Validar manualmente los estados `idle`, `submitting`, `success` y `error` en los tres formularios usando mocks o DevTools, incluyendo preservación de datos y bloqueo de duplicados.
- [ ] 6.4 Validar al menos un formulario con JavaScript deshabilitado para confirmar el envío nativo mediante `action` y `method`.
- [ ] 6.5 Realizar una prueba real controlada de cada formulario con una clave y dominio autorizados, confirmar la recepción y evitar repeticiones rápidas que activen el rate limit.
- [x] 6.6 Buscar en el repositorio `TU_ACCESS_KEY_WEB3FORMS` y lógica de envío antigua para confirmar que no quedan placeholders ni implementaciones duplicadas.
