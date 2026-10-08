import {test, expect} from '@playwright/test';
test('additional Python articles are linked and have inline editors', async ({page}) => {
 await page.goto('/wiki/python/');
 for (const slug of ['numpy-interactive','matplotlib-interactive','animation']) {
  await expect(page.locator(`.wy-nav-content a[href="${slug}/"]`).first()).toBeVisible();
  await page.goto(`/wiki/python/${slug}/`);
  await expect(page.locator('.cm-editor').first()).toBeVisible();
  await expect(page.locator('.python-runtime')).toHaveCount(0);
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.goto('/wiki/python/');
 }
});
test('NumPy and Matplotlib examples execute on the additional pages', async ({page}) => {
 test.skip(process.env.JUPYTERLITE_LIVE !== '1', 'Requires external Pyodide downloads');
 test.setTimeout(360000);
 await page.goto('/wiki/python/numpy-interactive/');
 const numpy = page.locator('.python-interactive');
 await numpy.nth(0).locator('.python-run').click();
 await expect(numpy.nth(0).locator('.python-output')).toContainText('a · b = 32',{timeout:180000});
 await numpy.nth(1).locator('.python-run').click();
 await expect(numpy.nth(1).locator('.python-output')).toContainText('verified = True',{timeout:60000});
 await page.goto('/wiki/python/matplotlib-interactive/');
 for (const block of await page.locator('.python-interactive').all()) {
  await block.locator('.python-run').click();
  await expect(block.locator('img')).toHaveCount(1,{timeout:180000});
  await expect(block.locator('.python-run')).toBeEnabled();
 }
});
test('real FuncAnimation produces distinct frames, plays, pauses and resizes', async ({page}) => {
 test.skip(process.env.JUPYTERLITE_LIVE !== '1', 'Requires external Pyodide downloads');
 test.setTimeout(360000);
 await page.goto('/wiki/python/animation/');
 const block = page.locator('.python-interactive');
 const initialHeight = (await block.boundingBox())!.height;
 await block.locator('.python-run').click();
 const iframe = block.locator('iframe.python-html-output');
 await expect(iframe).toHaveCount(1,{timeout:180000});
 await expect(block.locator('.python-run')).toBeEnabled();
 await expect(iframe).toHaveAttribute('sandbox','allow-scripts');
 const player = page.frameLocator('iframe.python-html-output');
 const image = player.locator('.animation img');
 await expect(image).toBeVisible({timeout:30000});
 await expect.poll(()=>image.evaluate((e: HTMLImageElement)=>e.complete && e.naturalWidth>0)).toBe(true);
 await expect.poll(()=>iframe.evaluate(e=>e.clientHeight)).toBeGreaterThan(150);
 const firstSource = await image.getAttribute('src');
 await iframe.screenshot({path:'test-results/animation-first-frame.png'});
 await player.getByRole('button',{name:'Last frame',exact:true}).click();
 await expect.poll(()=>image.getAttribute('src')).not.toBe(firstSource);
 await iframe.screenshot({path:'test-results/animation-last-frame.png'});
 await player.getByRole('button',{name:'First frame',exact:true}).click();
 await expect(image).toHaveAttribute('src',firstSource!);
 await player.getByRole('button',{name:'Play',exact:true}).click();
 await expect.poll(()=>player.locator('input[type=range]').inputValue()).not.toBe('0');
 await player.getByRole('button',{name:'Pause',exact:true}).click();
 const paused = await player.locator('input[type=range]').inputValue();
 await page.waitForTimeout(250);
 expect(await player.locator('input[type=range]').inputValue()).toBe(paused);
 expect((await block.boundingBox())!.height).toBeGreaterThan(initialHeight);
 // The HTML output cannot access the article or its Python kernel.
 const frame = await iframe.elementHandle().then(handle=>handle!.contentFrame());
 expect(await frame!.evaluate(()=>{try {void parent.document; return false;} catch {return true;}})).toBe(true);
 for (const width of [390,1100]) {
  await page.setViewportSize({width,height:844});
  await expect.poll(async()=>frame!.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
  expect(await frame!.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await block.locator('.python-output').evaluate(e=>e.scrollHeight<=e.clientHeight+1)).toBe(true);
  await iframe.scrollIntoViewIfNeeded();
  await iframe.screenshot({path:`test-results/animation-${width}.png`});
 }
 await block.locator('.python-run').click();
 await expect(block.locator('.python-run')).toBeEnabled({timeout:60000});
 await expect(iframe).toHaveCount(1);
 await expect(player.getByRole('button',{name:'Play',exact:true})).toBeVisible();
 await block.locator('.python-reset').click();
 await expect(iframe).toHaveCount(0);
 expect((await block.boundingBox())!.height).toBeLessThan(initialHeight+10);
});
