import { useLayoutEffect, useMemo, useState } from "react";
import { WorkoutDayDetails } from "./components/WorkoutDayDetails";
import { WorkoutOverviewCard } from "./components/WorkoutOverviewCard";
import { workoutInstructions, workoutPlan, type Exercise } from "./data/workoutPlan";

type AppView = "overview" | "details";

function jumpToPageTop() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previousScrollBehavior;
}

function App() {
  const [view, setView] = useState<AppView>("overview");
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const selectedDay = useMemo(
    () => workoutPlan.find((day) => day.day === selectedDayNumber) ?? workoutPlan[0],
    [selectedDayNumber],
  );

  useLayoutEffect(() => {
    if (view === "details") {
      jumpToPageTop();
      const quickCorrection = window.setTimeout(jumpToPageTop, 80);
      const settledCorrection = window.setTimeout(jumpToPageTop, 240);
      const finalCorrection = window.setTimeout(jumpToPageTop, 520);
      const firstFrame = window.requestAnimationFrame(() => {
        jumpToPageTop();
        window.requestAnimationFrame(jumpToPageTop);
      });

      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.clearTimeout(quickCorrection);
        window.clearTimeout(settledCorrection);
        window.clearTimeout(finalCorrection);
      };
    }

    return undefined;
  }, [selectedDayNumber, view]);

  const handleSelectDay = (dayNumber: number) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setSelectedDayNumber(dayNumber);
    setSelectedExercise(null);
    setView("details");
  };

  const handleBackToPlan = () => {
    setView("overview");
    setSelectedExercise(null);
    window.setTimeout(() => {
      document.getElementById("plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  if (view === "details") {
    return (
      <main className="app-shell workout-page-shell">
        <nav className="workout-page-nav" aria-label="Workout day navigation">
          <button className="back-button" onClick={handleBackToPlan} type="button">
            Back to plan
          </button>
          <div className="day-switcher" aria-label="Choose another workout day">
            {workoutPlan.map((day) => (
              <button
                className={selectedDay.day === day.day ? "is-active" : ""}
                key={day.day}
                onClick={() => handleSelectDay(day.day)}
                type="button"
              >
                <span>D{day.day}</span>
                {day.title}
              </button>
            ))}
          </div>
        </nav>
        <WorkoutDayDetails
          day={selectedDay}
          selectedExercise={selectedExercise}
          onSelectExercise={setSelectedExercise}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <span className="eyebrow">PPL X UL - 5 Days</span>
          <h1 id="page-title">A focused 7-day training week built for clean progression.</h1>
          <p>
            Push, Pull, Legs, Rest, Upper, Lower, Rest. Every session includes warm-up guidance,
            working-set targets, demo-ready media slots, and form notes.
          </p>
          <div className="hero-actions">
            <a href="#plan">View Plan</a>
            <a href="#instructions">Training Rules</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Weekly training summary">
          <span>Current split</span>
          <strong>5 training days</strong>
          <p>30 working exercises across the week with 2 recovery days.</p>
          <div className="mini-week">
            {workoutPlan.map((day) => (
              <button
                className={selectedDay.day === day.day ? "is-active" : ""}
                key={day.day}
                onClick={() => handleSelectDay(day.day)}
                type="button"
              >
                <span>D{day.day}</span>
                {day.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="instructions-band" id="instructions" aria-labelledby="instructions-title">
        <div>
          <span className="section-kicker">Rules from the plan</span>
          <h2 id="instructions-title">Train hard, but earn the load first.</h2>
        </div>
        <ul>
          {workoutInstructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ul>
      </section>

      <section className="overview-section" id="plan" aria-label="Workout plan overview">
        {workoutPlan.map((day) => (
          <WorkoutOverviewCard
            active={selectedDay.day === day.day}
            day={day}
            key={day.day}
            onSelect={() => handleSelectDay(day.day)}
          />
        ))}
      </section>

      <WorkoutDayDetails
        day={selectedDay}
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
      />
    </main>
  );
}

export default App;
