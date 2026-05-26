import { createLoader, parseAsString, parseAsStringLiteral } from 'nuqs/server'
import type { Where } from 'payload'

import {
  categoriesParser,
  locationParser,
  normalizeCategorySlugs,
  normalizeSlug,
  pageParser,
  regionParser,
  resolveIdBySlug,
  resolveIdsBySlug,
  serverSyncOptions,
} from '@/components/filters/sharedFilterParsers'
import type { Category, Location, Region } from '@/payload-types'
import { nextIsoDay } from '@/utilities/formatDateTime'

export const EVENT_SOURCES = ['syt', 'community'] as const
export type EventSource = (typeof EVENT_SOURCES)[number]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const eventsFilterParsers = {
  source: parseAsStringLiteral(EVENT_SOURCES)
    .withDefault('syt')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true }),
  date: parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true }),
  categories: categoriesParser,
  region: regionParser,
  location: locationParser,
  page: pageParser,
}

export type ParsedEventFilters = {
  source: EventSource
  date: string | null
  categorySlugs: string[]
  regionSlug: string | null
  locationSlug: string | null
}

export const loadEventsFilters = createLoader(eventsFilterParsers)

export const normalizeEventsFilters = (
  raw: Awaited<ReturnType<typeof loadEventsFilters>>,
): ParsedEventFilters => ({
  source: raw.source,
  date: raw.date && ISO_DATE.test(raw.date) ? raw.date : null,
  categorySlugs: normalizeCategorySlugs(raw.categories),
  regionSlug: normalizeSlug(raw.region),
  locationSlug: normalizeSlug(raw.location),
})

export const hasActiveFilters = (filters: ParsedEventFilters): boolean =>
  !!filters.date ||
  filters.categorySlugs.length > 0 ||
  !!filters.regionSlug ||
  !!filters.locationSlug

export const buildEventsWhere = (
  filters: ParsedEventFilters,
  {
    categories,
    regions,
    locations,
  }: { categories: Category[]; regions: Region[]; locations: Location[] },
): Where => {
  const categoryIds = resolveIdsBySlug(filters.categorySlugs, categories)
  const regionId = resolveIdBySlug(filters.regionSlug, regions)
  const locationId = resolveIdBySlug(filters.locationSlug, locations)

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
  if (locationId !== null) {
    where.location = { equals: locationId }
  }
  return where
}
