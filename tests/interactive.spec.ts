import {test, expect} from '@playwright/test';
test('inline Python editor, lazy runtime and responsive initial layout', async ({page}) => {
 await page.goto('/wiki/python/interactive/');
 await expect(page.locator('.cm-editor')).toHaveCount(3);
 await expect(page.locator('.python-runtime')).toHaveCount(0);
 await expect(page.locator('.python-output').first()).toBeHidden();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/inline-initial-mobile.png',fullPage:true});
});
test('real JupyterLite execution, resizing, multiple figures and errors', async ({page}) => {
 test.skip(process.env.JUPYTERLITE_LIVE !== '1', 'Run with JUPYTERLITE_LIVE=1; downloads the external Pyodide runtime');
 test.setTimeout(360000);
 await page.goto('/wiki/python/interactive/');
 const blocks = page.locator('.python-interactive');
 const first = blocks.nth(0);
 const before = (await first.boundingBox())!.height;
 await first.locator('.python-run').click();
 await expect(first.locator('img')).toHaveCount(1,{timeout:180000});
 await expect(first.locator('.python-run')).toBeEnabled({timeout:60000});
 expect((await first.boundingBox())!.height).toBeGreaterThan(before);
 for (const i of [1,2]) {
  await blocks.nth(i).locator('.python-run').click();
  await expect(blocks.nth(i).locator('img')).toHaveCount(i===2?2:1,{timeout:60000});
  await expect(blocks.nth(i).locator('.python-run')).toBeEnabled();
 }
 const check = async () => {
  for (const block of await blocks.all()) {
   expect(await block.locator('.python-output').evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true);
   expect(await block.locator('.cm-scroller').evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true);
  }
 };
 await check();
 await page.screenshot({path:'test-results/inline-figures-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await check();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/inline-figures-mobile.png',fullPage:true});
 await first.locator('.python-run').click();
 await expect(first.locator('.python-run')).toBeEnabled({timeout:60000});
 await expect(first.locator('img')).toHaveCount(1);
 await first.locator('.python-reset').click();
 expect((await first.boundingBox())!.height).toBeLessThan(before+100);
 const edit = first.locator('.cm-content');
 await edit.fill('print("hello")\n1 / 0');
 await first.locator('.python-run').click();
 await expect(first.locator('.python-output')).toContainText('ZeroDivisionError',{timeout:60000});
 await expect(first.locator('.python-output')).toContainText('hello');
 await edit.fill('import numpy as np\nnp.arange(3)');
 await first.locator('.python-run').click();
 await expect(first.locator('.python-output')).toContainText('array([0, 1, 2])',{timeout:60000});
 await expect(page.locator('.python-runtime')).toHaveCount(1);
});
