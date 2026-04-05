import { FoodCard } from './FoodCard';
import type { FoodItem, StorageLocation } from '../types/food';

interface FoodSectionProps {
  title: string;
  description: string;
  location: StorageLocation;
  items: FoodItem[];
  today: string;
  search: string;
  onEdit: (item: FoodItem) => void;
  onDelete: (item: FoodItem) => void;
}

const sectionStyles: Record<StorageLocation, string> = {
  fridge: 'border-fridge/10 bg-[linear-gradient(180deg,rgba(15,118,110,0.06),rgba(255,255,255,0.92))]',
  freezer:
    'border-freezer/10 bg-[linear-gradient(180deg,rgba(37,99,235,0.06),rgba(255,255,255,0.92))]',
};

const countStyles: Record<StorageLocation, string> = {
  fridge: 'text-fridge',
  freezer: 'text-freezer',
};

export function FoodSection({
  title,
  description,
  location,
  items,
  today,
  search,
  onEdit,
  onDelete,
}: FoodSectionProps) {
  const emptyMessage = search.trim()
    ? `"${search}" 검색 조건에 맞는 항목이 없습니다.`
    : `${title}에 등록된 음식이 아직 없습니다.`;

  return (
    <section
      className={`rounded-[1.75rem] border p-6 shadow-panel backdrop-blur ${sectionStyles[location]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-ink">{title}</h2>
            <span
              className={`text-sm font-semibold uppercase tracking-[0.2em] ${countStyles[location]}`}
            >
              {items.length}개
            </span>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm leading-6 text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              today={today}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
