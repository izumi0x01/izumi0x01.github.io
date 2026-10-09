import {test, expect} from '@playwright/test';

test('generated example is visible before Python starts', async ({page}) => {
  const runtime: string[] = [];
  page.on('request', request => { if (/\/lite\/(repl|tree)/.test(request.url())) runtime.push(request.url()); });
  await page.goto('/wiki/python/matplotlib/');
  await expect(page.locator('div.highlight-python')).toContainText('np.sin(x + frame * 0.1)');
  await expect(page.getByRole('link', {name:'GitHubでサンプルを編集'})).toHaveAttribute('href', /examples\/matplotlib\/sine_animation.py$/);
  const gif = page.locator('img[src$="sine_animation.gif"]');
  await expect(gif).toBeVisible();
  expect(await gif.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(runtime).toEqual([]);
  await expect(page.locator('.copybtn').first()).toBeVisible();
  await page.setViewportSize({width:390, height:844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const route of ['matplotlib', 'multiple-plots', 'scatter-plot']) {
test(`real Replite executes shared FuncAnimation: ${route}`, async ({page}) => {
  test.setTimeout(150000);
  test.skip(process.env.JUPYTERLITE_LIVE !== '1', 'Requires Pyodide network access');
  await page.goto(`/wiki/python/${route}/`);
  await page.getByText('Interactive Pythonを起動', {exact:true}).click();
  const repl = page.frameLocator('iframe.jupyterlite_sphinx_iframe');
  const editor = repl.locator('.cm-content[data-language="python"]:not([aria-readonly="true"])').first();
  await expect(editor).toContainText('import numpy as np', {timeout:180000});
  await expect(repl.locator('.animation')).toHaveCount(0);
  await editor.click();
  await editor.press('Shift+Enter');
  await expect(repl.locator('.animation')).toBeVisible({timeout:180000});
  await expect(editor).toContainText('import numpy as np');
  await expect(repl.locator('.animation img')).toHaveAttribute('src', /^data:image/);
  const image = repl.locator('.animation img');
  const first = await image.getAttribute('src');
  await page.screenshot({path:`test-results/shared-replite-${route}.png`, fullPage:true});
  await repl.getByRole('button', {name:/last frame/i}).click({timeout:10000});
  await expect.poll(() => image.getAttribute('src')).not.toBe(first);
  await repl.getByRole('button', {name:/first frame/i}).click({timeout:10000});
  await repl.getByRole('button', {name:/^play$/i}).click({timeout:10000});
  await expect.poll(() => repl.locator('.animation input[type=range]').inputValue()).not.toBe('0');
  await repl.getByRole('button', {name:/^pause$/i}).click({timeout:10000});
  await page.screenshot({path:`test-results/shared-replite-${route}.png`, fullPage:true});
  if (route === 'matplotlib') {
    await editor.fill('print("shared stdout works")\nraise ValueError("shared exception works")');
    await editor.press('Shift+Enter');
    await expect(repl.locator('.jp-OutputArea-output').filter({hasText:'shared stdout works'}).first()).toBeVisible({timeout:60000});
    await expect(repl.locator('.jp-OutputArea-output').filter({hasText:'ValueError'}).first()).toBeVisible({timeout:60000});
  }
});
}
