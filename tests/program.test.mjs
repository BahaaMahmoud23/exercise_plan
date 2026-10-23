import test from 'node:test';
import assert from 'node:assert/strict';
import { workoutPlan } from '../src/data/workoutPlan.ts';
test('Saturday-first Upper/Lower schedule and working volume', () => {
  assert.deepEqual(workoutPlan.map(d => d.title), ['Upper A','Lower A','Rest','Upper B','Lower B','Rest','Rest']);
  assert.deepEqual(workoutPlan.map(d => d.exercises.reduce((n,e) => n + e.sets,0)), [16,16,0,16,17,0,0]);
  for (const day of workoutPlan) {
    assert.equal(new Set(day.exercises.map(e => e.slug)).size, day.exercises.length);
    for (const e of day.exercises) assert.equal(e.reps.length,e.sets);
  }
});
test('all exercise names, order, set targets, and timed plank match the requested program', () => {
 const expected = [
  [['Chest Press',3,'8–12'],['Lat Pulldown',3,'8–12'],['Seated Cable Row',2,'10–12'],['Shoulder Press',2,'10–12'],['Lateral Raise',2,'12–15'],['Triceps Pushdown',2,'10–15'],['Biceps Curl',2,'10–15']],
  [['Leg Press',3,'10–12'],['Romanian Deadlift',2,'8–10'],['Leg Curl',3,'10–12'],['Leg Extension',2,'12–15'],['Calf Raises',3,'12–15'],['Plank',3,'20–40']],
  [['Incline Chest Press',3,'8–12'],['Lat Pulldown (Alternative Grip)',3,'10–12'],['Chest Supported Row',2,'10–12'],['Pec Deck',2,'12–15'],['Reverse Pec Deck',2,'12–15'],['Hammer Curl',2,'10–12'],['Overhead Triceps Extension',2,'10–12']],
  [['Squat / Hack Squat',3,'8–12'],['Hip Thrust',3,'10–12'],['Seated Leg Curl',3,'10–12'],['Leg Extension',2,'12–15'],['Calf Raises',3,'12–15'],['Cable Crunch',3,'12–15']]
 ];
 assert.deepEqual(workoutPlan.filter(d=>!d.isRest).map(d=>d.exercises.map(e=>[e.name,e.sets,e.reps[0]])),expected);
 assert.equal(workoutPlan[1].exercises.at(-1).unit,'seconds');
 assert.deepEqual(workoutPlan.map(d=>d.weekday),['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']);
 assert.equal(workoutPlan.filter(d=>d.isRest && d.cardio).length,2);
});
