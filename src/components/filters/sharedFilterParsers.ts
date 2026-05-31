import { parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server'

// shallow:false triggers a Next.js router refresh on each write so the
// server component re-runs the Payload query with the new filters.
export const serverSyncOptions = { shallow: false } as const

export const categoriesParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions(serverSyncOptions)

export const slugParser = parseAsString
  .withDefault('')
  .withOptions({ ...serverSyncOptions, clearOnDefault: true })

export const regionParser = slugParser
export const locationParser = slugParser

export const pageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ ...serverSyncOptions, clearOnDefault: true })

export const PER_PAGE_OPTIONS = [9, 27, 54] as const
export type PerPage = (typeof PER_PAGE_OPTIONS)[number]
const PER_PAGE_DEFAULT: PerPage = PER_PAGE_OPTIONS[0]

export const perPageParser = parseAsInteger
  .withDefault(PER_PAGE_DEFAULT)
  .withOptions({ ...serverSyncOptions, clearOnDefault: true })

export const normalizePerPage = (raw: number): PerPage =>
  (PER_PAGE_OPTIONS as readonly number[]).includes(raw) ? (raw as PerPage) : PER_PAGE_DEFAULT

export const normalizeCategorySlugs = (raw: string[]): string[] => raw.filter(Boolean)

export const normalizeSlug = (raw: string): string | null => raw || null

type SlugItem = { id: string | number; slug?: string | null }

export const resolveIdsBySlug = <T extends SlugItem>(slugs: string[], items: T[]): T['id'][] => {
  const set = new Set(slugs)
  return items.filter((i) => i.slug && set.has(i.slug)).map((i) => i.id)
}

export const resolveIdBySlug = <T extends SlugItem>(
  slug: string | null,
  items: T[],
): T['id'] | null => (slug ? resolveIdsBySlug([slug], items)[0] ?? null : null)
