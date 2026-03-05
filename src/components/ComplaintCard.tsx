import { StatusPill } from "@/components/StatusPill";
import type { BusinessComplaint } from "@/types";

interface ComplaintCardProps {
  complaint: BusinessComplaint;
}

function statusTone(status: BusinessComplaint["status"]): "good" | "warn" | "bad" | "info" {
  if (status === "Closed" || status === "Resolved") return "good";
  if (status === "Pending Business Reply") return "warn";
  return "bad";
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{complaint.category}</p>
          <p className="text-xs text-slate-500">Reported {complaint.date}</p>
        </div>
        <StatusPill label={complaint.status} tone={statusTone(complaint.status)} />
      </header>

      <p className="text-sm leading-6 text-slate-700">{complaint.summary}</p>

      <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
        <p className="font-semibold">Business response</p>
        <p className="mt-1">{complaint.businessResponse}</p>
      </div>

      <div className="mt-2">
        <StatusPill
          label={`Outcome: ${complaint.outcomeTag}`}
          tone={complaint.outcomeTag === "Resolved" ? "good" : complaint.outcomeTag === "Partially Resolved" ? "warn" : "bad"}
        />
      </div>
    </article>
  );
}
