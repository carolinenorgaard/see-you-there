export const extractIds = (value: unknown): (string | number)[] => {
  if (!Array.isArray(value)) return []
  return value.map((v) =>
    typeof v === 'object' && v !== null && 'id' in v
      ? (v as { id: string | number }).id
      : (v as string | number),
  )
}
