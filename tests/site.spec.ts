import {test,expect} from '@playwright/test';
test('portfolio navigation, sample labels, publication filter and mobile',async({page})=>{
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('動きを理解する');
 for(const route of ['about','research','publications','projects','wiki']){
  const response=await page.goto(`/${route}/`); expect(response?.status()).toBe(200);
 }
 await page.goto('/publications/');
 await page.selectOption('#publication-filter','journal');
 await expect(page.locator('#empty-publications')).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('real Python runtime, plots, errors, reset, isolation and stop',async({page})=>{
 await page.goto('/wiki/python/matplotlib/');
 const first=page.locator('.python-runner').nth(0);
 const second=page.locator('.python-runner').nth(1);
 await expect(page.locator('.katex').first()).toBeVisible();
 await first.getByRole('button',{name:'Run'}).click();
 await expect(first.locator('.runner-status')).toHaveText('実行完了',{timeout:180000});
 await expect(first.locator('.runner-output img')).toBeVisible();
 await expect(first.locator('.runner-output')).toContainText('samples: 100');
 await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.runner-output')).toHaveText('5');
 const edit=async(code:string)=>{const content=second.locator('.cm-content');await content.click();await page.keyboard.press('ControlOrMeta+a');await page.keyboard.insertText(code);};
 await edit('print(x)'); await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.error')).toContainText('NameError');
 await edit('raise ValueError("test error")');await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.error')).toContainText('test error');
 await second.getByRole('button',{name:'Reset'}).click();
 await expect(second.locator('.cm-content')).toHaveText('print(2 + 3)');
 await first.getByRole('button',{name:'Run'}).click();await expect(first.locator('.runner-status')).toHaveText('実行完了');
 await expect(first.locator('.runner-output img')).toHaveCount(1);
 await edit('while True:\n    pass');await second.getByRole('button',{name:'Run'}).click();
 await expect(second.locator('.runner-status')).toHaveText('実行中…');
 await second.getByRole('button',{name:'Stop'}).click();
 await expect(second.locator('.error')).toContainText('停止');
});
test('wiki sidebar and production search',async({page})=>{
 await page.goto('/wiki/python/numpy/');
 await expect(page.locator('.sidebar-content')).toBeVisible();
 await page.locator('button[data-open-modal]').click();
 const search=page.locator('.pagefind-ui__search-input');await search.fill('順運動学');
 await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
});
test('multiple figures and all sample calculations',async({page})=>{
 for(const [route,graphs] of [['python/numpy',0],['python/multiple-plots',2],['python/artists',1],['robotics/rotation',1],['robotics/kinematics',1],['robotics/dynamics',1],['robotics/rrt',1],['mathematics/linear-algebra',0]] as const){
  await page.goto(`/wiki/${route}/`);
  const cell=page.locator('.python-runner').first();
  await cell.getByRole('button',{name:'Run'}).click();
  await expect(cell.locator('.runner-status')).toHaveText('実行完了',{timeout:180000});
  await expect(cell.locator('.runner-output img')).toHaveCount(graphs);
  if(route==='python/numpy')await expect(cell.locator('.runner-output')).toContainText('32');
  if(route==='robotics/rrt')await expect(cell.locator('.runner-output')).toContainText('goal reached: True');
 }
});
