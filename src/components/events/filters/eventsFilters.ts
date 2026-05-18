import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs/server'
import type { Where } from 'payload'

import type { Category, Region } from '@/payload-types'
import { nextIsoDay } from '@/utilities/formatDateTime'

export const EVENT_SOURCES = ['syt', 'community'] as const
export type EventSource = (typeof EVENT_SOURCES)[number]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// shallow:false triggers a Next.js router refresh on each write so the
// server component re-runs the Payload query with the new filters.
const serverSyncOptions = { shallow: false } as const

export const eventsFilterParsers = {
  source: parseAsStringLiteral(EVENT_SOURCES)
    .withDefault('syt')
    .withOptions(serverSyncOptions),
  date: parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true }),
  categories: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions(serverSyncOptions),
  region: parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true }),
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
  categorySlugs: raw.categories.filter(Boolean),
  regionSlug: raw.region || null,
})

export const hasActiveFilters = (filters: ParsedEventFilters): boolean =>
  !!filters.date || filters.categorySlugs.length > 0 || !!filters.regionSlug

export const buildEventsWhere = (
  filters: ParsedEventFilters,
  { categories, regions }: { categories: Category[]; regions: Region[] },
): Where => {
  // Resolve URL slugs to IDs so the Payload query hits the indexed
  // relationship fields instead of joining through .slug text columns.
  const categoryIds = categories
    .filter((c) => c.slug && filters.categorySlugs.includes(c.slug))
    .map((c) => c.id)
  const regionId = regions.find((r) => r.slug === filters.regionSlug)?.id ?? null

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

