import {test,expect} from '@playwright/test';
test('real Python runtime, plots, errors, reset, isolation and stop',async({page})=>{
 await page.goto('/wiki/python/matplotlib.html');
 const first=page.locator('.python-runner').nth(0);
 const second=page.locator('.python-runner').nth(1);
 await expect(page.locator('mjx-container').first()).toBeVisible();
 await first.getByRole('button',{name:'Run'}).click();
 await expect(first.locator('.runner-status')).toHaveText('実行完了',{timeout:180000});
 await expect(first.locator('.runner-output img')).toBeVisible();
 await expect(first.locator('.runner-output')).toContainText('samples: 100');
 await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.runner-output')).toHaveText('5');
 const edit=async(code:string)=>{const content=second.locator('textarea');await content.fill(code);};
 await edit('print(x)'); await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.error')).toContainText('NameError');
 await edit('raise ValueError("test error")');await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.error')).toContainText('test error');
 await second.getByRole('button',{name:'Reset'}).click();
 await expect(second.locator('textarea')).toHaveValue('print(2 + 3)');
 await first.getByRole('button',{name:'Run'}).click();await expect(first.locator('.runner-status')).toHaveText('実行完了');
 await expect(first.locator('.runner-output img')).toHaveCount(1);
 for(const index of [2,3]){
  const cell=page.locator('.python-runner').nth(index);
  await cell.getByRole('button',{name:'Run'}).click();
  await expect(cell.locator('.runner-status')).toHaveText('実行完了');
  await expect(cell.locator('.runner-output img')).toHaveCount(1);
 }
 await edit('while True:\n    pass');await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.runner-status')).toHaveText('実行中…');
 await second.getByRole('button',{name:'Stop'}).click();
 await expect(second.locator('.error')).toContainText('停止');
});
test('wiki sidebar and production search',async({page})=>{
 await page.goto('/wiki/python/numpy.html');
 await expect(page.locator('.wy-nav-side')).toBeVisible();
 await page.locator('input[name="q"]').fill('運動学');
 await page.locator('input[name="q"]').press('Enter');
 await expect(page.locator('#search-results a').first()).toBeVisible();
});
test('multiple figures and all sample calculations',async({page})=>{
 for(const [route,graphs] of [['python/numpy',0],['python/multiple-plots',2],['python/artists',1],['robotics/rotation',1],['robotics/kinematics',1],['robotics/dynamics',1],['robotics/rrt',1],['mathematics/linear-algebra',0]] as const){
  console.log(`Checking ${route}`);
  await page.goto(`/wiki/${route}.html`);
  const cell=page.locator('.python-runner').first();
  await cell.getByRole('button',{name:'Run'}).click();
  await expect(cell.locator('.runner-status')).toHaveText('実行完了',{timeout:180000});
  await expect(cell.locator('.runner-output img')).toHaveCount(graphs);
  if(route==='python/numpy')await expect(cell.locator('.runner-output')).toContainText('32');
  if(route==='robotics/rrt')await expect(cell.locator('.runner-output')).toContainText('goal reached: True');
 }
});

test('single HOME, profile, publications and mobile layout',async({page})=>{
 await page.goto('/');
 await expect(page.locator('h1')).toHaveText('Izumi');
 await expect(page.locator('header nav a')).toHaveText(['HOME','Wiki']);
 await expect(page.locator('.portrait')).toBeVisible();
 await expect(page.locator('#publications')).toContainText('架空');
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/wiki/python/matplotlib.html']){
  await page.goto(path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
