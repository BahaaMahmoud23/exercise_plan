import type { Exercise } from "../data/workoutPlan";

type ExerciseCardProps = {
  exercise: Exercise;
  active: boolean;
  index: number;
  onSelect: () => void;
};

export function ExerciseCard({ exercise, active, index, onSelect }: ExerciseCardProps) {
  return (
    <article className={`exercise-card ${active ? "is-active" : ""}`}>
      <div className="exercise-card-body">
        <div className="exercise-card-title">
          <span className="exercise-index">{index + 1}</span>
          <div>
            <span className="section-kicker">{exercise.targetMuscle}</span>
            <h3>{exercise.name}</h3>
          </div>
        </div>
        <div className="exercise-card-summary">
          <span>
            <b>{exercise.sets}</b>
            Sets
          </span>
          <span>
            <b>{exercise.reps.join(" / ")}</b>
            Reps
          </span>
        </div>
        <button type="button" onClick={onSelect}>
          {active ? "Current" : "Open"}
        </button>
      </div>
    </article>
  );
}
