import configPromise from '@payload-config'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { CommentForm } from '@/components/events/CommentForm'
import { LikeButton } from '@/components/events/LikeButton'
import { RsvpButton } from '@/components/events/RsvpButton'
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
import type { Event, EventComment, Location, User } from '@/payload-types'
import { extractIds } from '@/utilities/extractIds'
import { formatDate, formatTime } from '@/utilities/formatDateTime'
import { getOptionalMe } from '@/utilities/getOptionalMe'

export const dynamic = 'force-dynamic'

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

  const me: User | null = await getOptionalMe()

  const attendeeIds = extractIds(event.attendees)
  const attending = !!me && attendeeIds.includes(me.id)

  const likeIds = extractIds(event.likes)
  const liked = !!me && likeIds.includes(me.id)

  const commentsRes = await payload.find({
    collection: 'event-comments',
    where: { event: { equals: event.id } },
    sort: '-createdAt',
    depth: 1,
    limit: 50,
  })
  const comments = commentsRes.docs as EventComment[]

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

      <div className="mt-8 max-w-3xl flex items-center gap-3">
        <RsvpButton
          eventId={String(event.id)}
          initialAttending={attending}
          loggedIn={!!me}
        />
        <span className="text-sm text-muted-foreground">
          {attendeeIds.length} attending
        </span>
        <LikeButton
          eventId={String(event.id)}
          initialLiked={liked}
          initialCount={likeIds.length}
          loggedIn={!!me}
        />
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {me ? (
          <CommentForm eventId={String(event.id)} />
        ) : (
          <p className="mb-4">
            <Link href="/login" className="underline">Log in</Link> to comment.
          </p>
        )}
        <ul className="mt-6 flex flex-col gap-4">
          {comments.length === 0 && (
            <li className="text-muted-foreground">No comments yet.</li>
          )}
          {comments.map((c) => {
            const author =
              typeof c.author === 'object' && c.author !== null
                ? (c.author as User)
                : null
            return (
              <li key={c.id} className="border-t pt-3">
                <div className="text-sm text-muted-foreground mb-1">
                  {author?.name || author?.email || 'Someone'} ·{' '}
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </div>
                <p className="whitespace-pre-wrap">{c.content}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
