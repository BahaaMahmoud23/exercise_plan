import type { WorkoutDay } from "../data/workoutPlan";

type WorkoutOverviewCardProps = {
  day: WorkoutDay;
  active: boolean;
  onSelect: () => void;
};

export function WorkoutOverviewCard({ day, active, onSelect }: WorkoutOverviewCardProps) {
  const exerciseCount = day.isRest ? "Recovery" : `${day.exercises.length} exercises`;

  return (
    <button className={`overview-card ${active ? "is-active" : ""}`} onClick={onSelect} type="button">
      <span className="day-kicker">Day {day.day} of 7</span>
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
      <span className="card-cta">{day.isRest ? "View Recovery" : "Start Workout"}</span>
    </button>
  );
}
