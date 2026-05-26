import { createLoader, parseAsString, parseAsStringLiteral } from 'nuqs/server'
import type { Where } from 'payload'

import {
  categoriesParser,
  normalizeCategorySlugs,
  normalizeRegionSlug,
  regionParser,
  resolveIdsBySlug,
  serverSyncOptions,
} from '@/components/filters/sharedFilterParsers'
import type { Category, Region } from '@/payload-types'
import { nextIsoDay } from '@/utilities/formatDateTime'

export const EVENT_SOURCES = ['syt', 'community'] as const
export type EventSource = (typeof EVENT_SOURCES)[number]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const eventsFilterParsers = {
  source: parseAsStringLiteral(EVENT_SOURCES)
    .withDefault('syt')
    .withOptions(serverSyncOptions),
  date: parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true }),
  categories: categoriesParser,
  region: regionParser,
}

export type ParsedEventFilters = {
  source: EventSource
  date: string | null
  categorySlugs: string[]
  regionSlug: string | null
}

export const loadEventsFilters = createLoader(eventsFilterParsers)

export const normalizeEventsFilters = (
  raw: Awaited<ReturnType<typeof loadEventsFilters>>,
): ParsedEventFilters => ({
  source: raw.source,
  date: raw.date && ISO_DATE.test(raw.date) ? raw.date : null,
  categorySlugs: normalizeCategorySlugs(raw.categories),
  regionSlug: normalizeRegionSlug(raw.region),
})

export const hasActiveFilters = (filters: ParsedEventFilters): boolean =>
  !!filters.date || filters.categorySlugs.length > 0 || !!filters.regionSlug

export const buildEventsWhere = (
  filters: ParsedEventFilters,
  { categories, regions }: { categories: Category[]; regions: Region[] },
): Where => {
  const categoryIds = resolveIdsBySlug(filters.categorySlugs, categories)
  const regionId = filters.regionSlug
    ? resolveIdsBySlug([filters.regionSlug], regions)[0] ?? null
    : null

  const where: Where = {
    createdBySeeYouThere: { equals: filters.source === 'syt' },
  }
  if (filters.date) {
    where.startDate = {
      greater_than_equal: `${filters.date}T00:00:00.000Z`,
      less_than: `${nextIsoDay(filters.date)}T00:00:00.000Z`,
    }
  }
  if (categoryIds.length) {
    where.categories = { in: categoryIds }
  }
  if (regionId !== null) {
    where['location.address.region'] = { equals: regionId }
  }
  return where
}
