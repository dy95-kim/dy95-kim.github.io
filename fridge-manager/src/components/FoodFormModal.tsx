import { type FormEvent, useEffect, useState } from 'react';
import { isValidDateInput } from '../lib/date';
import type { FoodFormValues, StorageLocation } from '../types/food';

interface FoodFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialValues: FoodFormValues;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: FoodFormValues) => void;
}

type FieldErrors = Partial<Record<keyof FoodFormValues, string>>;

const locationLabels: Record<StorageLocation, string> = {
  fridge: '냉장실',
  freezer: '냉동실',
};

export function FoodFormModal({
  isOpen,
  mode,
  initialValues,
  isSubmitting,
  onClose,
  onSubmit,
}: FoodFormModalProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues(initialValues);
    setErrors({});
  }, [
    initialValues.createdAt,
    initialValues.expiresAt,
    initialValues.location,
    initialValues.memo,
    initialValues.name,
    initialValues.quantity,
    isOpen,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  function updateField<K extends keyof FoodFormValues>(
    field: K,
    value: FoodFormValues[K],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FieldErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = '음식 이름을 입력해 주세요.';
    }

    if (!values.location) {
      nextErrors.location = '보관 위치를 선택해 주세요.';
    }

    if (values.expiresAt && !isValidDateInput(values.expiresAt)) {
      nextErrors.expiresAt = '유통기한은 yyyy-mm-dd 형식의 올바른 날짜여야 합니다.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...values,
      name: values.name.trim(),
      expiresAt: values.expiresAt.trim(),
      quantity: values.quantity.trim(),
      memo: values.memo.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {mode === 'create' ? '새 항목' : '수정 모드'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              {mode === 'create' ? '음식 추가' : '음식 수정'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              필수 항목만 빠르게 입력하고, 유통기한과 메모는 필요할 때만
              남길 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            닫기
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                음식 이름 *
              </span>
              <input
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="예: 우유, 닭가슴살, 김치"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-fridge focus:ring-4 focus:ring-fridge/10"
              />
              {errors.name ? (
                <p className="mt-2 text-xs text-rose-600">{errors.name}</p>
              ) : null}
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                보관 위치 *
              </span>
              <select
                value={values.location}
                onChange={(event) =>
                  updateField('location', event.target.value as StorageLocation)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-fridge focus:ring-4 focus:ring-fridge/10"
              >
                {Object.entries(locationLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.location ? (
                <p className="mt-2 text-xs text-rose-600">{errors.location}</p>
              ) : null}
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                등록일
              </span>
              <input
                value={values.createdAt}
                readOnly
                disabled
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                유통기한
              </span>
              <input
                type="date"
                value={values.expiresAt}
                onChange={(event) => updateField('expiresAt', event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-fridge focus:ring-4 focus:ring-fridge/10"
              />
              {errors.expiresAt ? (
                <p className="mt-2 text-xs text-rose-600">{errors.expiresAt}</p>
              ) : null}
            </label>
          </div>

          <div className="sm:max-w-sm">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                수량
              </span>
              <input
                value={values.quantity}
                onChange={(event) => updateField('quantity', event.target.value)}
                placeholder="예: 2개, 1봉지"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-fridge focus:ring-4 focus:ring-fridge/10"
              />
            </label>
          </div>

          <div>
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                메모
              </span>
              <textarea
                value={values.memo}
                onChange={(event) => updateField('memo', event.target.value)}
                rows={4}
                placeholder="예: 이번 주 안에 사용, 해동 후 바로 조리"
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-fridge focus:ring-4 focus:ring-fridge/10"
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? '저장 중...'
                : mode === 'create'
                  ? '추가하기'
                  : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
