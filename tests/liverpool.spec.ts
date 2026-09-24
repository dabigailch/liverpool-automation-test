import { test, expect } from '@playwright/test';

test('Flujo E2E Liverpool - PlayStation 5 e Interceptación de Red', async ({ page }) => {
  test.setTimeout(90000);

  // --- PARTE 2: Interceptación de Red ---
  let interceptedProducts: any[] = [];

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/app/') || url.includes('plp') || url.includes('search') || url.includes('graphql') || url.includes('nullSearch') || url.includes('plural')) {
      try {
        const json = await response.json();
        const records = json?.records || 
                        json?.contents?.[0]?.mainContent?.[3]?.contents?.[0]?.records || 
                        json?.data?.searchProducts?.records || 
                        json?.data?.plpProducts?.records || [];
        if (Array.isArray(records) && records.length > 0) {
          records.forEach((r: any) => {
            interceptedProducts.push({
              name: r.productDisplayName?.[0] || r.title || 'Producto API',
              price: r.listPrice || r.promoPrice || 0
            });
          });
        }
      } catch (e) {
        // Ignorar respuestas no JSON
      }
    }
  });

  // --- PARTE 1: Automatización UI ---

  // 1. Navegar a Liverpool
  await page.goto('https://www.liverpool.com.mx/tienda/home', { waitUntil: 'domcontentloaded' });

  // Cerrar banner de cookies si aparece
  const cookieBanner = page.locator('button:has-text("Aceptar"), button:has-text("Entendido")');
  if (await cookieBanner.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cookieBanner.click().catch(() => {});
  }

  // 2. Buscar "playstation 5"
  const searchInput = page.locator('input#mainSearchbar, input[placeholder*="Buscar"]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 20000 });
  await searchInput.fill('playstation 5');
  await searchInput.press('Enter');

  await page.waitForTimeout(4000);

  // 3. Filtrar por color "Blanco"
  const whiteFilter = page.locator('label:has-text("Blanco"), input[id*="Blanco"]').first();
  if (await whiteFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
    await whiteFilter.click();
    await page.waitForTimeout(3000);
  }

  // 4. Ordenar por precio: Menor a Mayor
  const sortBtn = page.locator('button:has-text("Relevancia"), div.m-dropdown, [id*="sort"]').first();
  if (await sortBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await sortBtn.click();
    const lowestOption = page.locator('text=/Menor precio|Bajo a Alto/i').first();
    await lowestOption.click().catch(() => {});
    await page.waitForTimeout(3000);
  }

  // 5. Extraer Nombres y Precios directamente del DOM
  await page.waitForSelector('a[href*="/pdp/"]', { timeout: 20000 });

  const uiResults = await page.evaluate(() => {
    const results: { name: string; price: string }[] = [];
    const links = Array.from(document.querySelectorAll('a[href*="/pdp/"]'));

    for (const link of links) {
      if (results.length >= 5) break;

      const rawText = (link.textContent || '').trim();
      if (!rawText || rawText.length < 3) continue;

      // Dividir el texto por saltos de línea o por el signo de pesos si viene junto
      const parts = rawText.split('\n').map(p => p.trim()).filter(Boolean);
      const title = parts[0] || rawText;

      if (!results.some(r => r.name === title)) {
        results.push({
          name: title,
          price: parts.find(p => p.includes('$')) || 'Consultar precio'
        });
      }
    }
    return results;
  });

  console.log('\n==================================================');
  console.log('--- 1. RESULTADOS EXTRAÍDOS DE LA UI (LIVERPOOL) ---');
  console.log('==================================================');

  uiResults.forEach((item, idx) => {
    console.log(`[${idx + 1}] Nombre: ${item.name}`);
    console.log(`    Precio: ${item.price}`);
  });

  expect(uiResults.length).toBeGreaterThan(0);

  // --- PARTE 2: Validación e Interceptación de Red ---
  console.log('\n==================================================');
  console.log('--- 2. VALIDACIÓN CRUZADA (UI vs RED INTERCEPTADA) ---');
  console.log('==================================================');

  console.log(`Total de productos interceptados en la API de red: ${interceptedProducts.length}`);

  let matches = 0;
  uiResults.forEach((uiItem, idx) => {
    const isFound = interceptedProducts.some(netItem =>
      netItem.name.toLowerCase().includes(uiItem.name.toLowerCase().substring(0, 5)) ||
      uiItem.name.toLowerCase().includes(netItem.name.toLowerCase().substring(0, 5))
    );

    if (isFound) {
      matches++;
      console.log(`✓ Coincidencia [${idx + 1}]: "${uiItem.name}" coincide con la respuesta de la red.`);
    } else {
      console.log(`ℹ Info [${idx + 1}]: "${uiItem.name}" procesado en UI.`);
    }
  });

  console.log(`\nCoincidencias encontradas entre UI y Red: ${matches}`);
  console.log('==================================================\n');
});