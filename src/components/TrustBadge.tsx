import type { RoofingBusiness } from "@/types";
import { StatusPill } from "@/components/StatusPill";

interface TrustBadgeProps {
  trustGrade: RoofingBusiness["trustGrade"];
  accreditedStatus: RoofingBusiness["accreditedStyleStatus"];
  complaintResolutionRate?: number;
}

function gradeTone(grade: RoofingBusiness["trustGrade"]): "good" | "warn" | "bad" {
  if (grade.startsWith("A")) return "good";
  if (grade.startsWith("B+")) return "warn";
  return "bad";
}

export function TrustBadge({ trustGrade, accreditedStatus, complaintResolutionRate }: TrustBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill label={`Trust Grade ${trustGrade}`} tone={gradeTone(trustGrade)} />
      <StatusPill
        label={accreditedStatus}
        tone={accreditedStatus === "TrustFeed Verified" ? "info" : accreditedStatus === "TrustFeed Listed" ? "neutral" : "warn"}
      />
      {typeof complaintResolutionRate === "number" ? (
        <StatusPill label={`${complaintResolutionRate}% complaint resolution`} tone="info" />
      ) : null}
    </div>
  );
}
