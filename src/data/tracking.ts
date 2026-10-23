import type { WorkoutDay } from "./workoutPlan";

export const STORAGE_KEY = "bahaa-workouts.upper-lower.v1";
export type SetLog = { target: string; actual: string; weight: string; completed: boolean };
export type ExerciseLog = { slug: string; name: string; unit: "reps" | "seconds"; sets: SetLog[]; notes: string };
export type Session = { id: string; program: string; date: string; title: string; completed: boolean; exercises: ExerciseLog[] };
export function dateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export function dayNumber(date: string): number {
  return (new Date(`${date}T12:00:00Z`).getUTCDay() + 1) % 7 + 1;
}
export function weekDates(date: string): string[] {
  const start = new Date(`${date}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - dayNumber(date) + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const next = new Date(start);
    next.setUTCDate(start.getUTCDate() + i);
    return next.toISOString().slice(0, 10);
  });
}
export function createSession(day: WorkoutDay, date: string): Session {
  return { id: `upper-lower-v1:${date}:${day.slug}`, program: "upper-lower-v1", date, title: day.title, completed: false,
    exercises: day.exercises.map(e => ({ slug: e.slug, name: e.name, unit: e.unit ?? "reps", notes: "",
      sets: e.reps.map(target => ({ target, actual: "", weight: "", completed: false })) })) };
}
export function updateSet(session: Session, slug: string, index: number, patch: Partial<SetLog>): Session {
  return { ...session, completed: false, exercises: session.exercises.map(e => e.slug !== slug ? e : {
    ...e, sets: e.sets.map((s, i) => i === index ? { ...s, ...patch } : s) }) };
}
export function previousPerformance(sessions: Session[], slug: string, before: string) {
  const session = sessions.filter(s => s.date < before && s.exercises.some(e => e.slug === slug && e.sets.some(set => set.completed)))
    .sort((a,b) => b.date.localeCompare(a.date))[0];
  return session ? { date: session.date, exercise: session.exercises.find(e => e.slug === slug)! } : undefined;
}
export function readSessions(storage: Pick<Storage, "getItem">): Session[] {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(s => s && typeof s.id === "string" && typeof s.date === "string" &&
    typeof s.title === "string" && typeof s.program === "string" && typeof s.completed === "boolean" && Array.isArray(s.exercises) &&
    s.exercises.every((e: ExerciseLog) => e && typeof e.slug === "string" && typeof e.name === "string" &&
      (e.unit === "reps" || e.unit === "seconds") && typeof e.notes === "string" && Array.isArray(e.sets) && e.sets.every(set =>
        set && typeof set.target === "string" && typeof set.actual === "string" && typeof set.weight === "string" && typeof set.completed === "boolean")))) {
    throw new Error("Unrecognized workout data");
  }
  return parsed as Session[];
}
export function saveSession(storage: Pick<Storage, "getItem" | "setItem">, session: Session): Session[] {
  const sessions = readSessions(storage);
  const next = [...sessions.filter(s => s.id !== session.id), session];
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
