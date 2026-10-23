import type { WorkoutDay } from "../data/workoutPlan";

type WorkoutOverviewCardProps = {
  day: WorkoutDay;
  active: boolean;
  today: boolean;
  completed: boolean;
  onSelect: () => void;
};

export function WorkoutOverviewCard({ day, active, today, completed, onSelect }: WorkoutOverviewCardProps) {
  const exerciseCount = day.isRest ? "Recovery" : `${day.exercises.length} exercises`;

  return (
    <button className={`overview-card ${active ? "is-active" : ""} ${today ? "is-today" : ""} ${completed ? "is-completed" : ""}`} aria-current={today ? "date" : undefined} onClick={onSelect} type="button">
      <span className="day-kicker">{day.weekday}{today ? " · Today" : ""}</span>
      <strong>{day.title}</strong>
      <p>{day.description}</p>
      <div className="card-meta">
        <span>{exerciseCount}</span>
        <span>{day.targetMuscles.slice(0, 2).join(" / ")}</span>
      </div>
      <div className="badge-row">
        {day.targetMuscles.map((muscle) => (
          <span className="badge" key={`${day.day}-${muscle}`}>
            {muscle}
          </span>
        ))}
      </div>
      <span className="card-cta">{completed ? "✓ Completed" : day.isRest ? "View Recovery" : "Open Workout"}</span>
    </button>
  );
}
