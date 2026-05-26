import { createLoader } from 'nuqs/server'
import type { Where } from 'payload'

import {
  categoriesParser,
  normalizeCategorySlugs,
  normalizeSlug,
  regionParser,
  resolveIdBySlug,
  resolveIdsBySlug,
} from '@/components/filters/sharedFilterParsers'
import type { Category, Region } from '@/payload-types'

export const loadLocationsFilters = createLoader({
  categories: categoriesParser,
  region: regionParser,
})

export type ParsedLocationFilters = {
  categorySlugs: string[]
  regionSlug: string | null
}

export const normalizeLocationsFilters = (
  raw: Awaited<ReturnType<typeof loadLocationsFilters>>,
): ParsedLocationFilters => ({
  categorySlugs: normalizeCategorySlugs(raw.categories),
  regionSlug: normalizeSlug(raw.region),
})

export const buildLocationsWhere = (
  filters: ParsedLocationFilters,
  { categories, regions }: { categories: Category[]; regions: Region[] },
): Where => {
  const categoryIds = resolveIdsBySlug(filters.categorySlugs, categories)
  const regionId = resolveIdBySlug(filters.regionSlug, regions)

  const where: Where = {}
  if (categoryIds.length) {
    where.categories = { in: categoryIds }
  }
  if (regionId !== null) {
    where['address.region'] = { equals: regionId }
  }
  return where
}
