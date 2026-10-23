import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { WorkoutDayDetails } from "./components/WorkoutDayDetails";
import { WorkoutOverviewCard } from "./components/WorkoutOverviewCard";
import { workoutInstructions, workoutPlan, type Exercise } from "./data/workoutPlan";

import { dateKey, dayNumber, weekDates, readSessions, saveSession, type Session } from "./data/tracking";
import { WorkoutHistory } from "./components/WorkoutTracker";

import { PwaControls } from "./components/PwaControls";

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
  const [selectedDayNumber, setSelectedDayNumber] = useState(dayNumber(dateKey()));
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [today, setToday] = useState(dateKey);
  const [weekAnchor, setWeekAnchor] = useState(dateKey);
  const dates = weekDates(weekAnchor);
  const [storageError, setStorageError] = useState("");
  const [sessions, setSessions] = useState<Session[]>(() => {
    try { return readSessions(window.localStorage); } catch { return []; }
  });
  useEffect(() => {
    try { readSessions(window.localStorage); } catch { setStorageError("Saved workout data could not be read. Existing data is untouched; saving is blocked until storage is available."); }
    const timer = window.setInterval(() => {
      const now = dateKey();
      if (now !== today) {
        setWeekAnchor(anchor => weekDates(anchor).includes(today) ? now : anchor);
        setToday(now);
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [today]);
  const onSave = (session: Session) => {
    try { setSessions(saveSession(window.localStorage, session)); setStorageError(""); }
    catch { setStorageError("Could not save workout. Existing saved data is untouched. Check browser storage and try again."); }
  };
  const completed = (day: typeof workoutPlan[number]) => sessions.some(s => s.id === `upper-lower-v1:${dates[day.day-1]}:${day.slug}` && s.completed);
  const calendar = <><PwaControls /><section className="calendar-controls" aria-label="Workout week">
    <label>Week containing <input aria-label="Week containing" type="date" value={weekAnchor} onChange={e => { if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) setWeekAnchor(e.target.value); }} /></label>
    <button className="back-button" type="button" onClick={() => {setWeekAnchor(today);setSelectedDayNumber(dayNumber(today));setSelectedExercise(null);}}>Today</button>
    <a href="#history" onClick={() => setView("overview")}>History</a>
    <span>{dates[0]} – {dates[6]} · Saudi time</span>
    {storageError && <p role="alert">{storageError}</p>}
  </section></>;

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
        {calendar}
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
                <span>{day.weekday.slice(0,3)}{dates[day.day-1] === today ? " · Today" : ""}{completed(day) ? " ✓" : ""}</span>
                {day.title}
              </button>
            ))}
          </div>
        </nav>
        <WorkoutDayDetails
          date={dates[selectedDay.day-1]}
          sessions={sessions}
          onSave={onSave}
          day={selectedDay}
          selectedExercise={selectedExercise}
          onSelectExercise={setSelectedExercise}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      {calendar}
      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <span className="eyebrow">Upper / Lower - 4 Days</span>
          <h1 id="page-title">A focused 7-day training week built for clean progression.</h1>
          <p>
            Upper A, Lower A, Rest, Upper B, Lower B, Rest, Rest. Every session includes warm-up guidance,
            working-set targets, demo-ready media slots, and form notes.
          </p>
          <div className="hero-actions">
            <a href="#plan">View Plan</a>
            <a href="#instructions">Training Rules</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Weekly training summary">
          <span>Current split</span>
          <strong>4 training days</strong>
          <p>26 exercise slots across the week with 3 recovery days.</p>
          <div className="mini-week">
            {workoutPlan.map((day) => (
              <button
                className={selectedDay.day === day.day ? "is-active" : ""}
                key={day.day}
                onClick={() => handleSelectDay(day.day)}
                type="button"
              >
                <span>{day.weekday.slice(0,3)}{dates[day.day-1] === today ? " · Today" : ""}{completed(day) ? " ✓" : ""}</span>
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
            today={dates[day.day-1] === today}
            completed={completed(day)}
            active={selectedDay.day === day.day}
            day={day}
            key={day.day}
            onSelect={() => handleSelectDay(day.day)}
          />
        ))}
      </section>

      <WorkoutHistory sessions={sessions} />
      <WorkoutDayDetails
        date={dates[selectedDay.day-1]}
        sessions={sessions}
        onSave={onSave}
        day={selectedDay}
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
      />
    </main>
  );
}

export default App;
