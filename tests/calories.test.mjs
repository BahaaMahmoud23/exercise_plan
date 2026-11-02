import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyCalories, weekSummary, saveCalories, readCalories, CALORIE_KEY } from '../src/data/calories.ts';

test('weekly flexibility counts only explicitly closed days and preserves negative balances', () => {
 const data=emptyCalories();
 data.days['2026-10-31']={completed:false,entries:[{id:'1',name:'Chicken',quantity:300,unit:'g',calories:2500,protein:93,meal:'Lunch',notes:''}]};
 let s=weekSummary(data,'2026-11-02');
 assert.equal(s.remaining,14300); assert.equal(s.remainingDays,7);
 data.days['2026-10-31'].completed=true;
 s=weekSummary(data,'2026-11-02');
 assert.equal(s.completed,1); assert.equal(s.remainingDays,6); assert.equal(Math.round(s.average),2383); assert.equal(s.protein,93);
 data.days['2026-10-31'].entries[0].calories=18000;
 assert.equal(weekSummary(data,'2026-11-02').remaining,-1200);
 assert.equal(weekSummary(data,'2026-11-07').consumed,0);
 for(const date of s.dates) data.days[date]={completed:true,entries:[]};
 assert.equal(weekSummary(data,'2026-11-02').average,null);
});

test('isolated storage retains historical budgets, workouts and rejects corruption', () => {
 const values=new Map([['bahaa-workouts.upper-lower.v1','workouts']]);
 const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 const d=emptyCalories();d.weeks['2026-10-31']={budget:17000,reference:2400};
 saveCalories(storage,()=>d);
 saveCalories(storage,current=>({...current,weeks:{...current.weeks,'2026-11-07':{budget:16000,reference:2300}}}));
 assert.equal(readCalories(storage).weeks['2026-10-31'].budget,17000);
 assert.equal(values.get('bahaa-workouts.upper-lower.v1'),'workouts');
 values.set(CALORIE_KEY,'broken');assert.throws(()=>saveCalories(storage,()=>d));assert.equal(values.get(CALORIE_KEY),'broken');
 values.set(CALORIE_KEY,JSON.stringify({...d,days:{bad:{completed:false,entries:[]}}}));assert.throws(()=>readCalories(storage));
});
