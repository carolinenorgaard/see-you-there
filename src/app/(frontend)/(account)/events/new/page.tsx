import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { NewEventForm } from '@/components/events/NewEventForm'
import { getMeUser } from '@/utilities/getMeUser'

export const dynamic = 'force-dynamic'

export default async function NewEventPage() {
  await getMeUser({ nullUserRedirect: '/login' })
  const payload = await getPayload({ config: configPromise })

  const [locations, categories] = await Promise.all([
    payload.find({ collection: 'locations', depth: 0, limit: 200, sort: 'title' }),
    payload.find({ collection: 'categories', depth: 0, limit: 200, sort: 'title' }),
  ])

  return (
    <div className="container max-w-2xl pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Submit an event</h1>
      <p className="text-muted-foreground mb-8">
        Share something you&apos;re hosting or know about. It will appear under the Community tab on
        the events page.
      </p>
      <NewEventForm
        locations={locations.docs.map((l) => ({ id: String(l.id), title: l.title }))}
        categories={categories.docs.map((c) => ({ id: String(c.id), title: c.title }))}
      />
    </div>
  )
}
