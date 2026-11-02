import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const browser=await chromium.launch();
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:950}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!=='http://127.0.0.1:5173')return route.abort();
   const file=path.resolve('dist','.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
   if(!file.startsWith(path.resolve('dist')+path.sep))return route.abort();
   try {await route.fulfill({body:await readFile(file),contentType:{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[path.extname(file)]??'application/octet-stream'});}catch{await route.fulfill({status:404,body:''});}
  });
  await page.goto('http://127.0.0.1:5173');
  const original=await page.evaluate(()=>{localStorage.setItem('unrelated','keep');return localStorage.getItem('bahaa-workouts.upper-lower.v1');});
  const open=()=>page.getByRole('button',{name:'حساب السعرات | Calorie Tracker',exact:true}).click();
  await open();
  await page.getByLabel('تاريخ التسجيل',{exact:true}).fill('2026-10-31');
  await page.getByLabel('اسم الطعام',{exact:true}).fill('Chicken');
  await page.getByLabel('الكمية',{exact:true}).fill('300');
  await page.getByLabel('السعرات (kcal)',{exact:true}).fill('2500');
  await page.getByLabel('البروتين (g)',{exact:true}).fill('93');
  await page.getByRole('button',{name:'إضافة طعام',exact:true}).click();
  await page.getByRole('button',{name:'إنهاء اليوم',exact:true}).click();
  assert.match(await page.locator('.calorie-stats').innerText(),/14,300/);
  assert.match(await page.locator('.calorie-stats').innerText(),/2,383.3/);
  assert.equal(await page.getByRole('button',{name:'تعديل Chicken'}).isDisabled(),true);
  await page.getByRole('button',{name:'إعادة فتح اليوم'}).click();
  await page.getByRole('button',{name:'تعديل Chicken'}).click();
  await page.getByLabel('السعرات (kcal)',{exact:true}).fill('495');
  await page.getByRole('button',{name:'حفظ التعديل',exact:true}).click();
  await page.reload();await open();
  await page.getByLabel('تاريخ التسجيل',{exact:true}).fill('2026-10-31');
  assert.match(await page.locator('.calorie-entries').innerText(),/495/);
  await page.getByRole('button',{name:'الأسبوع التالي',exact:true}).click();
  assert.equal(await page.locator('.calorie-entries li').count(),0);
  await page.getByRole('button',{name:'الأسبوع السابق',exact:true}).click();
  assert.equal(await page.locator('.calorie-entries li').count(),1);
  page.once('dialog',dialog=>dialog.dismiss());
  await page.getByRole('button',{name:'حذف Chicken'}).click();
  assert.equal(await page.locator('.calorie-entries li').count(),1);
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'حذف Chicken'}).click();
  assert.equal(await page.locator('.calorie-entries li').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated')),'keep');
  assert.equal(await page.evaluate(()=>localStorage.getItem('bahaa-workouts.upper-lower.v1')),original);
  await page.getByRole('button',{name:'العودة للتمارين'}).click();
  assert.equal(await page.locator('.overview-card').count(),7);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log('Calorie desktop/mobile CRUD, confirmation, completion, reopening, refresh, history, storage isolation and layout passed.');
} finally {await browser.close();}
