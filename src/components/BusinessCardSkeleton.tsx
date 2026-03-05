export function BusinessCardSkeleton() {
  return (
    <div className="mx-3 mt-3 animate-pulse rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mb-3 h-3 w-full rounded bg-slate-200" />
      <div className="mb-3 h-3 w-5/6 rounded bg-slate-200" />
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="h-9 rounded-lg bg-slate-200" />
        <div className="h-9 rounded-lg bg-slate-200" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 rounded-xl bg-slate-200" />
        <div className="h-10 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
