"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BottomNav } from "@/components/BottomNav";
import { BusinessCard } from "@/components/BusinessCard";
import { BusinessCardSkeleton } from "@/components/BusinessCardSkeleton";
import { ComplaintCard } from "@/components/ComplaintCard";
import { FilterBar } from "@/components/FilterBar";
import { LeadCard } from "@/components/LeadCard";
import { ProfileHeader } from "@/components/ProfileHeader";
import { QuoteForm, type QuoteFormValues } from "@/components/QuoteForm";
import { ReviewCard } from "@/components/ReviewCard";
import { StatusPill } from "@/components/StatusPill";
import { ToastStack } from "@/components/ToastStack";
import { initialQuoteRequests, roofingBusinesses, discoverCities } from "@/data/businesses";
import { applyDiscoverFilters, statusFromTrustScore, trustStrengthScore } from "@/lib/filters";
import type { AppView, DiscoverFilters, ProfileTab, QuoteRequest, RoofingBusiness } from "@/types";

interface ToastItem {
  id: string;
  message: string;
}

const profileTabs: { id: ProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "reviews", label: "Reviews" },
  { id: "complaints", label: "Complaints" },
  { id: "quote", label: "Quote" },
  { id: "about", label: "About" },
];

const defaultFilters: DiscoverFilters = {
  search: "",
  city: "All",
  focus: "All",
  emergencyOnly: false,
  financingOnly: false,
  verifiedLicenseOnly: false,
  accreditedOnly: false,
  highestGradeOnly: false,
  bestReviewedOnly: false,
  fastestQuoteOnly: false,
};

function estimateResponse(quoteSpeed: RoofingBusiness["quoteSpeed"]): string {
  if (quoteSpeed === "Same-day") return "Estimated response: within 2 hours";
  if (quoteSpeed === "Within 24 hours") return "Estimated response: within 8-24 hours";
  if (quoteSpeed === "Within 48 hours") return "Estimated response: 1-2 days";
  return "Estimated response: 2-3 days";
}

function createQuoteRequest(
  business: RoofingBusiness,
  values: QuoteFormValues,
): QuoteRequest {
  const timestamp = new Date().toISOString();
  return {
    id: `quote-${Date.now()}-${business.id}`,
    businessId: business.id,
    businessName: business.name,
    consumerName: values.consumerName,
    zipCode: values.zipCode,
    roofType: values.roofType,
    serviceNeeded: values.serviceNeeded,
    timeline: values.timeline,
    insuranceClaim: values.insuranceClaim,
    notes: values.notes,
    status: "Request sent",
    estimatedResponse: estimateResponse(business.quoteSpeed),
    createdAt: timestamp,
    updates: ["Request sent"],
  };
}

