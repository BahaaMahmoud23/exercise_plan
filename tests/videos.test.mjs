import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { workoutPlan } from '../src/data/workoutPlan.ts';
test('current exercises retain matching local demos and supplied demo files are preserved', () => {
 const exercises = workoutPlan.flatMap(day => day.exercises);
 const supplied = ['Chest Press','Romanian Deadlift','Cable Crunch','Seated Leg Curl','Overhead Triceps Extension','Hammer Curl','Chest Supported Row','Lat Pulldown (Alternative Grip)','Plank'];
 for (const name of supplied) {
   assert.ok(existsSync(`public/videos/workout/${name}.mp4`), name);
 }
 for (const exercise of exercises.filter(e => e.video)) {
   assert.ok(existsSync('public' + decodeURIComponent(exercise.video)), exercise.name);
 }
 const chestPress = exercises.find(e => e.name === 'Chest Press Machine');
 assert.equal(chestPress.video, '/videos/workout/Chest%20Press.mp4');
});