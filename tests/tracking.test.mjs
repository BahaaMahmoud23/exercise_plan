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
 const updated = updateSet(old,'chest-press',0,{weight:'30',actual:'12',completed:true});
 assert.equal(old.exercises[0].sets[0].weight,'');
 assert.equal(updated.exercises[0].sets[0].weight,'30');
 const next = createSession(workoutPlan[0],'2026-10-24');
 assert.equal(next.exercises[0].sets[0].weight,'');
 assert.equal(previousPerformance([updated,next],'chest-press','2026-10-24')?.date,'2026-10-17');
 assert.equal(previousPerformance([updated,next],'chest-press','2026-10-16'),undefined);
 assert.equal(createSession(workoutPlan[1],'2026-10-25').exercises.at(-1).unit,'seconds');
});
import { readSessions, saveSession, STORAGE_KEY } from '../src/data/tracking.ts';
test('saving keeps old programs and weeks, deduplicates sessions, and leaves unrelated keys untouched', () => {
 const old = {...createSession(workoutPlan[0],'2026-10-10'), id:'old-program:1',program:'legacy',title:'Push'};
 const values = new Map([[STORAGE_KEY,JSON.stringify([old])],['legacy-data','untouched']]);
 const storage = {getItem:k => values.get(k) ?? null,setItem:(k,v) => values.set(k,v)};
 const current = createSession(workoutPlan[0],'2026-10-24');
 saveSession(storage,current);saveSession(storage,current);
 assert.deepEqual(readSessions(storage).find(s => s.id === old.id),old);
 assert.equal(readSessions(storage).length,2);
 assert.equal(values.get('legacy-data'),'untouched');
 values.set(STORAGE_KEY,'broken json');
 assert.throws(() => saveSession(storage,current));
 assert.equal(values.get(STORAGE_KEY),'broken json');
});
