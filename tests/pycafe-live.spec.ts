import {test, expect} from '@playwright/test';
// Explicit opt-in: CI validates local markup without requiring PyCafe uptime.
test('PyCafe executes NumPy and renders Matplotlib', async ({page}) => {
 test.setTimeout(480000);
 test.skip(process.env.PYCAFE_LIVE !== '1', 'External service test; opt in with PYCAFE_LIVE=1');
 await page.goto('/wiki/python/matplotlib/');
 const count = await page.locator('.pycafe-example iframe').count();
 for (let i = 0; i < count; i++) {
  await page.locator('.pycafe-example iframe').nth(i).scrollIntoViewIfNeeded();
  const app = page.frameLocator('.pycafe-example iframe').nth(i);
  await expect(app.frameLocator('iframe#app').locator('img').first()).toBeVisible({timeout:180000});
  console.log(`PyCafe plot ${i + 1} rendered`);
 }
 const edit = await page.locator('.pycafe-example a').first().getAttribute('href');
 await page.goto(edit!);
 const editor = page.locator('.monaco-editor textarea').first();
 await expect(page.locator('.monaco-editor').first()).toBeVisible({timeout:180000});
 await editor.focus();
 await editor.press('Control+A');
 await editor.fill('import solara\n\n@solara.component\ndef Page():\n    solara.Text("edited successfully")\n');
 await expect(page.locator('.monaco-editor').first()).toContainText('edited successfully');
 await page.locator('button').filter({hasText:/^save$/}).click({timeout:15000});
 await page.locator('button').filter({hasText:/^refresh$/}).click({timeout:15000});
 await expect(page.frameLocator('iframe#app').getByText('edited successfully')).toBeVisible({timeout:180000});
});
