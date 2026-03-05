import { type PointerEvent, useRef, useState } from "react";

import { StatusPill } from "@/components/StatusPill";
import { TrustBadge } from "@/components/TrustBadge";
import type { RoofingBusiness } from "@/types";

interface BusinessCardProps {
  business: RoofingBusiness;
  isSaved: boolean;
  onSave: (businessId: string) => void;
  onHide: (businessId: string) => void;
  onViewProfile: (businessId: string) => void;
  onGetQuote: (businessId: string) => void;
}

const swipeThreshold = 72;

export function BusinessCard({
  business,
  isSaved,
  onSave,
  onHide,
  onViewProfile,
  onGetQuote,
}: BusinessCardProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  function resetDrag() {
    pointerStartX.current = null;
    setDragging(false);
    setDragX(0);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX;
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    setDragX(Math.max(-120, Math.min(120, delta)));
  }

  function handlePointerUp() {
    if (!dragging) return;

    if (dragX > swipeThreshold) {
      onSave(business.id);
    } else if (dragX < -swipeThreshold) {
      onHide(business.id);
    }

    resetDrag();
  }

  const gradeTone = business.trustGrade.startsWith("A") ? "good" : business.trustGrade === "B+" ? "warn" : "bad";

  return (
    <article
      className="relative mx-3 mt-3 snap-start rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.08)]"
      aria-label={`${business.name} card`}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetDrag}
        className="transition-transform duration-150"
        style={{ transform: `translateX(${dragX}px)` }}
      >
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-800">
              {business.logoInitials}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{business.name}</h2>
              <p className="text-xs text-slate-600">
                {business.city}, {business.state} • {business.focus}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">{business.specialties[0]}</p>
            </div>
          </div>
          <StatusPill label={business.trustGrade} tone={gradeTone} />
        </header>

        <TrustBadge
          trustGrade={business.trustGrade}
          accreditedStatus={business.accreditedStyleStatus}
          complaintResolutionRate={business.complaintResolutionRate}
        />

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <p className="font-semibold text-slate-800">{business.yearsInBusiness} yrs</p>
            <p className="text-slate-500">In business</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <p className="font-semibold text-slate-800">{business.reviewAverage.toFixed(1)} ({business.reviewCount})</p>
            <p className="text-slate-500">Reviews</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-2">
            <p className="font-semibold text-slate-800">{business.complaintsOpen}/{business.complaintsClosed}</p>
            <p className="text-slate-500">Open/closed</p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-700">{business.summary}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {business.badges.slice(0, 4).map((badge) => (
            <StatusPill
              key={`${business.id}-${badge}`}
              label={badge}
              tone={badge.includes("Verified") || badge.includes("Insured") ? "info" : "neutral"}
            />
          ))}
        </div>

        <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800">
          Why this stands out: {business.featuredTrustReason}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSave(business.id)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              isSaved
                ? "border-blue-300 bg-blue-100 text-blue-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => onHide(business.id)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Hide
          </button>
          <button
            type="button"
            onClick={() => onViewProfile(business.id)}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => onGetQuote(business.id)}
            className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Get Quote
          </button>
        </div>
      </div>

      {dragX > swipeThreshold / 2 ? (
        <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Release to Save
        </div>
      ) : null}
      {dragX < -swipeThreshold / 2 ? (
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
          Release to Hide
        </div>
      ) : null}
    </article>
  );
}

