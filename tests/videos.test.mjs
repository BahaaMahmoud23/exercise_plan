import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { workoutPlan } from '../src/data/workoutPlan.ts';
test('all nine supplied demos map to existing encoded public paths', () => {
 const names=['Chest Press','Romanian Deadlift','Cable Crunch','Seated Leg Curl','Overhead Triceps Extension','Hammer Curl','Chest Supported Row','Lat Pulldown (Alternative Grip)','Plank'];
 for (const name of names) {
   const matches=workoutPlan.flatMap(d=>d.exercises).filter(e=>e.name===name);
   assert.equal(matches.length,1);
   assert.equal(decodeURIComponent(matches[0].video),`/videos/workout/${name}.mp4`);
   assert.ok(existsSync('public'+decodeURIComponent(matches[0].video)));
   assert.ok(!matches[0].video.includes(' '));
 }
});
