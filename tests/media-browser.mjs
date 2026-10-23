import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const videos=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!=='http://127.0.0.1:5173')return route.abort();
  const file=path.resolve('dist','.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(path.resolve('dist')+path.sep))return route.abort();
  if(file.endsWith('.mp4'))videos.push(url.pathname);
  try{await route.fulfill({body:await readFile(file),contentType:{'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.webmanifest':'application/manifest+json','.png':'image/png'}[path.extname(file)]??'application/octet-stream'});}catch{await route.fulfill({status:404,body:''});}
 });
 await page.goto('http://127.0.0.1:5173');
 assert.equal(videos.length,0,'initial page must not request any video');
 const demos=[['Upper A','Chest Press'],['Lower A','Romanian Deadlift'],['Lower B','Cable Crunch'],['Lower B','Seated Leg Curl'],['Upper B','Overhead Triceps Extension'],['Upper B','Hammer Curl'],['Upper B','Chest Supported Row'],['Upper B','Lat Pulldown (Alternative Grip)'],['Lower A','Plank']];
 for(const [day,name] of demos){
  await page.locator('.overview-card').filter({has:page.locator('strong',{hasText:day})}).click();
  await page.locator('.exercise-card').filter({has:page.getByRole('heading',{name,exact:true})}).getByRole('button').click();
  assert.equal(await page.locator('.exercise-details video').count(),0);
  await page.getByRole('button',{name:`Load ${name} video`,exact:true}).click();
  const video=page.locator('.exercise-details video');
  await page.waitForFunction(()=>document.querySelector('.exercise-details video')?.videoWidth>0);
  const info=await video.evaluate(v=>({width:v.videoWidth,height:v.videoHeight,fit:getComputedStyle(v).objectFit,inline:v.playsInline,preload:v.preload,autoplay:v.autoplay,box:v.getBoundingClientRect().height}));
  assert.equal(info.fit,'contain');assert.equal(info.inline,true);assert.equal(info.preload,'metadata');assert.equal(info.autoplay,false);assert.ok(info.box<=844*.6+1);
  await video.evaluate(v=>v.play());
  await page.waitForFunction(()=>document.querySelector('.exercise-details video')?.currentTime>0.1);
  await page.setViewportSize({width:1440,height:1000});
  assert.ok(await video.evaluate(v=>v.getBoundingClientRect().height<=560));
  await page.getByRole('button',{name:'Close video',exact:true}).click();assert.equal(await video.count(),0);
  console.log(`PASS playback mobile/desktop: ${name} (${info.width}x${info.height})`);
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Back to plan',exact:true}).click();
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 console.log('PASS lazy media loading, controls, cleanup and no horizontal mobile overflow');
}finally{await browser.close();}
