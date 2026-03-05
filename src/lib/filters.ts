import { type DiscoverFilters, type RoofingBusiness } from "@/types";

const gradeRank: Record<RoofingBusiness["trustGrade"], number> = {
  "A+": 6,
  A: 5,
  "A-": 4,
  "B+": 3,
  B: 2,
  "B-": 1,
};

const quoteRank: Record<RoofingBusiness["quoteSpeed"], number> = {
  "Same-day": 4,
  "Within 24 hours": 3,
  "Within 48 hours": 2,
  "2-3 days": 1,
};

function includesSearch(business: RoofingBusiness, search: string): boolean {
  if (!search.trim()) {
    return true;
  }

  const normalized = search.toLowerCase();
  const composite = [
    business.name,
    business.city,
    business.state,
    business.serviceArea.join(" "),
    business.specialties.join(" "),
    business.roofTypes.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return composite.includes(normalized);
}

export function applyDiscoverFilters(
  businesses: RoofingBusiness[],
  filters: DiscoverFilters,
): RoofingBusiness[] {
  let result = businesses.filter((business) => {
    if (!includesSearch(business, filters.search)) return false;
    if (filters.city !== "All" && business.city !== filters.city) return false;
    if (filters.focus !== "All" && business.focus !== filters.focus) return false;
    if (filters.emergencyOnly && !business.emergencyService) return false;
    if (filters.financingOnly && !business.financingAvailable) return false;
    if (filters.verifiedLicenseOnly && !business.verifiedLicense) return false;
    if (filters.accreditedOnly && business.accreditedStyleStatus !== "TrustFeed Verified") return false;
    if (filters.highestGradeOnly && gradeRank[business.trustGrade] < gradeRank["A"]) return false;
    return true;
  });

  if (filters.bestReviewedOnly) {
    result = [...result].sort((a, b) => b.reviewAverage - a.reviewAverage || b.reviewCount - a.reviewCount);
  }

  if (filters.fastestQuoteOnly) {
    result = [...result].sort((a, b) => quoteRank[b.quoteSpeed] - quoteRank[a.quoteSpeed]);
  }

  return result;
}

export function trustStrengthScore(business: RoofingBusiness): number {
  let score = 45;
  if (business.verifiedLicense) score += 12;
  if (business.insured) score += 12;
  if (business.accreditedStyleStatus === "TrustFeed Verified") score += 10;
  if (business.complaintResolutionRate >= 90) score += 8;
  if (business.reviewAverage >= 4.7) score += 8;
  if (business.yearsInBusiness >= 10) score += 5;
  return Math.min(100, score);
}

export function statusFromTrustScore(score: number): "Strong" | "Developing" | "At risk" {
  if (score >= 82) return "Strong";
  if (score >= 65) return "Developing";
  return "At risk";
}
