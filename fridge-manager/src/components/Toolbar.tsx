import type { SortOption } from '../types/food';

interface ToolbarProps {
  totalCount: number;
  search: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onAddClick: () => void;
}

export function Toolbar({
  totalCount,
  search,
  sort,
  onSearchChange,
  onSortChange,
  onAddClick,
}: ToolbarProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-panel backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            관리 도구
          </p>
          <h2 className="text-lg font-semibold text-ink">
            {search.trim() ? `${totalCount}개의 검색 결과` : `${totalCount}개의 식재료`}
          </h2>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-3xl lg:flex-row">
          <label className="flex-1">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              음식 검색
            </span>
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="예: 우유, 김치, 만두"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-fridge focus:ring-4 focus:ring-fridge/10"
            />
          </label>

          <label className="lg:w-56">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              정렬 기준
            </span>
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-fridge focus:ring-4 focus:ring-fridge/10"
            >
              <option value="expiry">유통기한 빠른 순</option>
              <option value="recent">최근 등록 순</option>
            </select>
          </label>

          <div className="lg:w-auto lg:self-end">
            <button
              type="button"
              onClick={onAddClick}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 lg:w-auto"
            >
              음식 추가
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
