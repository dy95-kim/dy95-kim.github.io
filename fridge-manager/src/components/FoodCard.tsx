import { getDaysRemaining, getFoodStatus } from '../lib/food';
import type { FoodItem, StorageLocation } from '../types/food';

interface FoodCardProps {
  item: FoodItem;
  today: string;
  onEdit: (item: FoodItem) => void;
  onDelete: (item: FoodItem) => void;
}

const locationLabels: Record<StorageLocation, string> = {
  fridge: '냉장실',
  freezer: '냉동실',
};

const locationStyles: Record<StorageLocation, string> = {
  fridge: 'border-fridge/20 bg-fridge/10 text-fridge',
  freezer: 'border-freezer/20 bg-freezer/10 text-freezer',
};

const statusStyles = {
  fresh: {
    label: '보관 중',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    card: 'border-emerald-100',
  },
  warning: {
    label: '임박',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    card: 'border-amber-200',
  },
  expired: {
    label: '만료',
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    card: 'border-rose-200',
  },
  'no-expiry': {
    label: '기한 없음',
    badge: 'border-slate-200 bg-slate-100 text-slate-600',
    card: 'border-slate-200',
  },
} as const;

function getRemainingLabel(daysRemaining: number | null) {
  if (daysRemaining === null) {
    return '유통기한 없음';
  }

  if (daysRemaining < 0) {
    return `${Math.abs(daysRemaining)}일 지남`;
  }

  if (daysRemaining === 0) {
    return '오늘까지';
  }

  return `${daysRemaining}일 남음`;
}

export function FoodCard({ item, today, onEdit, onDelete }: FoodCardProps) {
  const status = getFoodStatus(item, today);
  const daysRemaining = getDaysRemaining(item.expiresAt, today);
  const statusStyle = statusStyles[status];

  return (
    <article
      className={`rounded-[1.5rem] border bg-white/95 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${statusStyle.card}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${locationStyles[item.location]}`}
              >
                {locationLabels[item.location]}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}
              >
                {statusStyle.label}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
              {item.quantity ? (
                <p className="mt-1 text-sm text-slate-500">수량: {item.quantity}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              삭제
            </button>
          </div>
        </div>

        <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">
              등록일
            </dt>
            <dd className="mt-1 font-medium text-slate-700">{item.createdAt}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">
              유통기한
            </dt>
            <dd className="mt-1 font-medium text-slate-700">
              {item.expiresAt ?? '미정'}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">
              남은 일수
            </dt>
            <dd className="mt-1 font-medium text-slate-700">
              {getRemainingLabel(daysRemaining)}
            </dd>
          </div>
        </dl>

        {item.memo ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-canvas/60 px-4 py-3 text-sm leading-6 text-slate-600">
            {item.memo}
          </p>
        ) : null}
      </div>
    </article>
  );
}

