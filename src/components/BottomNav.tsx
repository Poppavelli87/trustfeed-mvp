import type { AppView } from "@/types";

interface BottomNavProps {
  activeView: AppView;
  onChange: (view: AppView) => void;
}

const navItems: { view: AppView; label: string }[] = [
  { view: "discover", label: "Discover" },
  { view: "saved", label: "Saved" },
  { view: "quotes", label: "Quotes" },
  { view: "business", label: "Business" },
];

export function BottomNav({ activeView, onChange }: BottomNavProps) {
  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-sm"
      aria-label="Primary navigation"
    >
      <ul className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const active = item.view === activeView;
          return (
            <li key={item.view}>
              <button
                type="button"
                onClick={() => onChange(item.view)}
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`h-1.5 w-6 rounded-full transition ${
                    active ? "bg-blue-600" : "bg-slate-300"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
