// Payload relationship fields are populated to the object form when `depth >= 1`
// for that field, otherwise they remain as the raw id (string/number). These
// helpers narrow the union to the populated shape — or null/[] when missing.

export const populated = <T extends { id: string | number }>(
  value: T | string | number | null | undefined,
): T | null => (typeof value === 'object' && value !== null ? value : null)

export const populatedList = <T extends { id: string | number }>(
  value: (T | string | number)[] | null | undefined,
): T[] =>
  (value ?? []).filter((v): v is T => typeof v === 'object' && v !== null)
