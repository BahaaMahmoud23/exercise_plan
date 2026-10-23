export function CardioCard({ recommendation }: { recommendation?: string }) {
  if (!recommendation) return null;
  return <section className="cardio-card" aria-labelledby="cardio-title"><div>
    <span className="section-kicker">Optional walking</span>
    <h3 id="cardio-title">Cardio</h3><p>{recommendation}</p>
    <p>Cardio is separate from workout completion.</p>
  </div></section>;
}
