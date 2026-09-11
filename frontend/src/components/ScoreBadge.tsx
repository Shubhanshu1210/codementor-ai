interface ScoreBadgeProps {
  score: number;
}

function ScoreBadge({ score }: ScoreBadgeProps) {
  const tone = score >= 8
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
    : score >= 6
      ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
      : 'border-rose-400/30 bg-rose-400/10 text-rose-300';

  const label = score >= 8 ? 'Strong' : score >= 6 ? 'Moderate' : 'Needs attention';

  return (
    <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${tone}`}>
      <span>{score.toFixed(1)}/10</span>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </span>
  );
}

export default ScoreBadge;
