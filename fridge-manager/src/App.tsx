import { useDeferredValue, useState } from 'react';
import { ErrorBanner } from './components/ErrorBanner';
import { FoodFormModal } from './components/FoodFormModal';
import { FoodSection } from './components/FoodSection';
import { Toolbar } from './components/Toolbar';
import { useFoodItems } from './hooks/useFoodItems';
import { formatDate } from './lib/date';
import { filterAndSortItems } from './lib/food';
import type { FoodFormValues, FoodItem, SortOption } from './types/food';

function createEmptyFormValues(today: string): FoodFormValues {
  return {
    name: '',
    location: 'fridge',
    createdAt: today,
    expiresAt: '',
    quantity: '',
    memo: '',
  };
}

function createFormValues(item: FoodItem): FoodFormValues {
  return {
    name: item.name,
    location: item.location,
    createdAt: item.createdAt,
    expiresAt: item.expiresAt ?? '',
    quantity: item.quantity ?? '',
    memo: item.memo ?? '',
  };
}

export default function App() {
  const {
    items,
    isHydrating,
    isSaving,
    error,
    addItem,
    updateItem,
    deleteItem,
    clearError,
  } = useFoodItems();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('expiry');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = formatDate(new Date());
  const deferredSearch = useDeferredValue(search);
  const filteredItems = filterAndSortItems(items, deferredSearch, sort);
  const fridgeItems = filteredItems.filter((item) => item.location === 'fridge');
  const freezerItems = filteredItems.filter((item) => item.location === 'freezer');

  function openAddModal() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: FoodItem) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  function handleDelete(item: FoodItem) {
    const shouldDelete = window.confirm(
      `"${item.name}" 항목을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`,
    );

    if (!shouldDelete) {
      return;
    }

    deleteItem(item.id);
  }

  function handleSubmit(values: FoodFormValues) {
    const normalizedItem = {
      name: values.name.trim(),
      location: values.location,
      createdAt: editingItem?.createdAt ?? values.createdAt,
      expiresAt: values.expiresAt || undefined,
      quantity: values.quantity || undefined,
      memo: values.memo || undefined,
    };

    const succeeded = editingItem
      ? updateItem({ ...editingItem, ...normalizedItem })
      : addItem(normalizedItem);

    if (succeeded) {
      closeModal();
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.16),_transparent_60%)]" />
      <div className="pointer-events-none absolute right-[-10rem] top-36 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.14),_transparent_60%)] blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-card/95 p-6 shadow-panel backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex rounded-full border border-fridge/20 bg-fridge/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-fridge">
                Fridge Manager MVP
              </span>
              <div className="space-y-2">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  냉장실과 냉동실의 식재료를 한눈에 관리하세요.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  등록일은 자동으로 기록하고, 유통기한이 지난 음식과 3일
                  이하로 남은 음식을 바로 구분해 보여줍니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  총 등록 수
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">{items.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  오늘 기준
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{today}</p>
              </div>
            </div>
          </div>
        </section>

        {error ? <ErrorBanner message={error} onDismiss={clearError} /> : null}

        <Toolbar
          totalCount={filteredItems.length}
          search={search}
          sort={sort}
          onSearchChange={setSearch}
          onSortChange={setSort}
          onAddClick={openAddModal}
        />

        {isHydrating ? (
          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-panel">
              <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-panel">
              <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-2">
            <FoodSection
              title="냉장실"
              description="자주 꺼내는 식재료를 빠르게 확인하세요."
              location="fridge"
              items={fridgeItems}
              today={today}
              search={deferredSearch}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
            <FoodSection
              title="냉동실"
              description="오래 보관하는 항목도 유통기한을 놓치지 않게 관리합니다."
              location="freezer"
              items={freezerItems}
              today={today}
              search={deferredSearch}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </section>
        )}
      </main>

      <FoodFormModal
        isOpen={isModalOpen}
        mode={editingItem ? 'edit' : 'create'}
        initialValues={
          editingItem ? createFormValues(editingItem) : createEmptyFormValues(today)
        }
        isSubmitting={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

