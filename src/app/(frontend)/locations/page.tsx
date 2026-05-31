import configPromise from '@payload-config'
import { createLoader } from 'nuqs/server'
import { getPayload } from 'payload'

import { FilteredListing } from '@/components/FilteredListing'
import { loadFilteredList } from '@/filteredList'
import {
  normalizePerPage,
  pageParser,
  perPageParser,
} from '@/components/filters/sharedFilterParsers'
import { LocationCard } from '@/components/locations/LocationCard'
import { LocationsFilterBar } from '@/components/locations/filters/LocationsFilterBar'
import { locationsFilters } from '@/components/locations/filters/locationsFilters'
import RichText from '@/components/RichText'
import type { Location } from '@/payload-types'

import { hostEventIntro } from './content'

const loadPage = createLoader({ page: pageParser, perPage: perPageParser })

export const dynamic = 'force-dynamic'

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const { page: rawPage, perPage: rawPerPage } = loadPage(resolved)
  const page = Math.max(1, rawPage)
  const limit = normalizePerPage(rawPerPage)

  const payload = await getPayload({ config: configPromise })

  const { result, filters, options } = await loadFilteredList<
    typeof locationsFilters,
    'locations',
    Location
  >({
    payload,
    searchParams: Promise.resolve(resolved),
    filters: locationsFilters,
    query: {
      collection: 'locations',
      depth: 1,
      limit,
      page,
    },
  })

  return (
    <FilteredListing<Location>
      result={result}
      header={
        <>
          <h1 className="text-4xl font-bold tracking-tight">Lokationer</h1>
          <RichText data={hostEventIntro} enableGutter={false} className="mt-6 max-w-3xl" />
        </>
      }
      filterBar={<LocationsFilterBar filters={filters} options={options} />}
      empty={<p>Ingen lokationer fundet.</p>}
      renderItem={(location) => <LocationCard location={location} />}
    />
  )
}
