import { dayFilter, type FiltersOf, mergeFilterParsers, pickManyFilter, pickOneFilter, toggleFilter } from '@/list'
import { pageParser } from '@/components/filters/sharedFilterParsers'
import type { Category, Location, Region } from '@/payload-types'

export const EVENT_SOURCES = ['syt', 'community'] as const
export type EventSource = (typeof EVENT_SOURCES)[number]

// The Filters of the Events List.
// Keyed names become the property names on the state/options returned by
// loadList — and the property names used by EmptyEventsMessage and
// hasActiveFilters below.
export const eventsFilters = {
  source: toggleFilter({
    paramKey: 'source',
    values: EVENT_SOURCES,
    defaultValue: 'syt',
    payloadPath: 'createdBySeeYouThere',
    trueWhen: 'syt',
  }),
  date: dayFilter({
    paramKey: 'date',
    payloadPath: 'startDate',
  }),
  categories: pickManyFilter<Category>({
    paramKey: 'categories',
    collection: 'categories',
    payloadPath: 'categories',
    limit: 100,
  }),
  region: pickOneFilter<Region>({
    paramKey: 'region',
    collection: 'regions',
    payloadPath: 'location.address.region',
    limit: 200,
    sort: 'title',
  }),
  location: pickOneFilter<Location>({
    paramKey: 'location',
    collection: 'locations',
    payloadPath: 'location',
    limit: 500,
    sort: 'title',
    select: { title: true, slug: true },
  }),
}

// URL parser map for client components (SourceToggle, DateChipRail) that call
// useQueryStates with a subset of these parsers. Pagination is not a Filter
// but is part of the URL state, so it lives alongside.
export const eventsUrlParsers: Record<string, any> = {
  ...mergeFilterParsers(eventsFilters),
  page: pageParser,
}

export type EventsFilters = FiltersOf<typeof eventsFilters>

export const hasActiveFilters = (filters: EventsFilters): boolean =>
  !!filters.date ||
  filters.categories.length > 0 ||
  !!filters.region ||
  !!filters.location
