import { createLoader, parseAsArrayOf, parseAsString } from 'nuqs/server'
import type { Where } from 'payload'

import type { Category, Region } from '@/payload-types'

// shallow:false triggers a Next.js router refresh on each write so the
// server component re-runs the Payload query with the new filters.
const serverSyncOptions = { shallow: false } as const

export const locationsFilterParsers = {
  categories: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions(serverSyncOptions),
  region: parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true }),
}

export type ParsedLocationFilters = {
  categorySlugs: string[]
  regionSlug: string | null
}

export const loadLocationsFilters = createLoader(locationsFilterParsers)

export const normalizeLocationsFilters = (
  raw: Awaited<ReturnType<typeof loadLocationsFilters>>,
): ParsedLocationFilters => ({
  categorySlugs: raw.categories.filter(Boolean),
  regionSlug: raw.region || null,
})

export const buildLocationsWhere = (
  filters: ParsedLocationFilters,
  { categories, regions }: { categories: Category[]; regions: Region[] },
): Where => {
  const categoryIds = categories
    .filter((c) => c.slug && filters.categorySlugs.includes(c.slug))
    .map((c) => c.id)
  const regionId = regions.find((r) => r.slug === filters.regionSlug)?.id ?? null

  const where: Where = {}
  if (categoryIds.length) {
    where.categories = { in: categoryIds }
  }
  if (regionId !== null) {
    where['address.region'] = { equals: regionId }
  }
  return where
}
