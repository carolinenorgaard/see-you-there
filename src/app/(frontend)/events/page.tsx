import configPromise from '@payload-config'
import { CalendarDays, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Badge } from '@/components/ui/badge'
import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardMeta,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '@/components/SeeYouThereCard'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import type { Category, Event, Location } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { categoryColorClass } from '@/utilities/categoryColor'

export const dynamic = 'force-dynamic'

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString() : '')
const formatTime = (value?: string | null) =>
  value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

type EventSource = 'syt' | 'community'

const isSource = (value: unknown): value is EventSource =>
  value === 'syt' || value === 'community'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>
}) {
  const { source: rawSource } = await searchParams
  const source: EventSource = isSource(rawSource) ? rawSource : 'syt'

  const payload = await getPayload({ config: configPromise })

  const events = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    where: {
      createdBySeeYouThere: { equals: source === 'syt' },
    },
  })

  return (
    <div className="container pt-24 pb-24">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Event Wall</h1>
        <SourceToggle active={source} />
      </div>

      {events.docs.length === 0 ? (
        <p>
          {source === 'syt'
            ? 'No See You There events yet.'
            : 'No community events yet.'}
        </p>
      ) : (
        <SeeYouThereGrid>
          {events.docs.map((event: Event) => {
            const location =
              typeof event.location === 'object' && event.location !== null
                ? (event.location as Location)
                : null
            const categories = (event.categories ?? []).filter(
              (c): c is Category => typeof c === 'object' && c !== null,
            )
            return (
              <SeeYouThereCard key={event.id} href={`/events/${event.slug}`}>
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
            )
          })}
        </SeeYouThereGrid>
      )}
    </div>
  )
}

const SourceToggle = ({ active }: { active: EventSource }) => {
  const options: { value: EventSource; label: string }[] = [
    { value: 'syt', label: 'See You There' },
    { value: 'community', label: 'Community' },
  ]
  return (
    <div
      role="tablist"
      aria-label="Filter events by source"
      className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 p-1"
    >
      {options.map((opt) => {
        const isActive = opt.value === active
        return (
          <Link
            key={opt.value}
            href={`/events?source=${opt.value}`}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              isActive
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900',
            )}
          >
            {opt.label}
          </Link>
        )
      })}
    </div>
  )
}
