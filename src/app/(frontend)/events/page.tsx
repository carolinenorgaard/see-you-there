import configPromise from '@payload-config'
import { createLoader } from 'nuqs/server'
import { getPayload } from 'payload'

import { EmptyEventsMessage } from '@/components/events/EmptyEventsMessage'
import { EventCard } from '@/components/events/EventCard'
import { LikeButton } from '@/components/events/LikeButton'
import { SourceToggle } from '@/components/events/SourceToggle'
import { DateChipRail } from '@/components/events/filters/DateChipRail'
import { eventsFilters } from '@/components/events/filters/eventsFilters'
import { CategoryChipRow } from '@/components/filters/CategoryChipRow'
import { loadList } from '@/list'
import { pageParser } from '@/components/filters/sharedFilterParsers'
import { SlugComboboxFilter } from '@/components/filters/SlugComboboxFilter'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import type { Event } from '@/payload-types'
import { extractIds } from '@/utilities/extractIds'
import { getOptionalMe } from '@/utilities/getOptionalMe'

const PAGE_SIZE = 24

const loadPage = createLoader({ page: pageParser })

export const dynamic = 'force-dynamic'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const { page: rawPage } = loadPage(resolved)
  const page = Math.max(1, rawPage)

  const payload = await getPayload({ config: configPromise })

  const [me, list] = await Promise.all([
    getOptionalMe(),
    loadList<typeof eventsFilters, 'events', Event>({
      payload,
      searchParams: Promise.resolve(resolved),
      filters: eventsFilters,
      query: {
        collection: 'events',
        depth: 2,
        limit: PAGE_SIZE,
        page,
        sort: 'startDate',
      },
    }),
  ])

  const { result, filters, options } = list
  const { categories, region: regions, location: locations } = options

  return (
    <div className="container pt-24 pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Begivenhedsvæg</h1>
        <SourceToggle active={filters.source} />
      </div>

      <div className="mb-8 space-y-4">
        <DateChipRail />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {categories.length > 0 && <CategoryChipRow categories={categories} />}
          <div className="flex flex-wrap items-center gap-2">
            {regions.length > 0 && (
              <SlugComboboxFilter
                items={regions}
                paramKey="region"
                allLabel="Alle regioner"
                searchPlaceholder="Søg efter region…"
                ariaLabel="Filtrér efter region"
              />
            )}
            {locations.length > 0 && (
              <SlugComboboxFilter
                items={locations}
                paramKey="location"
                allLabel="Alle lokationer"
                searchPlaceholder="Søg efter lokation…"
                ariaLabel="Filtrér efter lokation"
              />
            )}
          </div>
        </div>
      </div>

      {result.docs.length === 0 ? (
        <EmptyEventsMessage filters={filters} />
      ) : (
        <SeeYouThereGrid>
          {result.docs.map((event: Event) => {
            const likeIds = extractIds(event.likes)
            const liked = !!me && likeIds.includes(me.id)
            return (
              <EventCard
                key={event.id}
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
          })}
        </SeeYouThereGrid>
      )}

      {result.totalPages > 1 && result.page && (
        <QueryPagination page={result.page} totalPages={result.totalPages} />
      )}
    </div>
  )
}
