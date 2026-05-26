import configPromise from '@payload-config'
import { CalendarDays, MapPin } from 'lucide-react'
import { getPayload } from 'payload'

import { EmptyEventsMessage } from '@/components/events/EmptyEventsMessage'
import { LikeButton } from '@/components/events/LikeButton'
import { SourceToggle } from '@/components/events/SourceToggle'
import { Badge } from '@/components/ui/badge'
import { DateChipRail } from '@/components/events/filters/DateChipRail'
import {
  buildEventsWhere,
  loadEventsFilters,
  normalizeEventsFilters,
} from '@/components/events/filters/eventsFilters'
import { CategoryChipRow } from '@/components/filters/CategoryChipRow'
import { RegionSelect } from '@/components/filters/RegionSelect'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardImage,
  SeeYouThereCardMeta,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '@/components/SeeYouThereCard'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import type { Category, Event, Location, Media, Region } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { extractIds } from '@/utilities/extractIds'
import { formatDate, formatTime } from '@/utilities/formatDateTime'
import { getOptionalMe } from '@/utilities/getOptionalMe'
import { populated, populatedList } from '@/utilities/payloadRelations'

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

  const [me, categoriesRes, regionsRes] = await Promise.all([
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
  ])

  const categories = categoriesRes.docs as Category[]
  const regions = regionsRes.docs as Region[]

  const events = await payload.find({
    collection: 'events',
    depth: 2,
    limit: PAGE_SIZE,
    page,
    overrideAccess: false,
    sort: 'startDate',
    where: buildEventsWhere(filters, { categories, regions }),
  })

  return (
    <div className="container pt-24 pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Begivenhedsvæg</h1>
        <SourceToggle active={filters.source} />
      </div>

      <div className="mb-8 space-y-4">
        <DateChipRail />
        <div className="flex flex-wrap items-center justify-between gap-4">
          {categories.length > 0 && <CategoryChipRow categories={categories} />}
          {regions.length > 0 && <RegionSelect regions={regions} />}
        </div>
      </div>

      {events.docs.length === 0 ? (
        <EmptyEventsMessage filters={filters} />
      ) : (
        <SeeYouThereGrid>
          {events.docs.map((event: Event) => {
            const location = populated<Location>(event.location)
            const categories = populatedList<Category>(event.categories)
            const image = populated<Media>(event.image) ?? populated<Media>(location?.image)
            const likeIds = extractIds(event.likes)
            const liked = !!me && likeIds.includes(me.id)
            return (
              <div key={event.id} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <LikeButton
                    eventId={String(event.id)}
                    initialLiked={liked}
                    initialCount={likeIds.length}
                    loggedIn={!!me}
                    showCount={false}
                  />
                </div>
                <SeeYouThereCard href={`/events/${event.slug}`}>
                  {image?.url && (
                    <SeeYouThereCardImage src={image.url} alt={image.alt ?? event.title} />
                  )}
                  <SeeYouThereCardOverlay intensity="soft" />
                  <SeeYouThereCardHeader>
                    <SeeYouThereCardBadges className="flex-wrap">
                      {categories.map((c) => (
                        <Badge key={c.id} color={categoryColorClass(c.color)}>
                          {c.title}
                        </Badge>
                      ))}
                    </SeeYouThereCardBadges>
                  </SeeYouThereCardHeader>
                  <SeeYouThereCardFooter>
                    <SeeYouThereCardBody>
                      <SeeYouThereCardTitle>{event.title}</SeeYouThereCardTitle>
                      {location && (
                        <SeeYouThereCardMeta>
                          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{location.title}</span>
                        </SeeYouThereCardMeta>
                      )}
                      <SeeYouThereCardMeta>
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        <span className="truncate">
                          {formatDate(event.startDate)} • {formatTime(event.startTime)}
                        </span>
                      </SeeYouThereCardMeta>
                    </SeeYouThereCardBody>
                  </SeeYouThereCardFooter>
                </SeeYouThereCard>
              </div>
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
