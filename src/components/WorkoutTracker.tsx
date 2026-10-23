import type { WorkoutDay } from "../data/workoutPlan";
import { createSession, previousPerformance, updateSet, type Session } from "../data/tracking";

type Props = { day: WorkoutDay; date: string; sessions: Session[]; onSave: (session: Session) => void };
export function WorkoutTracker({ day, date, sessions, onSave }: Props) {
  const blank = createSession(day, date);
  const session = sessions.find(s => s.id === blank.id) ?? blank;
  const done = session.exercises.reduce((n,e) => n + e.sets.filter(s => s.completed).length, 0);
  const total = session.exercises.reduce((n,e) => n + e.sets.length, 0);
  return <section className="tracking-panel" aria-label="Workout tracking">
    <h3>{date} · {done}/{total} sets completed</h3>
    <p>Saved on this browser. Walking is optional and does not affect completion.</p>
    {session.exercises.map(exercise => {
      const previous = previousPerformance(sessions, exercise.slug, date);
      return <section className="exercise-log" key={exercise.slug}>
        <h3>{exercise.name}</h3>
        <p>Previous: {previous ? `${previous.date} · ${previous.exercise.sets.filter(s => s.completed).map(s => `${s.actual} ${previous.exercise.unit} × ${s.weight || "0"} kg`).join(" / ")}` : "No earlier logged sets"}</p>
        <div className="set-row set-header"><span>Set / target</span><span>{exercise.unit === "seconds" ? "Seconds" : "Reps"}</span><span>kg</span><span>Done</span></div>
        {exercise.sets.map((set, index) => <div className={`set-row ${set.completed ? "is-completed" : ""}`} key={index}>
          <span>{index + 1} · {set.target} {exercise.unit}</span>
          <input aria-label={`${exercise.name} set ${index + 1} ${exercise.unit}`} type="number" min="0" step="1" value={set.actual}
            onChange={e => { if (e.target.value === "" || Number(e.target.value) >= 0) onSave(updateSet(session,exercise.slug,index,{actual:e.target.value,completed:false})); }} />
          <input aria-label={`${exercise.name} set ${index + 1} weight kg`} type="number" min="0" step="0.5" value={set.weight}
            onChange={e => { if (e.target.value === "" || Number(e.target.value) >= 0) onSave(updateSet(session,exercise.slug,index,{weight:e.target.value})); }} />
          <input aria-label={`${exercise.name} set ${index + 1} completed`} type="checkbox" checked={set.completed} disabled={!set.actual || Number(set.actual) <= 0}
            onChange={e => onSave(updateSet(session,exercise.slug,index,{completed:e.target.checked}))} />
        </div>)}
        <label>Notes<textarea value={exercise.notes} onChange={event => onSave({ ...session, exercises: session.exercises.map(e => e.slug === exercise.slug ? {...e,notes:event.target.value} : e) })} /></label>
      </section>;
    })}
    <button className="back-button" type="button" disabled={done !== total} onClick={() => onSave({...session,completed:!session.completed})}>
      {session.completed ? "Completed · Reopen workout" : "Mark workout completed"}
    </button>
    {done !== total && <p>Log a positive result and check each working set to finish.</p>}
  </section>;
}
export function WorkoutHistory({ sessions }: { sessions: Session[] }) {
  const sorted = [...sessions].sort((a,b) => b.date.localeCompare(a.date));
  return <section className="tracking-panel" id="history" aria-label="Workout history">
    <h2>Workout history</h2><p>{sessions.filter(s => s.completed).length} completed workouts · {sessions.reduce((n,s) => n + s.exercises.reduce((m,e) => m + e.sets.filter(set => set.completed).length,0),0)} logged sets</p>
    {!sorted.length && <p>No workouts logged yet.</p>}
    {sorted.map(s => <details key={s.id}><summary>{s.date} · {s.title} · {s.completed ? "Completed" : "In progress"}</summary>
      {s.exercises.map(e => <p key={e.slug}><strong>{e.name}</strong>: {e.sets.map(set => `${set.actual || "—"}/${set.target} ${e.unit} × ${set.weight || "0"} kg${set.completed ? " ✓" : ""}`).join("; ")}{e.notes ? ` · ${e.notes}` : ""}</p>)}
    </details>)}
  </section>;
}
