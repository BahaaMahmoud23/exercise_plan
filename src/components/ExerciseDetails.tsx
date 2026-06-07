import type { Exercise } from "../data/workoutPlan";
import { MediaFrame } from "./MediaFrame";

type ExerciseDetailsProps = {
  exercise: Exercise;
};

export function ExerciseDetails({ exercise }: ExerciseDetailsProps) {
  return (
    <aside className="exercise-details" aria-labelledby="exercise-detail-title">
      <MediaFrame src={exercise.video} poster={exercise.image} title={exercise.name} />
      <div className="detail-content">
        <span className="section-kicker">{exercise.targetMuscle}</span>
        <h2 id="exercise-detail-title">{exercise.name}</h2>
        <div className="detail-stat-row">
          <span>{exercise.sets} sets</span>
          <span>{exercise.reps.join(" / ")} reps</span>
          <span>{exercise.restTime}</span>
        </div>
        <DetailList title="How to perform" items={exercise.instructions} />
        <DetailList title="Form and safety" items={exercise.tips} />
        <DetailList title="Common mistakes" items={exercise.mistakes} />
      </div>
    </aside>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
