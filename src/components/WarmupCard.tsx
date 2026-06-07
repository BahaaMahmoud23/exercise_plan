import type { Warmup } from "../data/workoutPlan";
import { MediaFrame } from "./MediaFrame";

type WarmupCardProps = {
  warmup: Warmup;
};

export function WarmupCard({ warmup }: WarmupCardProps) {
  return (
    <section className="warmup-card" aria-labelledby="warmup-title">
      <div>
        <span className="section-kicker">Primer</span>
        <h3 id="warmup-title">{warmup.title}</h3>
        <ul>
          {warmup.instructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ul>
      </div>
      <MediaFrame src={warmup.video} title={warmup.title} />
    </section>
  );
}
