# Liverpool E2E Automation

Proyecto de automatización de pruebas End-to-End (E2E) e interceptación de respuestas de red para el portal de Liverpool México, desarrollado con Playwright y TypeScript.

## Características
- Búsqueda y Filtros: Automatización de búsqueda ("playstation 5"), filtrado por color ("Blanco") y ordenamiento por menor precio.
- Extracción de UI: Captura de los primeros 5 productos renderizados (nombre y precio) mediante locadores adaptativos.
- Interceptación de Red: Captura en tiempo real de las respuestas JSON de la API de Liverpool para validación cruzada.
- CI/CD Integrado: Flujo automatizado mediante GitHub Actions.

## Requisitos Previos
- Node.js (v18 o superior)
- npm

## Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/dabigailch/liverpool-automation-test.git
   cd liverpool-automation-test
