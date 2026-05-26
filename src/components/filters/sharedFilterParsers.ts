import { parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server'

// shallow:false triggers a Next.js router refresh on each write so the
// server component re-runs the Payload query with the new filters.
export const serverSyncOptions = { shallow: false } as const

export const categoriesParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions(serverSyncOptions)

export const regionParser = parseAsString
  .withDefault('')
  .withOptions({ ...serverSyncOptions, clearOnDefault: true })

export const pageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ ...serverSyncOptions, clearOnDefault: true })

export const normalizeCategorySlugs = (raw: string[]): string[] => raw.filter(Boolean)

export const normalizeRegionSlug = (raw: string): string | null => raw || null

export const resolveIdsBySlug = <T extends { id: string | number; slug?: string | null }>(
  slugs: string[],
  items: T[],
): T['id'][] => {
  const set = new Set(slugs)
  return items.filter((i) => i.slug && set.has(i.slug)).map((i) => i.id)
}