export function TrustFeedApp() {
  const [activeView, setActiveView] = useState<AppView>("discover");
  const [filters, setFilters] = useState<DiscoverFilters>(defaultFilters);
  const [savedIds, setSavedIds] = useState<string[]>(["roof-001", "roof-003"]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuoteRequests);
  const [profileBusinessId, setProfileBusinessId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("overview");
  const [dashboardBusinessId, setDashboardBusinessId] = useState<string>("roof-015");
  const [recentQuoteBusinessId, setRecentQuoteBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastSequence = useRef(0);
  const batchSequence = useRef(5000);
  const discoverModeActive = activeView === "discover" && profileBusinessId === null;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    if (discoverModeActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [discoverModeActive]);

  function pushToast(message: string) {
    toastSequence.current += 1;
    const id = `toast-${toastSequence.current}`;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 1800);
  }

  function handleSave(businessId: string) {
    setSavedIds((prev) => {
      if (prev.includes(businessId)) {
        pushToast("Already in Saved");
        return prev;
      }
      pushToast("Saved to your shortlist");
      return [...prev, businessId];
    });
  }

  function handleRemoveSaved(businessId: string) {
    setSavedIds((prev) => prev.filter((id) => id !== businessId));
    pushToast("Removed from Saved");
  }

  function handleHide(businessId: string) {
    setHiddenIds((prev) => {
      if (prev.includes(businessId)) return prev;
      return [...prev, businessId];
    });
    pushToast("Hidden from Discover feed");
  }

  function openProfile(businessId: string, tab: ProfileTab = "overview") {
    setProfileBusinessId(businessId);
    setProfileTab(tab);
  }

  function handleQuoteSubmit(business: RoofingBusiness, values: QuoteFormValues) {
    const request = createQuoteRequest(business, values);
    setQuotes((prev) => [request, ...prev]);
    setRecentQuoteBusinessId(business.id);
    setActiveView("quotes");
    setProfileBusinessId(null);
    pushToast(`Quote request sent to ${business.name}`);
  }

  function requestAllSaved() {
    if (savedBusinesses.length === 0) {
      pushToast("Save roofers first to send a group request");
      return;
    }

    const batch = savedBusinesses.map((business, index) => {
      batchSequence.current += 1;
      const sequence = batchSequence.current;
      const createdAt = `2026-03-05T12:${String((sequence + index) % 60).padStart(2, "0")}:00.000Z`;

      return {
        id: `quote-batch-${sequence}`,
        businessId: business.id,
        businessName: business.name,
        consumerName: "Saved Comparison Request",
        zipCode: "00000",
        roofType: "Not sure",
        serviceNeeded: "Compare saved roofers",
        timeline: "Planning stage",
        insuranceClaim: "No" as const,
        notes: "User requested quote outreach from Saved.",
        status: "Request sent" as const,
        estimatedResponse: estimateResponse(business.quoteSpeed),
        createdAt,
        updates: ["Request sent"],
      };
    });

    setQuotes((prev) => [...batch, ...prev]);
    setActiveView("quotes");
    pushToast(`Sent ${batch.length} saved quote requests`);
  }

  const visibleBusinesses = useMemo(
    () => roofingBusinesses.filter((business) => !hiddenIds.includes(business.id)),
    [hiddenIds],
  );

  const discoverBusinesses = useMemo(
    () => applyDiscoverFilters(visibleBusinesses, filters),
    [filters, visibleBusinesses],
  );

  const savedBusinesses = roofingBusinesses.filter((business) => savedIds.includes(business.id));

  const currentProfileBusiness = useMemo(
    () => roofingBusinesses.find((business) => business.id === profileBusinessId) ?? null,
    [profileBusinessId],
  );

  const sortedQuotes = useMemo(
    () => [...quotes].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [quotes],
  );

  const dashboardBusiness = useMemo(
    () => roofingBusinesses.find((business) => business.id === dashboardBusinessId) ?? roofingBusinesses[0],
    [dashboardBusinessId],
  );

  const dashboardLeads = useMemo(
    () => sortedQuotes.filter((quote) => quote.businessId === dashboardBusiness.id),
    [dashboardBusiness.id, sortedQuotes],
  );

  const trustScore = trustStrengthScore(dashboardBusiness);
  const trustStatus = statusFromTrustScore(trustScore);

  const suggestions = useMemo(() => {
    const items: string[] = [];
    if (!dashboardBusiness.insured) items.push("Add insurance verification to strengthen trust profile.");
    if (dashboardBusiness.complaintsOpen > 0) items.push("Respond to open complaints to improve trust visibility.");
    if (dashboardBusiness.serviceArea.length < 4) items.push("Expand or clarify service area coverage.");
    if (dashboardBusiness.gallery.length < 3) items.push("Add more project photos to reinforce workmanship evidence.");
    if (dashboardBusiness.accreditedStyleStatus !== "TrustFeed Verified") {
      items.push("Complete TrustFeed verification review.");
    }
    return items.slice(0, 4);
  }, [dashboardBusiness]);

  function renderDiscoverView() {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-4 py-3">
          <h1 className="font-[var(--font-source-serif)] text-xl font-semibold text-slate-900">Trusted roofing professionals</h1>
          <p className="mt-1 text-xs text-slate-600">Swipe or scroll to compare trust signals and request quotes quickly.</p>
        </div>

        <FilterBar
          filters={filters}
          cities={discoverCities}
          resultCount={discoverBusinesses.length}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="discover-feed-scroll tiktok-feed min-h-0 flex-1" data-testid="discover-feed">
          {isLoading ? (
            <>
              <div className="discover-snap-card">
                <BusinessCardSkeleton />
              </div>
              <div className="discover-snap-card">
                <BusinessCardSkeleton />
              </div>
            </>
          ) : discoverBusinesses.length === 0 ? (
            <div className="mx-4 mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">No roofers match these filters.</p>
              <p className="mt-1">Try clearing filters or broadening city and trust requirements.</p>
            </div>
          ) : (
            discoverBusinesses.map((business) => (
              <section key={business.id} className="discover-snap-card fade-slide-enter" data-testid={`discover-card-${business.id}`}>
                <BusinessCard
                  business={business}
                  isSaved={savedIds.includes(business.id)}
                  onSave={handleSave}
                  onHide={handleHide}
                  onViewProfile={(id) => openProfile(id, "overview")}
                  onGetQuote={(id) => openProfile(id, "quote")}
                />
              </section>
            ))
          )}
        </div>
      </section>
    );
  }

  function renderSavedView() {
    return (
      <section className="h-full overflow-y-auto px-4 py-4">
        <header className="mb-4">
          <h1 className="font-[var(--font-source-serif)] text-xl font-semibold text-slate-900">Saved roofers</h1>
          <p className="mt-1 text-xs text-slate-600">Compare your shortlist and request quotes from trusted profiles.</p>
        </header>

        {savedBusinesses.length > 0 ? (
          <button
            type="button"
            onClick={requestAllSaved}
            className="mb-4 w-full rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Request quote from all saved
          </button>
        ) : null}

        <div className="space-y-3">
          {savedBusinesses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">No saved businesses yet.</p>
              <p className="mt-1">Save roofers from Discover to compare them here.</p>
            </div>
          ) : (
            savedBusinesses.map((business) => (
              <article key={business.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">{business.name}</h2>
                    <p className="text-xs text-slate-500">
                      {business.city}, {business.state} • Grade {business.trustGrade}
                    </p>
                  </div>
                  <StatusPill label={business.accreditedStyleStatus} tone="info" />
                </div>

                <div className="mb-2 flex flex-wrap gap-2">
                  {business.badges.slice(0, 3).map((badge) => (
                    <StatusPill key={`${business.id}-saved-${badge}`} label={badge} tone="neutral" />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => openProfile(business.id, "overview")}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => openProfile(business.id, "quote")}
                    className="rounded-lg bg-blue-700 px-2 py-2 text-xs font-semibold text-white"
                  >
                    Request Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSaved(business.id)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    );
  }

  function renderQuotesView() {
    return (
      <section className="h-full overflow-y-auto px-4 py-4">
        <header className="mb-4">
          <h1 className="font-[var(--font-source-serif)] text-xl font-semibold text-slate-900">Your quote requests</h1>
          <p className="mt-1 text-xs text-slate-600">Track request status, response timelines, and next steps.</p>
        </header>

        {recentQuoteBusinessId ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Request submitted. Trusted roofers typically respond quickly with scope questions or a ready estimate.
          </div>
        ) : null}

        <div className="space-y-3">
          {sortedQuotes.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">No quote requests yet.</p>
              <p className="mt-1">Open a business profile and use the Quote tab to submit your first request.</p>
            </div>
          ) : (
            sortedQuotes.map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <header className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">{quote.businessName}</h2>
                    <p className="text-xs text-slate-500">{new Date(quote.createdAt).toLocaleString()}</p>
                  </div>
                  <StatusPill label={quote.status} status={quote.status} />
                </header>
                <p className="text-sm text-slate-700">{quote.serviceNeeded} • {quote.timeline}</p>
                <p className="mt-1 text-xs text-slate-600">{quote.estimatedResponse}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quote.updates.map((update, index) => (
                    <StatusPill key={`${quote.id}-update-${index}`} label={update} tone="info" />
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    );
  }

  function renderBusinessView() {
    return (
      <section className="h-full overflow-y-auto px-4 py-4">
        <header className="mb-4">
          <h1 className="font-[var(--font-source-serif)] text-xl font-semibold text-slate-900">Business dashboard</h1>
          <p className="mt-1 text-xs text-slate-600">Lead flow and reputation visibility for trustworthy roofing companies.</p>
        </header>

        <label className="mb-4 flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Business view
          <select
            value={dashboardBusiness.id}
            onChange={(event) => setDashboardBusinessId(event.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700"
          >
            {roofingBusinesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>

        <article className="mb-4 rounded-2xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Trust strength meter</p>
            <StatusPill label={trustStatus} tone={trustStatus === "Strong" ? "good" : trustStatus === "Developing" ? "warn" : "bad"} />
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-blue-700" style={{ width: `${trustScore}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-600">{trustScore}/100 profile strength based on credentials, complaint handling, and customer sentiment.</p>

          <ul className="mt-3 space-y-1 text-xs text-slate-700">
            {suggestions.length === 0 ? (
              <li>Profile is strong. Keep review response times and complaint handling consistent.</li>
            ) : (
              suggestions.map((suggestion) => <li key={suggestion}>• {suggestion}</li>)
            )}
          </ul>
        </article>

        <section className="mb-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Incoming quote requests</h2>
          {dashboardLeads.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              No incoming quote requests for this business yet.
            </div>
          ) : (
            <div className="space-y-2">
              {dashboardLeads.map((quote) => (
                <LeadCard key={quote.id} quote={quote} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Open customer issues</h2>
          <div className="space-y-2">
            {dashboardBusiness.complaints.filter((item) => item.status === "Open" || item.status === "Pending Business Reply").length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                No active open complaints.
              </div>
            ) : (
              dashboardBusiness.complaints
                .filter((item) => item.status === "Open" || item.status === "Pending Business Reply")
                .map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Recent reviews</h2>
          <div className="space-y-2">
            {dashboardBusiness.reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      </section>
    );
  }

  function renderProfileView(business: RoofingBusiness) {
    return (
      <section className="flex h-full flex-col">
        <ProfileHeader business={business} onBack={() => setProfileBusinessId(null)} />

        <div className="border-b border-slate-200 bg-white px-3 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProfileTab(tab.id)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  profileTab === tab.id
                    ? "border-blue-300 bg-blue-100 text-blue-800"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-3 py-3">
          {profileTab === "overview" ? (
            <div className="space-y-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-900">Trust summary</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{business.summary}</p>
                <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">{business.featuredTrustReason}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-900">Profile details</h3>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div><dt className="font-semibold text-slate-500">Years in business</dt><dd>{business.yearsInBusiness}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Founded</dt><dd>{business.foundedYear}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Response time</dt><dd>{business.responseTime}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Quote turnaround</dt><dd>{business.quoteTurnaround}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Financing</dt><dd>{business.financingAvailable ? "Available" : "Not listed"}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Emergency service</dt><dd>{business.emergencyService ? "Available" : "Standard hours"}</dd></div>
                </dl>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-900">Specialties and roof types</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {business.specialties.map((item) => <StatusPill key={`${business.id}-${item}`} label={item} tone="info" />)}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {business.roofTypes.map((item) => <StatusPill key={`${business.id}-roof-${item}`} label={item} tone="neutral" />)}
                </div>
              </article>
            </div>
          ) : null}

          {profileTab === "reviews" ? (
            <div className="space-y-3">{business.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
          ) : null}

          {profileTab === "complaints" ? (
            <div className="space-y-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                <p>
                  Closed complaints: <span className="font-semibold">{business.complaintsClosed}</span> • Open complaints: <span className="font-semibold">{business.complaintsOpen}</span>
                </p>
                <p className="mt-1">Complaint resolution rate: <span className="font-semibold">{business.complaintResolutionRate}%</span></p>
              </article>
              {business.complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          ) : null}

          {profileTab === "quote" ? (
            <div className="space-y-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-900">Request a quote</h3>
                <p className="mt-1 text-xs text-slate-600">Share project details. Your request is stored locally and routed to the business dashboard demo.</p>
                <div className="mt-3">
                  <QuoteForm businessName={business.name} onSubmit={(values) => handleQuoteSubmit(business, values)} submitLabel="Send quote request" />
                </div>
              </article>
            </div>
          ) : null}

          {profileTab === "about" ? (
            <div className="space-y-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-900">About this business</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{business.about}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">Owner story: {business.ownerStory}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-slate-900">Service area and project gallery</h3>
                <p className="mt-2 text-sm text-slate-700">Service area: {business.serviceArea.join(", ")}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {business.gallery.map((item) => (
                    <li key={`${business.id}-gallery-${item}`}>• {item}</li>
                  ))}
                </ul>
              </article>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  function renderCurrentView() {
    if (currentProfileBusiness) {
      return renderProfileView(currentProfileBusiness);
    }

    if (activeView === "discover") return renderDiscoverView();
    if (activeView === "saved") return renderSavedView();
    if (activeView === "quotes") return renderQuotesView();
    return renderBusinessView();
  }

  return (
    <main className="app-root box-border px-3 py-4 md:px-8 md:py-8">
      <ToastStack toasts={toasts} />
      <div className="mx-auto flex h-full w-full max-w-[440px] flex-col overflow-hidden rounded-[30px] app-phone-shell md:h-[94svh]">
        <div className="border-b border-slate-200 bg-[linear-gradient(110deg,#123a63,#2d6ea7)] px-4 py-3 text-white">
          <p className="font-[var(--font-source-serif)] text-lg font-semibold tracking-wide">TrustFeed</p>
          <p className="text-xs text-blue-100">Trust-centered local roofing discovery concept</p>
        </div>

        <div className="min-h-0 flex-1 bg-white">{renderCurrentView()}</div>

        {!currentProfileBusiness ? <BottomNav activeView={activeView} onChange={setActiveView} /> : null}
      </div>
    </main>
  );
}
