import { cardioGuidance } from "../data/workoutPlan";
import { MediaFrame } from "./MediaFrame";

export function CardioCard() {
  return (
    <section className="cardio-card" aria-labelledby="cardio-title">
      <div>
        <span className="section-kicker">Finish</span>
        <h3 id="cardio-title">{cardioGuidance.title}</h3>
        <p>
          {cardioGuidance.duration} after training. Incline {cardioGuidance.incline}, speed {cardioGuidance.speed}.
        </p>
        <div className="badge-row">
          {cardioGuidance.equipment.map((item) => (
            <span className="badge" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <MediaFrame src={cardioGuidance.video} title={cardioGuidance.title} />
    </section>
  );
}
