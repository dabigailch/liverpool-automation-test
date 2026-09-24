# Liverpool E2E Automation Challenge 🛒⚡

![Playwright Tests](https://github.com/dabigailch/liverpool-automation-test/actions/workflows/test.yml/badge.svg)

Proyecto de automatización de pruebas End-to-End (E2E) e interceptación de respuestas de red para el portal de Liverpool México, desarrollado con **Playwright** y **TypeScript**.

---

## Características del Proyecto
- **Flujo UI Automatizado:** Búsqueda ("playstation 5"), filtrado dinámico por color ("Blanco"), ordenamiento por menor precio y extracción de datos del catálogo.
- **Interceptación de Red:** Captura e inspección en tiempo real de las respuestas JSON/API del backend de Liverpool para validación cruzada frente a la UI.
- **Manejo de Resiliencia:** Locadores adaptativos con `page.evaluate()` y esperas explícitas para evitar inestabilidad (*flakiness*).
- **Estrategia QA Documentada:** Documento `TEST_STRATEGY.md` con respuestas sobre CAPTCHAs, pruebas no automatizables, flakiness y escalabilidad en CI/CD.
- **CI/CD Integrado:** Workflow en GitHub Actions (`.github/workflows/test.yml`) para ejecución en la nube y generación de reportes HTML.

---

## Requisitos Previos
- **Node.js:** v18.x o superior
- **npm:** v9.x o superior

---

## Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/dabigailch/liverpool-automation-test.git](https://github.com/dabigailch/liverpool-automation-test.git)
   cd liverpool-automation-test
