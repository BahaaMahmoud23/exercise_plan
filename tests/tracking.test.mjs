import test from 'node:test';
import assert from 'node:assert/strict';
import { dateKey, weekDates, dayNumber, createSession, updateSet, previousPerformance } from '../src/data/tracking.ts';
import { workoutPlan } from '../src/data/workoutPlan.ts';
test('calendar repeats Saturday-first across year boundary', () => {
 const dates = weekDates('2027-01-01');
 assert.deepEqual(dates, ['2026-12-26','2026-12-27','2026-12-28','2026-12-29','2026-12-30','2026-12-31','2027-01-01']);
 assert.equal(dayNumber('2026-10-24'),1);
 assert.equal(dayNumber('2026-10-25'),2);
 assert.equal(dateKey(new Date('2026-10-23T22:00:00Z')),'2026-10-24');
});
test('set edits preserve snapshots and previous sessions; comparison excludes future', () => {
 const old = createSession(workoutPlan[0],'2026-10-17');
 const updated = updateSet(old,'incline-chest-press',0,{weight:'30',actual:'12',completed:true});
 assert.equal(old.exercises[0].sets[0].weight,'');
 assert.equal(updated.exercises[0].sets[0].weight,'30');
 const next = createSession(workoutPlan[0],'2026-10-24');
 assert.equal(next.exercises[0].sets[0].weight,'');
 assert.equal(previousPerformance([updated,next],'incline-chest-press','2026-10-24')?.date,'2026-10-17');
 assert.equal(previousPerformance([updated,next],'incline-chest-press','2026-10-16'),undefined);
 assert.equal(createSession(workoutPlan[1],'2026-10-25').exercises.at(-1).unit,'seconds');
});
import { readSessions, saveSession, STORAGE_KEY } from '../src/data/tracking.ts';
test('saving on the same date preserves the legacy workout and calorie history', () => {
 const old = {
   id: 'upper-lower-v1:2026-10-24:upper-a', program: 'upper-lower-v1',
   date: '2026-10-24', title: 'Upper A', completed: true,
   exercises: [{slug:'chest-press',name:'Chest Press',unit:'reps',notes:'Legacy note',
     sets:[{target:'8–12',actual:'12',weight:'35',completed:true}]}],
 };
 const calorieHistory = '{"2026-10-10":{"calories":2200,"protein":150},"2026-10-24":{"calories":2100,"protein":145}}';
 const values = new Map([[STORAGE_KEY,JSON.stringify([old])],['bahaa-calories.v1',calorieHistory]]);
 const storage = {getItem:k => values.get(k) ?? null,setItem:(k,v) => values.set(k,v)};
 const current = createSession(workoutPlan[0],old.date);
 saveSession(storage,current);
 saveSession(storage,current);
 assert.equal(current.program,'hybrid-gym-calisthenics-v1');
 assert.deepEqual(readSessions(storage),[old,current]);
 assert.equal(values.get('bahaa-calories.v1'),calorieHistory);
 values.set(STORAGE_KEY,'broken json');
 assert.throws(() => saveSession(storage,current));
 assert.equal(values.get(STORAGE_KEY),'broken json');
});
