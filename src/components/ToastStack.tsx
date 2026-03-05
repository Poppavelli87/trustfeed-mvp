interface ToastItem {
  id: string;
  message: string;
}

interface ToastStackProps {
  toasts: ToastItem[];
}

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-xl border border-blue-200 bg-blue-900/95 px-3 py-2 text-sm font-medium text-white shadow-lg"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
