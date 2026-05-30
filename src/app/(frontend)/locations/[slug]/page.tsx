import configPromise from '@payload-config'
import { CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { NewEventFormServer } from '@/components/events/NewEventFormServer'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Event, Location, Media } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { formatDate, formatTime } from '@/utilities/formatDateTime'
import { getOptionalMe } from '@/utilities/getOptionalMe'
import { populated } from '@/utilities/payloadRelations'

export const dynamic = 'force-dynamic'

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
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

  const events = ((location.events?.docs ?? []) as Event[])
    .slice()
    .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
  const heroImage = populated<Media>(location.image)

  const user = await getOptionalMe()

  return (
    <div className="container pt-24 pb-24">
      <SeeYouThereCard aspect="aspect-[16/7]" className="mb-10">
        {heroImage?.url && (
          <SeeYouThereCardImage src={heroImage.url} alt={heroImage.alt ?? location.title} />
        )}
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color={categoryColorClass('teal')}>Lokation</Badge>
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

      <h2 className="text-2xl font-semibold mb-4">Begivenheder på {location.title}</h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground">Ingen begivenheder endnu.</p>
      ) : (
        <SeeYouThereGrid>
          {events.map((event) => {
            const eventImage = populated<Media>(event.image) ?? heroImage
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

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-2">Opret en begivenhed på {location.title}</h2>
        <p className="text-muted-foreground mb-6">
          Del noget, du selv afholder eller har kendskab til. Det vises under fanen Fællesskab på
          begivenhedssiden.
        </p>
        {user ? (
          <NewEventFormServer
            locations={[{ id: String(location.id), title: location.title }]}
            lockLocation
          />
        ) : (
          <div className="border rounded p-6 bg-muted/30">
            <p className="mb-4">Du skal være logget ind for at indsende en begivenhed.</p>
            <Button asChild>
              <Link href={`/login?redirect=${encodeURIComponent(`/locations/${slug}`)}`}>
                Log ind for at oprette en begivenhed
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
