# ADR-003: Deploy automático — GitHub Actions + FTP

**Estado:** ✅ Aceptada
**Fecha:** 2025-06

---

## Contexto

Al no poder ejecutar Node.js en el servidor, el proceso de build debe ocurrir en un entorno externo antes de subir los archivos estáticos al hosting.

## Decisión

Usar **GitHub Actions** para el pipeline de CI/CD. El trigger es un `push` a la rama `main`.

## Flujo de deploy

```
git push → main
    └── GitHub Actions dispara workflow
            ├── actions/checkout@v4
            ├── actions/setup-node@v4 (Node 22.12)
            ├── npm ci
            ├── npm run build  →  genera /dist
            └── SamKirkland/FTP-Deploy-Action
                    └── sube /dist → /public_html/
```

## Secrets requeridos en GitHub

| Secret | Origen |
|--------|--------|
| `FTP_SERVER` | cPanel → Cuentas FTP → Host |
| `FTP_USERNAME` | cPanel → Cuentas FTP → Usuario |
| `FTP_PASSWORD` | cPanel → Cuentas FTP → Contraseña |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms → access key del correo receptor |

Los secrets se configuran en: `GitHub repo → Settings → Secrets and variables → Actions`.

El workflow ejecuta `npm run check` y `npm test` antes del build. `npm run build` falla si `PUBLIC_WEB3FORMS_ACCESS_KEY` falta o contiene un placeholder, por lo que el paso FTP no inicia con una configuración incompleta.

## Consecuencias

| | Detalle |
|-|---------|
| ✅ | Deploy automático en cada push a `main` — sin pasos manuales |
| ✅ | Credenciales nunca expuestas en el código fuente |
| ✅ | Si el build falla, el sitio en producción no se toca |
| ⚠️ | FTP transmite en texto plano; mejora futura: migrar a SFTP si HostGator lo permite |
| ⚠️ | El primer deploy puede ser lento (sube todos los archivos); los siguientes son incrementales |
