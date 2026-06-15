import configPromise from '@payload-config'
import Link from 'next/link'
import { createLoader } from 'nuqs/server'
import { getPayload } from 'payload'

import { EmptyEventsMessage } from '@/components/events/EmptyEventsMessage'
import { EventCard } from '@/components/events/EventCard'
import { LikeButton } from '@/components/events/LikeButton'
import { SourceToggle } from '@/components/events/SourceToggle'
import { EventsFilterBar } from '@/components/events/filters/EventsFilterBar'
import { eventsFilters } from '@/components/events/filters/eventsFilters'
import { FilteredListing } from '@/components/FilteredListing'
import {
  normalizePerPage,
  pageParser,
  perPageParser,
} from '@/components/filters/sharedFilterParsers'
import { loadFilteredList } from '@/filteredList'
import type { Event } from '@/payload-types'
import { extractIds } from '@/utilities/extractIds'
import { todayIsoStart } from '@/utilities/formatDateTime'
import { getOptionalMe } from '@/utilities/getOptionalMe'

const loadPage = createLoader({ page: pageParser, perPage: perPageParser })

export const dynamic = 'force-dynamic'

export default async function EventsArchivePage({
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
      baseWhere: { endDate: { less_than: todayIsoStart() } },
      query: {
        collection: 'events',
        depth: 2,
        limit,
        page,
        sort: '-endDate',
      },
    }),
  ])

  const { result, filters, options } = list

  return (
    <FilteredListing<Event>
      result={result}
      header={
        <>
          <h1 className="text-4xl mb-6 font-bold tracking-tight">Tidligere begivenheder</h1>
          <div className="simple-text">
            <p>
              Her finder du begivenheder, der allerede har fundet sted. Et arkiv over koncerter,
              fællesspisninger, kulturoplevelser og alt det andet, vi har samlet på See You There.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/events"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Kommende begivenheder →
            </Link>
            <SourceToggle active={filters.source} />
          </div>
        </>
      }
      filterBar={<EventsFilterBar filters={filters} options={options} showDate={false} />}
      empty={<EmptyEventsMessage filters={filters} variant="archive" />}
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
