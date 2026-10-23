import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { readSessions, saveSession, createSession, updateSet, STORAGE_KEY } from '../src/data/tracking.ts';
import {workoutPlan} from '../src/data/workoutPlan.ts';

// Exercise the emitted worker's real event handlers with an in-memory Cache API.
// This verifies worker logic; actual device installation is a separate browser test.
async function runtime(source, shared = new Map()) {
 const handlers = new Map(); let online = true;let skips = 0;let claims = 0;let fetches = 0;
 const absolute = value => new URL(typeof value === 'string' ? value : value.url,'https://workout.test').href;
 const network = async value => {
  fetches++; if(!online)throw new Error('offline');
  return new Response(await readFile('dist'+new URL(absolute(value)).pathname));
 };
 const caches = {
  keys:async()=>[...shared.keys()], delete:async key=>shared.delete(key),
  open:async key=>{
   if(!shared.has(key))shared.set(key,new Map());const data=shared.get(key);
   return {addAll:async requests=>{const responses=await Promise.all(requests.map(network)); requests.forEach((r,i)=>data.set(absolute(r),responses[i]));},match:async request=>data.get(absolute(request))?.clone()};
  }
 };
 const self={location:{origin:'https://workout.test'},clients:{claim:async()=>{claims++;}},skipWaiting:()=>{skips++;},addEventListener:(name,fn)=>handlers.set(name,fn)};
 class WorkerRequest extends Request { constructor(url,options){super(absolute(url),options);} }
 vm.runInNewContext(source,{self,caches,Request:WorkerRequest,URL,fetch:network});
 return {shared,get skips(){return skips;},get claims(){return claims;},get fetches(){return fetches;},setOnline:value=>{online=value;},
  lifecycle:async name=>{let promise;handlers.get(name)({waitUntil:p=>{promise=p;}});await promise;},
  message:data=>handlers.get('message')({data}),
  request:async(url,mode='navigate',range=false)=>{let response;handlers.get('fetch')({request:{url:absolute(url),method:'GET',mode,headers:new Headers(range?{range:'bytes=0-10'}:{})},respondWith:p=>{response=p;}});return response;}
 };
}
const source=await readFile('dist/sw.js','utf8');
test('worker installs complete shell, claims clients, and serves interface/assets offline',async()=>{
 const sw=await runtime(source);await sw.lifecycle('install');assert.equal(sw.skips,0);await sw.lifecycle('activate');assert.equal(sw.claims,1);
 const count=sw.fetches;sw.setOnline(false);
 assert.match(await (await sw.request('/')).text(),/id="root"/);
 const script=source.match(/"(\/assets\/[^" ]+\.js)"/)[1];
 assert.ok((await (await sw.request(script,'cors')).text()).length>1000);
 assert.equal(sw.fetches,count);
 assert.equal(await sw.request('/videos/workout/Plank.mp4','cors',true),undefined,'range requests bypass worker');
});
test('update waits for explicit activation, preserves logs/unrelated caches, and failed install keeps working shell',async()=>{
 const old=await runtime(source);await old.lifecycle('install');await old.lifecycle('activate');
 old.shared.set('unrelated-cache',new Map());
 const storageValues=new Map();const storage={getItem:k=>storageValues.get(k)??null,setItem:(k,v)=>storageValues.set(k,v)};
 const logged=updateSet(createSession(workoutPlan[0],'2026-10-24'),'chest-press',0,{actual:'12',weight:'35',completed:true});
 saveSession(storage,logged);const before=storage.getItem(STORAGE_KEY);
 const next=await runtime(source.replace(/bahaa-app-shell-([a-f0-9]{16})/, 'bahaa-app-shell-new-version'),old.shared);
 await next.lifecycle('install');assert.equal(next.skips,0);assert.equal(old.shared.size,3);
 next.message({type:'ACTIVATE_UPDATE'});assert.equal(next.skips,1);await next.lifecycle('activate');
 assert.equal(old.shared.size,2);assert.ok(old.shared.has('unrelated-cache'));
 assert.equal(storage.getItem(STORAGE_KEY),before);assert.deepEqual(readSessions(storage),[logged]);
 const bad=await runtime(source.replace(/bahaa-app-shell-([a-f0-9]{16})/,'bahaa-app-shell-failed-version'),old.shared);
 bad.setOnline(false);await assert.rejects(()=>bad.lifecycle('install'));assert.ok(old.shared.has('bahaa-app-shell-new-version'));
 next.setOnline(false);assert.match(await (await next.request('/')).text(),/id="root"/);
});
