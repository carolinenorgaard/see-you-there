import configPromise from '@payload-config'
import { CalendarDays } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { Badge } from '@/components/ui/badge'
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
import type { Event, Location, Media } from '@/payload-types'
import { formatDate, formatTime } from '@/utilities/formatDateTime'
import { populated } from '@/utilities/payloadRelations'

export const dynamic = 'force-dynamic'

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })

  const location = result.docs[0] as Location | undefined
  if (!location) notFound()

  const events = (location.events?.docs ?? []) as Event[]
  const heroImage = populated<Media>(location.image)

  return (
    <div className="container pt-24 pb-24">
      <SeeYouThereCard aspect="aspect-[16/7]" className="mb-10">
        {heroImage?.url && (
          <SeeYouThereCardImage src={heroImage.url} alt={heroImage.alt ?? location.title} />
        )}
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-teal-600">Location</Badge>
          </SeeYouThereCardBadges>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle className="text-3xl md:text-5xl">
              {location.title}
            </SeeYouThereCardTitle>
          </SeeYouThereCardBody>
        </SeeYouThereCardFooter>
      </SeeYouThereCard>

      {location.description && (
        <div className="prose max-w-3xl mb-10">
          <p>{location.description}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Events at {location.title}</h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground">No events yet.</p>
      ) : (
        <SeeYouThereGrid>
          {events.map((event) => {
            const eventImage = populated<Media>(event.image)
            return (
            <SeeYouThereCard key={event.id} href={`/events/${event.slug}`}>
              {eventImage?.url && (
                <SeeYouThereCardImage src={eventImage.url} alt={eventImage.alt ?? event.title} />
              )}
              <SeeYouThereCardOverlay intensity="soft" />
              <SeeYouThereCardFooter>
                <SeeYouThereCardBody>
                  <SeeYouThereCardTitle>{event.title}</SeeYouThereCardTitle>
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
