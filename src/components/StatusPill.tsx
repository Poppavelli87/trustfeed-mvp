import type { QuoteRequestStatus } from "@/types";

interface StatusPillProps {
  label: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "info";
  status?: QuoteRequestStatus;
}

function toneClasses(tone: NonNullable<StatusPillProps["tone"]>): string {
  if (tone === "good") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (tone === "warn") return "bg-amber-50 text-amber-700 border-amber-200";
  if (tone === "bad") return "bg-rose-50 text-rose-700 border-rose-200";
  if (tone === "info") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function mapStatusToTone(status: QuoteRequestStatus): NonNullable<StatusPillProps["tone"]> {
  if (status === "Quote ready") return "good";
  if (status === "Needs more info") return "warn";
  if (status === "Business responded") return "info";
  return "neutral";
}

export function StatusPill({ label, tone = "neutral", status }: StatusPillProps) {
  const appliedTone = status ? mapStatusToTone(status) : tone;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${toneClasses(appliedTone)}`}
    >
      {label}
    </span>
  );
}
