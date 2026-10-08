import {test, expect} from '@playwright/test';
test('single Sphinx HOME, navigation, mobile and edit links', async ({page}) => {
 await page.route('https://py.cafe/**', route=>route.abort());
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('Izumi');
 await expect(page.locator('.global-menu a')).toHaveText(['HOME', 'Wiki']);
 await expect(page.locator('.profile-photo')).toBeVisible();
 for (const title of ['Profile','Research Interests','Research Projects','Publications','Education','Experience','Awards','Contact'])
  await expect(page.getByRole('heading', {name:new RegExp(`^${title}`)})).toBeVisible();
 await page.goto('/wiki/python/matplotlib/');
 await expect(page.locator('.wy-nav-side')).toBeVisible();
 await expect(page.getByRole('link',{name:/Edit on GitHub/})).toHaveAttribute('href', /docs\/wiki\/python\/matplotlib.md$/);
 await expect(page.locator('iframe')).toHaveCount(3);
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
test('PyCafe embeds have responsive dimensions and fallback editor links',async({page})=>{
 // CI must succeed independently of external service availability.
 await page.route('https://py.cafe/**', route=>route.abort());
 await page.goto('/wiki/python/matplotlib/');
 const frames = page.locator('.pycafe-example iframe');
 await expect(frames).toHaveCount(3);
 for (let i = 0; i < 3; i++) {
  await expect(frames.nth(i)).toHaveAttribute('src', /^https:\/\/py\.cafe\/embed\?apptype=solara.*#c=/);
  await expect(frames.nth(i)).toHaveAttribute('width', '100%');
  await expect(frames.nth(i)).toHaveAttribute('height', '500');
  await expect(frames.nth(i)).toHaveAttribute('title', /NumPyとMatplotlib/);
  await expect(frames.nth(i)).toHaveAttribute('loading', 'lazy');
 }
 await expect(page.getByRole('link', {name:/Edit on PyCafe/})).toHaveCount(3);
 await page.setViewportSize({width:390,height:844});
 const bounds = await frames.first().boundingBox();
 expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
 for (const route of ['/wiki/python/basics/','/wiki/robotics/rrt/','/wiki/mathematics/linear_algebra/']) {
  await page.goto(route);
  await expect(page.locator('.pycafe-example iframe')).toHaveCount(1);
  await expect(page.getByRole('link',{name:/Edit on PyCafe/})).toBeVisible();
 }
});
