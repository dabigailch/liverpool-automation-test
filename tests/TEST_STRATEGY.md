# Estrategia de Pruebas y Automatización - Liverpool E2E Challenge

## 1. ¿Qué NO automatizaría en este flujo y por qué?
- **Proceso de pago real con pasarelas bancarias (3DSecure/OTP):** Requiere autenticación de dos factores (SMS/Token) que varía según el banco y puede bloquear tarjetas de prueba.
- **Validación de elementos publicitarios dinámicos:** Los banners emergentes cambian constantemente y agregan inestabilidad sin aportar valor crítico al core del negocio.

## 2. Manejo de CAPTCHA / Anti-Bots
- **En ambientes de STG/QA:** Solicitar la desactivación del WAF (Akamai/Cloudflare) o whitelist de IPs de los ejecutores de CI/CD.
- **En producción (si fuera necesario):** Uso de encabezados HTTP reales (`User-Agent`), plugins de stealth (`puppeteer-extra-plugin-stealth`), o derivar la prueba a nivel API mediante tokens de sesión pre-generados.

## 3. Mitigación de Inestabilidad (Flakiness)
- **Auto-waiting:** Priorización de selectores semánticos que esperan interactividad explícita.
- **Aislamiento de contexto:** Ejecución de cada prueba en un `browserContext` nuevo para evitar ruidos de cookies o sesión previo.
- **Reintentos en CI/CD:** Configuración de `retries: 2` en `playwright.config.ts`.

## 4. Escalabilidad en un CI con 50+ Test Suites
- **Ejecución Paralela / Sharding:** Distribuir la carga entre múltiples contenedores de GitHub Actions usando `matrix`.
- **Estrategia de Etiquetado (Tagging):** Ejecutar solo suites críticas (`@smoke`) en cada PR y el suite completo (`@regression`) en horarios nocturnos.
- **Caché de Dependencias:** Reutilizar dependencias de `npm` y binarios de navegadores entre ejecuciones para reducir tiempos.