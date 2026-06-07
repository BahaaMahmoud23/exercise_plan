import type { Exercise, WorkoutDay } from "../data/workoutPlan";
import { ExerciseCard } from "./ExerciseCard";
import { ExerciseDetails } from "./ExerciseDetails";
import { RestDayCard } from "./RestDayCard";
import { WarmupCard } from "./WarmupCard";
import { CardioCard } from "./CardioCard";

type WorkoutDayDetailsProps = {
  day: WorkoutDay;
  selectedExercise: Exercise | null;
  onSelectExercise: (exercise: Exercise) => void;
};

export function WorkoutDayDetails({ day, selectedExercise, onSelectExercise }: WorkoutDayDetailsProps) {
  if (day.isRest) {
    return <RestDayCard day={day} />;
  }

  const activeExercise = selectedExercise ?? day.exercises[0];
  const handleExerciseSelect = (exercise: Exercise) => {
    onSelectExercise(exercise);
    window.setTimeout(() => {
      document.querySelector(".exercise-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <section className="workout-detail-shell" aria-labelledby="workout-title">
      <div className="workout-heading">
        <div>
          <span className="section-kicker">Day {day.day} of 7</span>
          <h2 id="workout-title">{day.title} Workout</h2>
          <p>{day.description}</p>
        </div>
        <div className="session-pill">{day.exercises.length} exercises</div>
      </div>
      {day.warmup ? <WarmupCard warmup={day.warmup} /> : null}
      <div className="detail-grid">
        <div className="exercise-list" aria-label={`${day.title} exercise list`}>
          {day.exercises.map((exercise, index) => (
            <ExerciseCard
              active={activeExercise.slug === exercise.slug}
              exercise={exercise}
              index={index}
              key={exercise.slug}
              onSelect={() => handleExerciseSelect(exercise)}
            />
          ))}
        </div>
        <ExerciseDetails exercise={activeExercise} />
      </div>
      <CardioCard />
    </section>
  );
}
