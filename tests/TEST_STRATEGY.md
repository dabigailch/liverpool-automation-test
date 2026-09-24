# Estrategia de Pruebas y Automatización - Liverpool E2E Challenge

## 1. Arquitectura de la Solución
- **Framework:** Playwright con TypeScript.
- **Enfoque de Selección:** Manejo de selectores adaptativos mediante `page.evaluate()` y expresiones regulares para evitar bloqueos por cambios dinámicos en el DOM y clases CSS ofuscadas.
- **Captura de Red:** Escucha asíncrona de eventos de respuesta (`page.on('response')`) para validar la consistencia entre los datos renderizados en UI y la respuesta JSON del backend.

## 2. Estrategias de Mitigación

### A. Anti-Bot / CAPTCHA / Cloudflare
- **Modo Unheaded/Headed:** Ejecución en modo `--headed` para navegación normal o uso de navegadores con contextos de usuario reales (`user-data-dir`).
- **User-Agent & Encabezados:** Configurar encabezaos HTTP reales (`User-Agent`, `Accept-Language`) en la configuración del navegador.
- **Evasión de Bot:** Integración de herramientas como `playwright-extra` con el plugin `puppeteer-extra-plugin-stealth` si se activa verificación por Cloudflare o Akamai.
- **Uso de APIs:** Si el CAPTCHA bloquea completamente la interfaz, realizar pruebas directas sobre la API del catálogo utilizando tokens de sesión pre-generados.

### B. Manejo de Inestabilidad (Flakiness)
- **Auto-waiting:** Priorizar selectores nativos de Playwright que esperan visibilidad e interactividad explícita.
- **Reintentos en CI/CD:** Configurar `retries: 2` en `playwright.config.ts` para reintentar automáticamente pruebas fallidas por latencia.
- **Aislamiento de Estado:** Cada prueba corre en un `browserContext` completamente nuevo e independiente para evitar almacenamiento de cookies o caché previo.

## 3. Integración Continua (CI/CD)
El flujo está diseñado para ejecutarse automáticamente mediante **GitHub Actions** en cada `push` o `pull_request` a la rama principal (`main`), generando reportes HTML y artefactos (capturas y trazas de depuración) disponibles al finalizar la ejecución.