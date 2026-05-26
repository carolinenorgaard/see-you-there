import configPromise from '@payload-config'
import { CalendarDays, Mail, MapPin, Pencil } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { EventCard } from '@/components/events/EventCard'
import { LikeButton } from '@/components/events/LikeButton'
import { RsvpButton } from '@/components/events/RsvpButton'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Event } from '@/payload-types'
import { extractIds } from '@/utilities/extractIds'
import { getMeUser } from '@/utilities/getMeUser'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const [attendingRes, likedRes] = await Promise.all([
    payload.find({
      collection: 'events',
      depth: 2,
      limit: 50,
      sort: '-startDate',
      overrideAccess: false,
      where: { attendees: { equals: user.id } },
    }),
    payload.find({
      collection: 'events',
      depth: 2,
      limit: 50,
      sort: '-startDate',
      overrideAccess: false,
      where: { likes: { equals: user.id } },
    }),
  ])

  const attendingDocs = attendingRes.docs as Event[]
  const likedDocs = likedRes.docs as Event[]

  const displayName = user.name || user.email
  const initials =
    displayName
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'

  return (
    <div className="container max-w-6xl pt-24 pb-24 space-y-16">
      <Card className="overflow-hidden border-0 bg-neutral-900 text-white shadow-lg">
        <CardContent className="relative p-8 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-6">
              <div
                aria-hidden
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold tracking-wide ring-1 ring-white/20"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{displayName}</h1>
                <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" aria-hidden />
                    <span>{user.email}</span>
                  </li>
                  {(user.zipCode || user.city) && (
                    <li className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" aria-hidden />
                      <span>{[user.zipCode, user.city].filter(Boolean).join(' ')}</span>
                    </li>
                  )}
                  {typeof user.age === 'number' && (
                    <li className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" aria-hidden />
                      <span>{user.age} år</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                asChild
                variant="secondary"
                className="bg-white text-neutral-900 hover:bg-white/90"
              >
                <Link href="/profile/edit">
                  <Pencil className="h-4 w-4" aria-hidden />
                  Rediger profil
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/logout">Log ud</Link>
              </Button>
            </div>
          </div>

          {user.bio && (
            <p className="mt-8 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-white/90">
              {user.bio}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-6 text-sm">
            <div>
              <div className="text-2xl font-semibold">{attendingDocs.length}</div>
              <div className="text-white/70">Deltager i</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{likedDocs.length}</div>
              <div className="text-white/70">Likede</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileEventsSection
        title="Begivenheder du deltager i"
        emptyMessage="Du har endnu ikke tilmeldt dig nogen begivenheder."
        events={attendingDocs}
        renderAction={(event) => (
          <RsvpButton
            eventId={String(event.id)}
            initialAttending={true}
            loggedIn={true}
            iconOnly
          />
        )}
      />

      <ProfileEventsSection
        title="Begivenheder du har liket"
        emptyMessage="Ingen likede begivenheder endnu."
        events={likedDocs}
        renderAction={(event) => (
          <LikeButton
            eventId={String(event.id)}
            initialLiked={true}
            initialCount={extractIds(event.likes).length}
            loggedIn={true}
            showCount={false}
            iconOnly
          />
        )}
      />
    </div>
  )
}

function ProfileEventsSection({
  title,
  emptyMessage,
  events,
  renderAction,
}: {
  title: string
  emptyMessage: string
  events: Event[]
  renderAction: (event: Event) => React.ReactNode
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {events.length > 0 && (
          <span className="text-sm text-muted-foreground">{events.length}</span>
        )}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      ) : (
        <SeeYouThereGrid>
          {events.map((event) => (
            <EventCard key={event.id} event={event} action={renderAction(event)} />
          ))}
        </SeeYouThereGrid>
      )}
    </section>
  )
}
