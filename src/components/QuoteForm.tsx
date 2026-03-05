import { type FormEvent, useState } from "react";

export interface QuoteFormValues {
  consumerName: string;
  zipCode: string;
  roofType: string;
  serviceNeeded: string;
  timeline: string;
  insuranceClaim: "Yes" | "No";
  notes: string;
}

interface QuoteFormProps {
  businessName: string;
  submitLabel?: string;
  onSubmit: (values: QuoteFormValues) => void;
}

const roofTypeOptions = ["Asphalt shingle", "Metal", "Slate", "TPO / Flat", "Cedar", "Not sure"];
const serviceOptions = [
  "Leak repair",
  "Full replacement",
  "Storm damage inspection",
  "Insurance claim support",
  "Maintenance / tune-up",
  "Commercial assessment",
];
const timelineOptions = ["ASAP", "Within 30 days", "This season", "Planning stage"];

export function QuoteForm({ businessName, submitLabel = "Submit request", onSubmit }: QuoteFormProps) {
  const [values, setValues] = useState<QuoteFormValues>({
    consumerName: "",
    zipCode: "",
    roofType: roofTypeOptions[0],
    serviceNeeded: serviceOptions[0],
    timeline: timelineOptions[0],
    insuranceClaim: "No",
    notes: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);

    setValues((prev) => ({
      ...prev,
      notes: "",
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label={`Quote request form for ${businessName}`}>
      <div>
        <label htmlFor="quote-name" className="mb-1 block text-xs font-semibold text-slate-600">
          Name
        </label>
        <input
          id="quote-name"
          required
          value={values.consumerName}
          onChange={(event) => setValues({ ...values, consumerName: event.target.value })}
          className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="quote-zip" className="mb-1 block text-xs font-semibold text-slate-600">
          ZIP code
        </label>
        <input
          id="quote-zip"
          required
          value={values.zipCode}
          onChange={(event) => setValues({ ...values, zipCode: event.target.value })}
          className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
          placeholder="e.g. 06880"
        />
      </div>

      <div>
        <label htmlFor="quote-roof-type" className="mb-1 block text-xs font-semibold text-slate-600">
          Roof type
        </label>
        <select
          id="quote-roof-type"
          value={values.roofType}
          onChange={(event) => setValues({ ...values, roofType: event.target.value })}
          className="h-10 w-full rounded-lg border border-slate-300 px-2 text-sm"
        >
          {roofTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quote-service-needed" className="mb-1 block text-xs font-semibold text-slate-600">
          Service needed
        </label>
        <select
          id="quote-service-needed"
          value={values.serviceNeeded}
          onChange={(event) => setValues({ ...values, serviceNeeded: event.target.value })}
          className="h-10 w-full rounded-lg border border-slate-300 px-2 text-sm"
        >
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quote-timeline" className="mb-1 block text-xs font-semibold text-slate-600">
          Timeline
        </label>
        <select
          id="quote-timeline"
          value={values.timeline}
          onChange={(event) => setValues({ ...values, timeline: event.target.value })}
          className="h-10 w-full rounded-lg border border-slate-300 px-2 text-sm"
        >
          {timelineOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="mb-1 block text-xs font-semibold text-slate-600">Insurance claim?</legend>
        <div className="flex gap-2">
          {(["Yes", "No"] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => setValues({ ...values, insuranceClaim: choice })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                values.insuranceClaim === choice
                  ? "border-blue-300 bg-blue-100 text-blue-800"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="quote-notes" className="mb-1 block text-xs font-semibold text-slate-600">
          Notes
        </label>
        <textarea
          id="quote-notes"
          value={values.notes}
          onChange={(event) => setValues({ ...values, notes: event.target.value })}
          className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Describe current roof concerns"
        />
      </div>

      <button
        type="submit"
        className="h-11 w-full rounded-xl bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}

