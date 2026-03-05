export type TrustGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-";

export type AccreditedStyleStatus =
  | "TrustFeed Verified"
  | "TrustFeed Listed"
  | "Verification In Progress";

export type RoofingFocus = "Residential" | "Commercial" | "Both";

export type QuoteSpeed = "Same-day" | "Within 24 hours" | "Within 48 hours" | "2-3 days";

export type ReviewTag =
  | "On time"
  | "Transparent pricing"
  | "Good cleanup"
  | "Warranty honored"
  | "Responsive"
  | "Insurance support"
  | "Professional crew"
  | "Clear communication"
  | "Respectful"
  | "Commercial quality";

export interface BusinessReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  text: string;
  tags: ReviewTag[];
}

export type ComplaintCategory =
  | "Scheduling"
  | "Billing"
  | "Work quality"
  | "Communication"
  | "Warranty"
  | "Permits"
  | "Cleanup";

export type ComplaintStatus = "Closed" | "Open" | "Resolved" | "Pending Business Reply";

export interface BusinessComplaint {
  id: string;
  date: string;
  category: ComplaintCategory;
  summary: string;
  status: ComplaintStatus;
  businessResponse: string;
  outcomeTag: "Resolved" | "Partially Resolved" | "Open";
}

export interface RoofingBusiness {
  id: string;
  name: string;
  slug: string;
  logoInitials: string;
  city: string;
  state: string;
  serviceArea: string[];
  focus: RoofingFocus;
  trustGrade: TrustGrade;
  accreditedStyleStatus: AccreditedStyleStatus;
  yearsInBusiness: number;
  foundedYear: number;
  verifiedLicense: boolean;
  insured: boolean;
  emergencyService: boolean;
  financingAvailable: boolean;
  quoteSpeed: QuoteSpeed;
  reviewAverage: number;
  reviewCount: number;
  complaintsClosed: number;
  complaintsOpen: number;
  complaintResolutionRate: number;
  specialties: string[];
  roofTypes: string[];
  summary: string;
  about: string;
  ownerStory: string;
  badges: string[];
  responseTime: string;
  quoteTurnaround: string;
  gallery: string[];
  reviews: BusinessReview[];
  complaints: BusinessComplaint[];
  quoteCTA: string;
  featuredTrustReason: string;
}

export type QuoteRequestStatus =
  | "Request sent"
  | "Business responded"
  | "Needs more info"
  | "Quote ready";

export interface QuoteRequest {
  id: string;
  businessId: string;
  businessName: string;
  consumerName: string;
  zipCode: string;
  roofType: string;
  serviceNeeded: string;
  timeline: string;
  insuranceClaim: "Yes" | "No";
  notes: string;
  status: QuoteRequestStatus;
  estimatedResponse: string;
  createdAt: string;
  updates: string[];
}

export interface DiscoverFilters {
  search: string;
  city: string;
  focus: "All" | RoofingFocus;
  emergencyOnly: boolean;
  financingOnly: boolean;
  verifiedLicenseOnly: boolean;
  accreditedOnly: boolean;
  highestGradeOnly: boolean;
  bestReviewedOnly: boolean;
  fastestQuoteOnly: boolean;
}

export type ProfileTab = "overview" | "reviews" | "complaints" | "quote" | "about";

export type AppView = "discover" | "saved" | "quotes" | "business";
