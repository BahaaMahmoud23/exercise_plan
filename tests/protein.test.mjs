import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyCalories,readCalories,saveCalories,proteinSummary} from '../src/data/calories.ts';
test('protein independent daily goal, weekly reference and legacy storage compatibility',()=>{
 const d=emptyCalories(); assert.equal(d.proteinTarget,170);
 assert.deepEqual(proteinSummary(d,93),{target:170,remaining:77,percentage:93/170*100,weeklyReference:1190});
 assert.equal(proteinSummary(d,200).remaining,0);
 d.defaults.budget=12000;assert.equal(proteinSummary(d,0).target,170);
 const legacy={...d};delete legacy.proteinTarget;
 const storage={getItem:()=>JSON.stringify(legacy)};
 assert.equal(readCalories(storage).proteinTarget,170);
 let raw=JSON.stringify(d);const s={getItem:()=>raw,setItem:(_,v)=>raw=v};
 saveCalories(s,x=>({...x,proteinTarget:180}));
 assert.equal(proteinSummary(readCalories(s),0).weeklyReference,1260);
 assert.throws(()=>saveCalories(s,x=>({...x,proteinTarget:0})));
});
