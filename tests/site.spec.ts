import {test, expect} from '@playwright/test';
test('single Sphinx HOME, navigation, mobile and edit links', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('Izumi');
 await expect(page.locator('.global-menu a')).toHaveText(['HOME', 'Wiki']);
 await expect(page.locator('.profile-photo')).toBeVisible();
 for (const title of ['Profile','Research Interests','Research Projects','Publications','Education','Experience','Awards','Contact'])
  await expect(page.getByRole('heading', {name:new RegExp(`^${title}`)})).toBeVisible();
 await page.goto('/wiki/python/matplotlib/');
 await expect(page.locator('.wy-nav-side')).toBeVisible();
 await expect(page.getByRole('link',{name:/Edit on GitHub/})).toHaveAttribute('href', /docs\/wiki\/python\/matplotlib.md$/);
 await expect(page.locator('iframe')).toHaveCount(4);
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/wiki/python/matplotlib/']) {
  await page.goto(route);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
test('Sphinx search and mathematics',async({page})=>{
 await page.goto('/wiki/robotics/kinematics/');
 await expect(page.locator('mjx-container').first()).toBeVisible({timeout:60000});
 await page.locator('input[name="q"]').fill('運動学');
 await page.locator('input[name="q"]').press('Enter');
 await expect(page.locator('#search-results a').first()).toBeVisible();
});
test('JupyterLite Python, NumPy, inline Matplotlib and editable errors',async({page})=>{
 await page.goto('/wiki/python/matplotlib/');
 const cell=page.frameLocator('iframe').nth(0);
 const editor=cell.locator('.jp-CodeConsole-promptCell .cm-content');
 await expect(editor).toBeVisible({timeout:180000});
 await editor.click();
 await editor.press('Shift+Enter');
 await expect(cell.locator('.jp-CodeConsole')).toContainText('samples: 100',{timeout:180000});
 await expect(cell.locator('.jp-OutputArea-output img').first()).toBeVisible();
 await editor.fill('raise ValueError("browser test")');
 await editor.press('Shift+Enter');
 await expect(cell.locator('.jp-OutputArea-output').filter({hasText:'ValueError'})).toBeVisible({timeout:60000});
 const second=page.frameLocator('iframe').nth(1);
 const other=second.locator('.jp-CodeConsole-promptCell .cm-content');
 await expect(other).toBeVisible({timeout:180000});
 await other.click(); await other.press('Shift+Enter');
 await expect(second.locator('.jp-OutputArea-output')).toContainText('5',{timeout:180000});
 for (const index of [2,3]) {
  const plot=page.frameLocator('iframe').nth(index);
  const input=plot.locator('.jp-CodeConsole-promptCell .cm-content');
  await expect(input).toBeVisible({timeout:180000});
  await input.click(); await input.press('Shift+Enter');
  await expect(plot.locator('.jp-OutputArea-output img').first()).toBeVisible({timeout:180000});
 }
 await page.reload();
 await expect(page.locator('iframe')).toHaveCount(4);
});
