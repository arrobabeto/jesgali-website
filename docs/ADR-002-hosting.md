# ADR-002: Hosting en HostGator México — Plan Negocios

**Estado:** ✅ Aceptada
**Fecha:** 2025-06

---

## Contexto

El cliente ya cuenta con un plan de hosting contratado y pagado hasta mayo 2027.

## Decisión

Alojar el sitio en el servidor existente `mx140.hostgator.mx`.

## Especificaciones del servidor

| Parámetro | Valor |
|-----------|-------|
| Proveedor | HostGator México |
| Plan | Negocios |
| Servidor | mx140.hostgator.mx |
| IP | 50.6.138.14 (compartida) |
| SO | Linux x86_64 (Kernel 5.14.0) |
| Web server | Apache 2.4.67 |
| cPanel | v118.0 |
| Directorio raíz | `/home1/gabri423/public_html/` |
| Disco | 49.8 GB disponibles |
| Vigencia | Hasta 20/05/2027 |
| SSH | Disponible |
| Git en cPanel | Disponible |

## Consecuencias

| | Detalle |
|-|---------|
| ✅ | Costo cero adicional (plan ya contratado) |
| ✅ | Soporte hasta 999 dominios — escalable |
| ✅ | SSH disponible para operaciones manuales si se necesitan |
| ⚠️ | Sin Node.js en producción: el build se delega a GitHub Actions (ver ADR-003) |
| ⚠️ | IP compartida: el historial de reputación del servidor es compartido con otros sitios |
