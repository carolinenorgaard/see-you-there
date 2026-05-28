import { pickManyFilter, pickOneFilter, type StateOf } from '@/list'
import type { Category, Region } from '@/payload-types'

// The Filters of the Locations List.
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

export type LocationsFilterState = StateOf<typeof locationsFilters>
