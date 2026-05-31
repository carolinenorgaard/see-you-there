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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Begivenhedsvæg</h1>
          <SourceToggle active={filters.source} />
        </div>
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
