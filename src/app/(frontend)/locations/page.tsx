import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FilteredListing } from '@/components/FilteredListing'
import { loadFilteredList } from '@/filteredList'
import { LocationCard } from '@/components/locations/LocationCard'
import { LocationsFilterBar } from '@/components/locations/filters/LocationsFilterBar'
import { locationsFilters } from '@/components/locations/filters/locationsFilters'
import RichText from '@/components/RichText'
import type { Location } from '@/payload-types'

import { hostEventIntro } from './content'

const QUERY_LIMIT = 100

export const dynamic = 'force-dynamic'

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const payload = await getPayload({ config: configPromise })

  const { result, filters, options } = await loadFilteredList<
    typeof locationsFilters,
    'locations',
    Location
  >({
    payload,
    searchParams,
    filters: locationsFilters,
    query: {
      collection: 'locations',
      depth: 1,
      limit: QUERY_LIMIT,
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
