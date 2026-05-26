import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { LikeButton } from '@/components/events/LikeButton'
import { RsvpButton } from '@/components/events/RsvpButton'
import { ProfileEventsSection } from '@/components/profile/ProfileEventsSection'
import { ProfileHero } from '@/components/profile/ProfileHero'
import type { Event } from '@/payload-types'
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

  return (
    <div className="container max-w-6xl pt-24 pb-24 space-y-16">
      <ProfileHero
        user={user}
        attendingCount={attendingRes.totalDocs}
        likedCount={likedRes.totalDocs}
      />

      <ProfileEventsSection
        title="Begivenheder du deltager i"
        emptyMessage="Du har endnu ikke tilmeldt dig nogen begivenheder."
        events={attendingDocs}
        renderAction={(event) => (
          <RsvpButton
            eventId={event.id}
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
            eventId={event.id}
            initialLiked={true}
            initialCount={event.likes?.length ?? 0}
            loggedIn={true}
            showCount={false}
            iconOnly
          />
        )}
      />
    </div>
  )
}
