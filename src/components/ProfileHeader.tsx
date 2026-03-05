import { TrustBadge } from "@/components/TrustBadge";
import { StatusPill } from "@/components/StatusPill";
import type { RoofingBusiness } from "@/types";

interface ProfileHeaderProps {
  business: RoofingBusiness;
  onBack: () => void;
}

export function ProfileHeader({ business, onBack }: ProfileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
        >
          Back
        </button>
        <StatusPill label={`${business.city}, ${business.state}`} tone="neutral" />
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-800">
          {business.logoInitials}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{business.name}</h2>
          <p className="text-xs text-slate-600">Serving {business.serviceArea.join(", ")}</p>
          <p className="mt-1 text-xs font-medium text-blue-700">{business.featuredTrustReason}</p>
        </div>
      </div>

      <div className="mt-3">
        <TrustBadge
          trustGrade={business.trustGrade}
          accreditedStatus={business.accreditedStyleStatus}
          complaintResolutionRate={business.complaintResolutionRate}
        />
      </div>
    </header>
  );
}
