import { StatusPill } from "@/components/StatusPill";
import type { QuoteRequest } from "@/types";

interface LeadCardProps {
  quote: QuoteRequest;
}

export function LeadCard({ quote }: LeadCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <header className="mb-2 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{quote.consumerName}</h4>
        <StatusPill label={quote.status} status={quote.status} />
      </header>

      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-600">
        <div>
          <dt className="font-semibold text-slate-500">ZIP</dt>
          <dd>{quote.zipCode}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Timeline</dt>
          <dd>{quote.timeline}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Roof</dt>
          <dd>{quote.roofType}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Insurance</dt>
          <dd>{quote.insuranceClaim}</dd>
        </div>
      </dl>

      <p className="mt-2 text-xs text-slate-600">{quote.serviceNeeded}</p>
      {quote.notes ? <p className="mt-1 text-xs text-slate-500">Notes: {quote.notes}</p> : null}
      <p className="mt-2 text-[11px] font-semibold text-blue-700">{quote.estimatedResponse}</p>
    </article>
  );
}
