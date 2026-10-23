import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const browser = await chromium.launch();
try {
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*', async route => {
   const url = new URL(route.request().url());
   if (url.origin !== 'http://127.0.0.1:5173') return route.abort();
   const file = path.resolve('dist', '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
   if (!file.startsWith(path.resolve('dist') + path.sep)) return route.abort();
   try {
     const contentType = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.jpg':'image/jpeg'}[path.extname(file)] ?? 'application/octet-stream';
     await route.fulfill({body:await readFile(file),contentType});
   } catch { await route.fulfill({status:404,body:''}); }
 });
 await page.goto('http://127.0.0.1:5173');
 await page.evaluate(() => localStorage.setItem('unrelated-history','keep'));
 await page.getByLabel('Week containing').fill('2026-10-24');
 const upper = page.locator('.overview-card').filter({has:page.locator('strong',{hasText:'Upper A'})});
 await upper.click();
 await page.getByLabel('Chest Press set 1 reps',{exact:true}).fill('12');
 await page.getByLabel('Chest Press set 1 weight kg',{exact:true}).fill('35');
 await page.getByLabel('Chest Press set 1 completed',{exact:true}).check();
 await page.reload();
 await page.getByLabel('Week containing').fill('2026-10-24');
 await upper.click();
 await assert.equal(await page.getByLabel('Chest Press set 1 weight kg',{exact:true}).inputValue(),'35');
 const inputs = page.locator('.exercise-log input[type=number]');
 for (let i=0;i<await inputs.count();i++) await inputs.nth(i).fill(i%2===0?'12':'35');
 for (const checkbox of await page.locator('.exercise-log input[type=checkbox]').all()) await checkbox.check();
 await page.getByRole('button',{name:'Mark workout completed',exact:true}).click();
 await page.getByRole('button',{name:'Back to plan',exact:true}).click();
 assert.match(await upper.innerText(),/Completed/);
 await page.getByLabel('Week containing').fill('2026-10-31');
 await upper.click();
 assert.match(await page.locator('.exercise-log').first().innerText(),/2026-10-24/);
 assert.equal(await page.getByLabel('Chest Press set 1 reps',{exact:true}).inputValue(),'');
 await page.getByLabel('Chest Press set 1 reps',{exact:true}).fill('10');
 const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('bahaa-workouts.upper-lower.v1')));
 assert.equal(stored.length,2);assert.equal(stored.find(s=>s.date==='2026-10-24').completed,true);
 assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-history')),'keep');
 await page.getByRole('button',{name:'Back to plan',exact:true}).click();
 await page.locator('.overview-card').nth(2).click();
 assert.match(await page.locator('.rest-panel').innerText(),/15–20/);
 assert.equal(await page.locator('.tracking-panel').count(),0);
 await page.getByRole('button',{name:'Back to plan',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.locator('.overview-card').nth(1).click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.getByLabel('Plank set 1 seconds',{exact:true}).count(),1);
 assert.deepEqual(errors,[]);
 console.log('PASS desktop/mobile, logging/reload, completion without cardio, previous performance, weekly history preservation, rest days, timed sets');
} finally {await browser.close();}
