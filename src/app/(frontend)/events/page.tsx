import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { EmptyEventsMessage } from '@/components/events/EmptyEventsMessage'
import { EventCard } from '@/components/events/EventCard'
import { LikeButton } from '@/components/events/LikeButton'
import { SourceToggle } from '@/components/events/SourceToggle'
import { DateChipRail } from '@/components/events/filters/DateChipRail'
import {
  buildEventsWhere,
  loadEventsFilters,
  normalizeEventsFilters,
} from '@/components/events/filters/eventsFilters'
import { CategoryChipRow } from '@/components/filters/CategoryChipRow'
import { SlugComboboxFilter } from '@/components/filters/SlugComboboxFilter'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import type { Category, Event, Location, Region } from '@/payload-types'
import { extractIds } from '@/utilities/extractIds'
import { getOptionalMe } from '@/utilities/getOptionalMe'

const PAGE_SIZE = 24

export const dynamic = 'force-dynamic'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawFilters = await loadEventsFilters(searchParams)
  const filters = normalizeEventsFilters(rawFilters)
  const page = Math.max(1, rawFilters.page)

  const payload = await getPayload({ config: configPromise })

  const [me, categoriesRes, regionsRes, locationsRes] = await Promise.all([
    getOptionalMe(),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'regions',
      depth: 0,
      limit: 200,
      overrideAccess: false,
      sort: 'title',
    }),
    payload.find({
      collection: 'locations',
      depth: 0,
      limit: 500,
      overrideAccess: false,
      sort: 'title',
      select: { title: true, slug: true },
    }),
  ])

  const categories = categoriesRes.docs as Category[]
  const regions = regionsRes.docs as Region[]
  const locations = locationsRes.docs as Location[]

  const events = await payload.find({
    collection: 'events',
    depth: 2,
    limit: PAGE_SIZE,
    page,
    overrideAccess: false,
    sort: 'startDate',
    where: buildEventsWhere(filters, { categories, regions, locations }),
  })

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

      {events.docs.length === 0 ? (
        <EmptyEventsMessage filters={filters} />
      ) : (
        <SeeYouThereGrid>
          {events.docs.map((event: Event) => {
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

      {events.totalPages > 1 && events.page && (
        <QueryPagination page={events.page} totalPages={events.totalPages} />
      )}
    </div>
  )
}
