export const CALORIE_KEY = 'bahaa-calories.v1';
export const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
export type Food = { id: string; name: string; quantity: number; unit: string; calories: number; protein: number; meal: typeof meals[number]; notes: string };
export type FoodDay = { completed: boolean; entries: Food[] };
export type CalorieData = {
  version: 1;
  proteinTarget: number;
  profile: { weight: number; height: number; age: number; training: number };
  defaults: { budget: number; reference: number };
  weeks: Record<string, { budget: number; reference: number }>;
  days: Record<string, FoodDay>;
};
export function emptyCalories(): CalorieData {
  return { version: 1, proteinTarget: 170, profile: { weight: 114, height: 179, age: 23, training: 4 }, defaults: { budget: 16800, reference: 2400 }, weeks: {}, days: {} };
}
export function calorieDates(anchor: string): string[] {
  const start = new Date(`${anchor}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 1) % 7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setUTCDate(d.getUTCDate() + i); return d.toISOString().slice(0, 10); });
}
export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10);
}
export function dayTotals(day?: FoodDay) {
  return (day?.entries ?? []).reduce((sum, e) => ({ calories: sum.calories + e.calories, protein: sum.protein + e.protein }), { calories: 0, protein: 0 });
}
export function weekSummary(data: CalorieData, anchor: string) {
  const dates = calorieDates(anchor), config = data.weeks[dates[0]] ?? data.defaults;
  const consumed = dates.reduce((n, d) => n + dayTotals(data.days[d]).calories, 0);
  const protein = dates.reduce((n, d) => n + dayTotals(data.days[d]).protein, 0);
  const completed = dates.filter(d => data.days[d]?.completed).length;
  const remainingDays = 7 - completed, remaining = config.budget - consumed;
  return { ...config, dates, consumed, protein, completed, remainingDays, remaining, average: remainingDays ? remaining / remainingDays : null, percentage: consumed / config.budget * 100 };
}
export function proteinSummary(data: CalorieData, consumed: number) {
  const target = data.proteinTarget;
  return { target, remaining: Math.max(0, target - consumed), percentage: consumed / target * 100, weeklyReference: target * 7 };
}
const record = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const number = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const date = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(`${v}T12:00:00Z`).toISOString().slice(0,10) === v;
const config = (v: unknown) => record(v) && number(v.budget) && v.budget > 0 && number(v.reference) && v.reference > 0;
export function readCalories(storage: Pick<Storage, 'getItem'>): CalorieData {
  const raw = storage.getItem(CALORIE_KEY); if (raw === null) return emptyCalories();
  const d: unknown = JSON.parse(raw);
  if (!record(d) || d.version !== 1 || !record(d.profile) || !['weight','height','age','training'].every(k => number(d.profile[k])) || !config(d.defaults) || !record(d.weeks) || !record(d.days) ||
    !Object.entries(d.weeks).every(([key,v]) => date(key) && calorieDates(key)[0] === key && config(v)) ||
    !Object.entries(d.days).every(([key,v]) => date(key) && record(v) && typeof v.completed === 'boolean' && Array.isArray(v.entries) && v.entries.every((e: unknown) => record(e) && typeof e.id === 'string' && typeof e.name === 'string' && e.name.trim() && number(e.quantity) && e.quantity > 0 && typeof e.unit === 'string' && number(e.calories) && number(e.protein) && meals.includes(e.meal) && typeof e.notes === 'string'))) throw new Error('Unrecognized calorie data');
  if (d.proteinTarget !== undefined && (!number(d.proteinTarget) || d.proteinTarget <= 0)) throw new Error('Invalid protein target');
  return { ...d, proteinTarget: d.proteinTarget ?? 170 } as CalorieData;
}
export function saveCalories(storage: Pick<Storage, 'getItem' | 'setItem'>, update: (current: CalorieData) => CalorieData): CalorieData {
  const next = update(readCalories(storage));
  const raw = JSON.stringify(next); readCalories({ getItem: () => raw });
  storage.setItem(CALORIE_KEY, raw); return next;
}
