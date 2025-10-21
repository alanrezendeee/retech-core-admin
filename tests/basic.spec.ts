import { test, expect } from '@playwright/test';

test.describe('Retech Core Admin - Basic Tests', () => {
  test('Landing page loads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Retech/i);
    console.log('✅ Landing page OK');
  });

  test('Admin login page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    
    // Debug: screenshot e console
    await page.screenshot({ path: 'tests/screenshots/admin-login.png' });
    
    // Verificar se não é 404
    const title = await page.title();
    console.log('Page title:', title);
    
    const content = await page.content();
    console.log('Has "404"?', content.includes('404'));
    console.log('Has "Admin"?', content.includes('Admin'));
    
    await expect(page.locator('text=Admin')).toBeVisible({ timeout: 5000 });
  });

  test('Painel login page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/painel/login');
    
    await page.screenshot({ path: 'tests/screenshots/painel-login.png' });
    
    const title = await page.title();
    console.log('Page title:', title);
    
    await expect(page.locator('text=Portal')).toBeVisible({ timeout: 5000 });
  });

  test('Painel register page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/painel/register');
    
    await page.screenshot({ path: 'tests/screenshots/painel-register.png' });
    
    const title = await page.title();
    console.log('Page title:', title);
    
    await expect(page.locator('text=Criar Conta')).toBeVisible({ timeout: 5000 });
  });
});

