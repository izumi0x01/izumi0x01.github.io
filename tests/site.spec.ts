import {test, expect} from '@playwright/test';
test('HOME, navigation, mobile and edit links', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('Izumi');
 await expect(page.locator('.global-menu a')).toHaveText(['HOME','Wiki']);
 await expect(page.locator('.profile-photo')).toBeVisible();
 await expect(page.locator('script[src*="python-interactive.js"]')).toHaveCount(0);
 for (const title of ['Profile','Research Interests','Research Projects','Publications','Education','Experience','Awards','Contact'])
  await expect(page.getByRole('heading',{name:new RegExp(`^${title}`)})).toBeVisible();
 await page.goto('/wiki/python/matplotlib-interactive/');
 await expect(page.locator('.wy-nav-side')).toBeVisible();
 await expect(page.getByRole('link',{name:/Edit on GitHub/})).toHaveAttribute('href',/docs\/wiki\/python\/matplotlib-interactive.md$/);
 await expect(page.locator('.cm-editor')).toHaveCount(2);
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/wiki/python/matplotlib-interactive/']) {
  await page.goto(route);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
test('Sphinx search and mathematical article',async({page})=>{
 await page.goto('/wiki/python/animation/');
 await expect(page.locator('mjx-container').first()).toBeVisible({timeout:60000});
 await page.locator('input[name="q"]').fill('FuncAnimation');
 await page.locator('input[name="q"]').press('Enter');
 await expect(page.locator('#search-results a').first()).toBeVisible();
});
test('loading progress shows real elapsed time before the kernel is ready',async({page})=>{
 await page.route('**/wiki/lite/tree/index.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Pending initialization</title>'}));
 await page.goto('/wiki/python/numpy-interactive/');
 const block=page.locator('.python-interactive').first();
 await expect(block.locator('.python-loading')).toBeHidden();
 await block.locator('.python-run').click();
 await expect(block.locator('.python-loading')).toBeVisible();
 await expect(block.locator('progress')).toHaveAttribute('max','3');
 await expect(block.locator('progress')).toHaveAttribute('value','0');
 await expect(block.locator('.python-status')).toContainText('JupyterLite');
 const before=await block.locator('.python-timing').textContent();
 await expect.poll(()=>block.locator('.python-timing').textContent()).not.toBe(before);
 await expect(block.locator('.python-run')).toBeDisabled();
 await page.screenshot({path:'test-results/python-loading-progress.png',fullPage:true});
});
