interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900 shadow-sm">
      <div>
        <p className="text-sm font-semibold">문제가 발생했습니다</p>
        <p className="mt-1 text-sm leading-6 text-rose-800">{message}</p>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
      >
        닫기
      </button>
    </div>
  );
}

