import type { WorkoutDay } from "../data/workoutPlan";

type RestDayCardProps = {
  day: WorkoutDay;
};

export function RestDayCard({ day }: RestDayCardProps) {
  return (
    <section className="rest-panel" aria-labelledby="rest-title">
      <span className="section-kicker">Recovery</span>
      <h2 id="rest-title">Day {day.day}: {day.title}</h2>
      <p>{day.description}</p>
      <div className="recovery-grid">
        <div>
          <strong>Sleep</strong>
          <span>Prioritize a full night and consistent bedtime.</span>
        </div>
        <div>
          <strong>Movement</strong>
          <span>Keep steps easy. Add light mobility if you feel stiff.</span>
        </div>
        <div>
          <strong>Fuel</strong>
          <span>Hit protein, hydrate well, and avoid turning rest into neglect.</span>
        </div>
      </div>
    </section>
  );
}
