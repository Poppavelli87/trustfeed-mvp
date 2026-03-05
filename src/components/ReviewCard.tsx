import { StatusPill } from "@/components/StatusPill";
import type { BusinessReview } from "@/types";

interface ReviewCardProps {
  review: BusinessReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <header className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.customerName}</p>
          <p className="text-xs text-slate-500">{review.date}</p>
        </div>
        <StatusPill label={`${review.rating.toFixed(1)} / 5`} tone={review.rating >= 4.5 ? "good" : "warn"} />
      </header>

      <p className="text-sm leading-6 text-slate-700">{review.text}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <StatusPill key={`${review.id}-${tag}`} label={tag} tone="info" />
        ))}
      </div>
    </article>
  );
}
