import { type FiltersOf, mergeFilterParsers, pickManyFilter, pickOneFilter } from '@/filteredList'
import { pageParser } from '@/components/filters/sharedFilterParsers'
import type { Category, Region } from '@/payload-types'

// The Filters of the Locations Filtered List.
// The region path is one-hop here (Location → address.region), versus the
// two-hop path on Events (Event → location.address.region).
export const locationsFilters = {
  categories: pickManyFilter<Category>({
    paramKey: 'categories',
    collection: 'categories',
    payloadPath: 'categories',
    limit: 100,
  }),
  region: pickOneFilter<Region>({
    paramKey: 'region',
    collection: 'regions',
    payloadPath: 'address.region',
    limit: 200,
    sort: 'title',
  }),
}

// URL parser map for client components that call useQueryStates with a
// subset of these parsers. Pagination is not a Filter but lives alongside.
export const locationsUrlParsers: Record<string, any> = {
  ...mergeFilterParsers(locationsFilters),
  page: pageParser,
}

export type LocationsFilters = FiltersOf<typeof locationsFilters>

export const hasActiveFilters = (filters: LocationsFilters): boolean =>
  filters.categories.length > 0 || !!filters.region
