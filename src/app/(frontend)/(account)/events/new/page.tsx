import { NewEventFormServer } from '@/components/events/NewEventFormServer'
import { getMeUser } from '@/utilities/getMeUser'

export const dynamic = 'force-dynamic'

export default async function NewEventPage() {
  await getMeUser({ nullUserRedirect: '/login' })

  return (
    <div className="container max-w-2xl pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Submit an event</h1>
      <p className="text-muted-foreground mb-8">
        Share something you&apos;re hosting or know about. It will appear under the Community tab on
        the events page.
      </p>
      <NewEventFormServer />
    </div>
  )
}
