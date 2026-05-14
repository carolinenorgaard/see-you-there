import configPromise from '@payload-config'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
import type { Event, Location } from '@/payload-types'

export const dynamic = 'force-dynamic'

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : ''
const formatTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })

  const event = result.docs[0] as Event | undefined
  if (!event) notFound()

  const location =
    typeof event.location === 'object' && event.location !== null
      ? (event.location as Location)
      : null

  return (
    <div className="container pt-24 pb-24">
      <SeeYouThereCard aspect="aspect-[16/7]" className="mb-10">
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-pink-600">Event</Badge>
          </SeeYouThereCardBadges>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle className="text-3xl md:text-5xl">
              {event.title}
            </SeeYouThereCardTitle>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
              {location && (
                <SeeYouThereCardMeta>
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <Link
                    href={`/locations/${location.slug}`}
                    className="hover:underline"
                  >
                    {location.title}
                  </Link>
                </SeeYouThereCardMeta>
              )}
              <SeeYouThereCardMeta>
                <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  {formatDate(event.startDate)} – {formatDate(event.endDate)}
                </span>
              </SeeYouThereCardMeta>
              <SeeYouThereCardMeta>
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </span>
              </SeeYouThereCardMeta>
            </div>
          </SeeYouThereCardBody>
        </SeeYouThereCardFooter>
      </SeeYouThereCard>

      {event.description && (
        <div className="prose max-w-3xl">
          <p>{event.description}</p>
        </div>
      )}
    </div>
  )
}
