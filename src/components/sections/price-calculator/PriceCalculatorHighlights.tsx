interface PriceCalculatorHighlightsProps {
  heroPoints: string[];
}

export function PriceCalculatorHighlights({ heroPoints }: PriceCalculatorHighlightsProps) {
  if (heroPoints.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {heroPoints.map((point) => (
        <div key={point} className="rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-slate">
          {point}
        </div>
      ))}
    </div>
  );
}
