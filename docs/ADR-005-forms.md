# ADR-005: Proveedor de formularios (Forms Backend)

**Estado:** ⚠️ Pendiente de decisión
**Fecha:** 2025-06

---

## Contexto

El sitio incluye tres formularios: contacto general, aplicación a vacante y CV espontáneo. Al ser un sitio 100% estático (sin backend propio), los formularios necesitan un servicio de terceros para procesar envíos y notificar por email.

El formulario de vacantes tiene una necesidad especial: idealmente adjuntar CV. Esto limita las opciones del free tier.

---

## Formularios requeridos

| Formulario | Campos | Complejidad |
|------------|--------|-------------|
| Contacto general | Nombre, email, asunto, mensaje | Baja |
| Aplicación a vacante | Nombre, email, teléfono, LinkedIn, motivación | Media |
| CV espontáneo | Nombre, email, área de interés, LinkedIn, motivación | Media |

> **TBD:** Confirmar si se requiere adjuntar CV como archivo o es suficiente con link de LinkedIn.

---

## Opciones evaluadas

| Opción | Free tier | Adjuntos | Notas |
|--------|-----------|----------|-------|
| **Web3Forms** | 250 envíos/mes | ❌ | Muy simple, ideal para contacto |
| **Formspree** | 50 envíos/mes | ✅ (plan paid) | Más control, soporta adjuntos en Basic ($10/mes) |
| **Basin** | 100 envíos/mes | ❌ free / ✅ paid | Buena UX de administración |
| **Netlify Forms** | 100/mes | ❌ | Solo en Netlify — **descartado** |

---

## Recomendación

**Si NO se requiere adjuntar CV (solo LinkedIn):**
→ **Web3Forms** para los tres formularios. Gratuito, sin cuenta requerida.

**Si SÍ se requiere adjuntar CV como archivo:**
→ **Formspree Basic** (~$10 USD/mes) para el formulario de vacantes; Web3Forms para contacto.

---

## Decisión

🟡 **Pendiente** — requiere confirmar la política de recepción de CVs con el cliente.

---

## Impacto en desarrollo

Esta decisión debe tomarse **antes de desarrollar los componentes de formulario**. El endpoint y los atributos HTML dependen del proveedor elegido.
