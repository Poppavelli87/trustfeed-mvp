import { useMemo, useState } from "react";

import type { DiscoverFilters, RoofingFocus } from "@/types";

interface FilterBarProps {
  filters: DiscoverFilters;
  cities: string[];
  resultCount: number;
  onChange: (next: DiscoverFilters) => void;
  onReset: () => void;
}

function toggle(filters: DiscoverFilters, key: keyof DiscoverFilters): DiscoverFilters {
  return {
    ...filters,
    [key]: !filters[key],
  };
}

export function FilterBar({ filters, cities, resultCount, onChange, onReset }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.city !== "All") count += 1;
    if (filters.focus !== "All") count += 1;
    if (filters.emergencyOnly) count += 1;
    if (filters.financingOnly) count += 1;
    if (filters.verifiedLicenseOnly) count += 1;
    if (filters.accreditedOnly) count += 1;
    if (filters.highestGradeOnly) count += 1;
    if (filters.bestReviewedOnly) count += 1;
    if (filters.fastestQuoteOnly) count += 1;
    return count;
  }, [filters]);

  const setFocus = (focus: RoofingFocus | "All") => onChange({ ...filters, focus });

  return (
    <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur" aria-label="Search and filters">
      <div className="flex items-center gap-2">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search roofing companies or city"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none ring-blue-200 transition focus:bg-white focus:ring-2"
          aria-label="Search roofing companies"
        />
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="h-11 min-w-20 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          aria-expanded={expanded}
        >
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
        <span>{resultCount} roofers matched</span>
        {activeCount > 0 ? (
          <button type="button" onClick={onReset} className="font-semibold text-blue-700 underline-offset-2 hover:underline">
            Clear filters
          </button>
        ) : null}
      </div>

      {expanded ? (
        <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            City or service base
            <select
              value={filters.city}
              onChange={(event) => onChange({ ...filters, city: event.target.value })}
              className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
            >
              <option value="All">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-1 text-xs font-semibold text-slate-600">Project focus</p>
            <div className="flex gap-2">
              {(["All", "Residential", "Commercial", "Both"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFocus(option)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    filters.focus === option
                      ? "border-blue-300 bg-blue-100 text-blue-800"
                      : "border-slate-300 bg-white text-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "emergencyOnly"))}
              className={`rounded-lg border px-2 py-2 font-semibold ${
                filters.emergencyOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Emergency service
            </button>
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "financingOnly"))}
              className={`rounded-lg border px-2 py-2 font-semibold ${
                filters.financingOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Financing available
            </button>
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "verifiedLicenseOnly"))}
              className={`rounded-lg border px-2 py-2 font-semibold ${
                filters.verifiedLicenseOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Verified license
            </button>
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "accreditedOnly"))}
              className={`rounded-lg border px-2 py-2 font-semibold ${
                filters.accreditedOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Verified status only
            </button>
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "highestGradeOnly"))}
              className={`rounded-lg border px-2 py-2 font-semibold ${
                filters.highestGradeOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Grade A and above
            </button>
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "bestReviewedOnly"))}
              className={`rounded-lg border px-2 py-2 font-semibold ${
                filters.bestReviewedOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Best reviewed
            </button>
            <button
              type="button"
              onClick={() => onChange(toggle(filters, "fastestQuoteOnly"))}
              className={`col-span-2 rounded-lg border px-2 py-2 font-semibold ${
                filters.fastestQuoteOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              Fastest quote turnaround
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
