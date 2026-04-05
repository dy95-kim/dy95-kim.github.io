const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseDateParts(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));

  return { year, month, day };
}

export function formatDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isValidDateInput(value: string): boolean {
  const parts = parseDateParts(value);

  if (!parts) {
    return false;
  }

  const parsed = new Date(parts.year, parts.month - 1, parts.day);

  return (
    parsed.getFullYear() === parts.year &&
    parsed.getMonth() === parts.month - 1 &&
    parsed.getDate() === parts.day
  );
}

export function toDateValue(value: string): number | null {
  const parts = parseDateParts(value);

  if (!parts) {
    return null;
  }

  const parsed = new Date(parts.year, parts.month - 1, parts.day);

  if (
    parsed.getFullYear() !== parts.year ||
    parsed.getMonth() !== parts.month - 1 ||
    parsed.getDate() !== parts.day
  ) {
    return null;
  }

  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

export function getDaysBetween(start: string, end: string): number | null {
  const startValue = toDateValue(start);
  const endValue = toDateValue(end);

  if (startValue === null || endValue === null) {
    return null;
  }

  return Math.floor((endValue - startValue) / DAY_IN_MS);
}
