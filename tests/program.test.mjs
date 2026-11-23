import test from 'node:test';
import assert from 'node:assert/strict';
import { workoutPlan } from '../src/data/workoutPlan.ts';

test('Saturday-first hybrid schedule, exercise order and working-set targets', () => {
  assert.deepEqual(workoutPlan.map(day => day.weekday), ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']);
  assert.deepEqual(workoutPlan.map(day => day.title), ['Upper A','Lower + Core','Rest','Upper B','Arms + Calisthenics Skills','Rest','Rest']);
  assert.deepEqual(workoutPlan.map(day => Boolean(day.isRest)), [false,false,true,false,false,true,true]);
  const expected = [
    [["Incline Dumbbell Press",3,"8–12"],["Lat Pulldown",3,"10–12"],["Incline Push-ups",2,"6–10"],["Seated Cable Row",2,"10–12"],["Lateral Raises",2,"12–15"],["Triceps Pushdown",2,"10–12"]],
    [["Leg Press",3,"10–12"],["Romanian Deadlift",3,"8–10"],["Leg Curl",2,"10–12"],["Calf Raises",3,"12–15"],["Dead Bug",3,"10"],["Plank",3,"20–30"]],
    [["Assisted Pull-ups",3,"5–8"],["Chest Press Machine",3,"8–12"],["Chest Supported Row",3,"8–12"],["Incline Chest Fly",2,"12"],["Face Pull",2,"12–15"],["Hammer Curl",2,"10–12"]],
    [["Incline Push-ups",2,"8–12"],["Incline Pike Push-ups",2,"5–8"],["Biceps Curl",3,"10–12"],["Overhead Triceps Extension",3,"10–12"],["Lateral Raises",2,"12–15"],["Hollow Body Hold",3,"15–25"]]
  ];
  const training = workoutPlan.filter(day => !day.isRest);
  assert.deepEqual(training.map(day => day.exercises.map(e => [e.name,e.sets,e.reps[0]])), expected);
  for (const day of workoutPlan) {
    assert.equal(new Set(day.exercises.map(e => e.slug)).size, day.exercises.length);
    for (const e of day.exercises) assert.deepEqual(e.reps, Array(e.sets).fill(e.reps[0]));
  }
  assert.deepEqual(training.flatMap(day => day.exercises.filter(e => e.unit === 'seconds').map(e => e.name)), ['Plank','Hollow Body Hold']);
  assert.equal(workoutPlan.filter(day => day.isRest && day.cardio).length, 2);
});
