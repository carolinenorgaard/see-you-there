import configPromise from '@payload-config'
import { createLoader } from 'nuqs/server'
import { getPayload } from 'payload'

import { EmptyEventsMessage } from '@/components/events/EmptyEventsMessage'
import { EventCard } from '@/components/events/EventCard'
import { LikeButton } from '@/components/events/LikeButton'
import { SourceToggle } from '@/components/events/SourceToggle'
import { EventsFilterBar } from '@/components/events/filters/EventsFilterBar'
import { eventsFilters } from '@/components/events/filters/eventsFilters'
import { FilteredListing } from '@/components/FilteredListing'
import { loadFilteredList } from '@/filteredList'
import {
  normalizePerPage,
  pageParser,
  perPageParser,
} from '@/components/filters/sharedFilterParsers'
import type { Event } from '@/payload-types'
import { extractIds } from '@/utilities/extractIds'
import { getOptionalMe } from '@/utilities/getOptionalMe'

const loadPage = createLoader({ page: pageParser, perPage: perPageParser })

export const dynamic = 'force-dynamic'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const { page: rawPage, perPage: rawPerPage } = loadPage(resolved)
  const page = Math.max(1, rawPage)
  const limit = normalizePerPage(rawPerPage)

  const payload = await getPayload({ config: configPromise })

  const [me, list] = await Promise.all([
    getOptionalMe(),
    loadFilteredList<typeof eventsFilters, 'events', Event>({
      payload,
      searchParams: Promise.resolve(resolved),
      filters: eventsFilters,
      query: {
        collection: 'events',
        depth: 2,
        limit,
        page,
        sort: 'startDate',
      },
    }),
  ])

  const { result, filters, options } = list

  return (
    <FilteredListing<Event>
      result={result}
      header={
        <>
          <h1 className="text-4xl mb-6 font-bold tracking-tight">Begivenhedsvæg</h1>
          <div className="simple-text">
            {filters.source === 'syt' ? (
              <>
                <h2>
                  Begivenheder fra <span className="text-brand-teal">See You There</span>
                </h2>
                <p>
                  Her finder du de begivenheder, vi på See You There har samlet til dig. Det kan
                  være koncerter, fællesspisninger, kulturoplevelser og meget andet — alt sammen
                  samlet ét sted, så du nemt kan finde noget at lave.
                </p>
                <p>
                  Klik dig ind på en begivenhed for at se, hvor og hvornår den finder sted, og
                  hvordan du deltager.
                </p>
              </>
            ) : (
              <>
                <h2>
                  Begivenheder skabt af <span className="text-brand-mint">fællesskabet</span>
                </h2>
                <p>
                  Her finder du de begivenheder, som andre brugere selv har oprettet på See You
                  There. Det kan være alt fra bogklubber og yoga-sessioner til uformelle
                  sammenkomster — skabt af mennesker som dig.
                </p>
                <p>
                  Mangler der noget på listen? Gå til <a href="/locations">Lokationer</a> og vær
                  vært for dit eget event på et af de steder, vi har samlet.
                </p>
              </>
            )}
          </div>
          <div className="flex items-center justify-end">
            <SourceToggle active={filters.source} />
          </div>
        </>
      }
      filterBar={<EventsFilterBar filters={filters} options={options} />}
      empty={<EmptyEventsMessage filters={filters} />}
      renderItem={(event) => {
        const likeIds = extractIds(event.likes)
        const liked = !!me && likeIds.includes(me.id)
        return (
          <EventCard
            event={event}
            action={
              <LikeButton
                eventId={String(event.id)}
                initialLiked={liked}
                initialCount={likeIds.length}
                loggedIn={!!me}
                showCount={false}
                iconOnly
              />
            }
          />
        )
      }}
    />
  )
}
