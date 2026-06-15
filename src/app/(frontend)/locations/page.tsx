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
import type { Location } from '@/payload-types'

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
          <h1 className="text-4xl mb-6 font-bold tracking-tight">Lokationer</h1>
          <div className="simple-text">
            <h2>Vært for dit eget event på en lokation</h2>
            <p>
              Her finder du de lokationer, vi har samlet på See You There. Du kan ikke selv tilføje
              nye lokationer, men du kan være med til at sætte gang i livet på dem, der allerede er
              her.
            </p>
            <p>
              Vælg en af lokationerne nedenfor og opret dit eget event dér — uanset om det er en
              koncert, en bogklub, en yoga-session eller bare en uformel sammenkomst. Når du
              opretter et event, vises det på <strong>Event Wall</strong> under Fællesskab-fanen, så
              andre kan finde det, deltage og dele oplevelsen.
            </p>
            <p>Det er gratis, nemt og en god måde at samle folk omkring noget, du brænder for.</p>
          </div>
        </>
      }
      filterBar={<LocationsFilterBar filters={filters} options={options} />}
      empty={<p>Ingen lokationer fundet.</p>}
      renderItem={(location) => <LocationCard location={location} />}
    />
  )
}
