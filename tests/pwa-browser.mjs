import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';

// Real network/service-worker test. Requires loopback access; route interception
// cannot exercise service-worker installation or offline browser navigation.
let update=false;
const server=createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  const file=path.resolve('dist','.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403);res.end();return;}
  let body=await readFile(file);
  if(url.pathname==='/sw.js'&&update)body=Buffer.from(body.toString().replace(/bahaa-app-shell-([a-f0-9]{16})/,'bahaa-app-shell-browser-update'));
  res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.png':'image/png'}[path.extname(file)]??'application/octet-stream');
  res.setHeader('Cache-Control','no-store');res.end(body);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
const profile=await mkdtemp(path.join(tmpdir(),'workout-pwa-test-'));
let context;
try {
 context=await chromium.launchPersistentContext(profile,{headless:true});
 let page=await context.newPage();await page.goto(url,{timeout:15000});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.getByText('Ready for offline workouts',{exact:true}).waitFor();
 await page.getByLabel('Week containing').fill('2026-10-24');
 await page.locator('.overview-card').first().click();
 await page.getByLabel('Chest Press set 1 reps',{exact:true}).fill('12');
 await page.getByLabel('Chest Press set 1 weight kg',{exact:true}).fill('35');
 await page.getByLabel('Chest Press set 1 completed',{exact:true}).check();
 const before=await page.evaluate(()=>localStorage.getItem('bahaa-workouts.upper-lower.v1'));
 update=true;
 await page.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration();await reg.update();});
 await page.getByRole('button',{name:'Reload to update',exact:true}).waitFor();
 assert.equal(await page.getByLabel('Chest Press set 1 reps',{exact:true}).inputValue(),'12','update did not interrupt workout');
 await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:'Reload to update',exact:true}).click()]);
 assert.equal(await page.evaluate(()=>localStorage.getItem('bahaa-workouts.upper-lower.v1')),before);
 await context.setOffline(true);await page.reload();
 await page.getByLabel('Week containing').fill('2026-10-24');await page.locator('.overview-card').first().click();
 await page.getByLabel('Chest Press set 2 reps',{exact:true}).fill('10');
 const offlineLog=await page.evaluate(()=>localStorage.getItem('bahaa-workouts.upper-lower.v1'));
 await context.close();context=await chromium.launchPersistentContext(profile,{headless:true});
 await context.setOffline(true);page=await context.newPage();await page.goto(url);
 assert.equal(await page.evaluate(()=>localStorage.getItem('bahaa-workouts.upper-lower.v1')),offlineLog);
 await page.getByRole('heading',{name:'Workout history',exact:true}).waitFor();
 console.log('PASS real worker installation/activation, waiting update, offline shell/logging, and offline browser restart with preserved history');
}finally {
 if(context)await context.close();await new Promise(r=>server.close(r));
 // Only remove the exact temp directory created above.
 if(path.dirname(profile)===tmpdir()&&path.basename(profile).startsWith('workout-pwa-test-'))await rm(profile,{recursive:true,force:true});
}
