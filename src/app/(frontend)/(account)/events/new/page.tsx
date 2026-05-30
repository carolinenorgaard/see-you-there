import { NewEventFormServer } from '@/components/events/NewEventFormServer'
import { getMeUser } from '@/utilities/getMeUser'

export const dynamic = 'force-dynamic'

export default async function NewEventPage() {
  await getMeUser({ nullUserRedirect: '/login' })

  return (
    <div className="container max-w-2xl pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-6">Opret en begivenhed</h1>
      <p className="text-muted-foreground mb-8">
        Del noget, du selv afholder eller har kendskab til. Det vises under fanen Fællesskab på
        begivenhedssiden.
      </p>
      <NewEventFormServer />
    </div>
  )
}
