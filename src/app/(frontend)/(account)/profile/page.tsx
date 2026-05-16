import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { LikeButton } from '@/components/events/LikeButton'
import { RsvpButton } from '@/components/events/RsvpButton'
import type { Event } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const fullUser = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 1,
    joins: {
      attendingEvents: { limit: 50, sort: '-startDate' },
      likedEvents: { limit: 50, sort: '-startDate' },
    },
  })

  const attendingDocs = (fullUser.attendingEvents?.docs ?? []) as Event[]
  const likedDocs = (fullUser.likedEvents?.docs ?? []) as Event[]

  return (
    <div className="container max-w-2xl pt-24 pb-24">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-semibold">{user.name || user.email}</h1>
        <Link href="/profile/edit" className="underline text-sm">
          Edit profile
        </Link>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 mb-10">
        <dt className="text-sm text-muted-foreground">Email</dt>
        <dd>{user.email}</dd>
        {typeof user.age === 'number' && (
          <>
            <dt className="text-sm text-muted-foreground">Age</dt>
            <dd>{user.age}</dd>
          </>
        )}
        {(user.zipCode || user.city) && (
          <>
            <dt className="text-sm text-muted-foreground">From</dt>
            <dd>{[user.zipCode, user.city].filter(Boolean).join(' ')}</dd>
          </>
        )}
        {user.bio && (
          <>
            <dt className="text-sm text-muted-foreground">Bio</dt>
            <dd className="whitespace-pre-wrap">{user.bio}</dd>
          </>
        )}
      </dl>

      <h2 className="text-xl font-semibold mb-3">Events you&apos;re attending</h2>
      {attendingDocs.length === 0 ? (
        <p className="text-muted-foreground">You haven&apos;t RSVPed to anything yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {attendingDocs.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3">
              <Link href={`/events/${e.slug}`} className="underline">
                {e.title}
              </Link>
              <RsvpButton
                eventId={String(e.id)}
                initialAttending={true}
                loggedIn={true}
              />
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-10 mb-3">Events you&apos;ve liked</h2>
      {likedDocs.length === 0 ? (
        <p className="text-muted-foreground">No liked events yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {likedDocs.map((e) => {
            const count = Array.isArray(e.likes) ? e.likes.length : 0
            return (
              <li key={e.id} className="flex items-center justify-between gap-3">
                <Link href={`/events/${e.slug}`} className="underline">
                  {e.title}
                </Link>
                <LikeButton
                  eventId={String(e.id)}
                  initialLiked={true}
                  initialCount={count}
                  loggedIn={true}
                  showCount={false}
                />
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-10">
        <Link href="/logout" className="underline text-sm">
          Log out
        </Link>
      </div>
    </div>
  )
}
