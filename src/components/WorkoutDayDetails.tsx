import type { Exercise, WorkoutDay } from "../data/workoutPlan";
import { ExerciseCard } from "./ExerciseCard";
import { ExerciseDetails } from "./ExerciseDetails";
import { RestDayCard } from "./RestDayCard";
import { WarmupCard } from "./WarmupCard";
import { CardioCard } from "./CardioCard";

import { WorkoutTracker } from "./WorkoutTracker";
import type { Session } from "../data/tracking";

type WorkoutDayDetailsProps = {
  day: WorkoutDay;
  date: string;
  sessions: Session[];
  onSave: (session: Session) => void;
  selectedExercise: Exercise | null;
  onSelectExercise: (exercise: Exercise) => void;
};

export function WorkoutDayDetails({ day, date, sessions, onSave, selectedExercise, onSelectExercise }: WorkoutDayDetailsProps) {
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
          <span className="section-kicker">{day.weekday} · {date}</span>
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
      <WorkoutTracker day={day} date={date} sessions={sessions} onSave={onSave} />
      <CardioCard recommendation={day.cardio} />
    </section>
  );
}
