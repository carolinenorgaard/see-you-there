import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { NewEventForm } from './NewEventForm'

type Option = { id: string; title: string }

export async function NewEventFormServer({
  locations,
  lockLocation,
}: {
  locations?: Option[]
  lockLocation?: boolean
}) {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, locationsResult] = await Promise.all([
    payload.find({ collection: 'categories', depth: 0, limit: 200, sort: 'title' }),
    locations
      ? Promise.resolve(null)
      : payload.find({ collection: 'locations', depth: 0, limit: 200, sort: 'title' }),
  ])

  const locationOptions =
    locations ?? locationsResult!.docs.map((l) => ({ id: String(l.id), title: l.title }))

  return (
    <NewEventForm
      locations={locationOptions}
      categories={categoriesResult.docs.map((c) => ({ id: String(c.id), title: c.title }))}
      lockLocation={lockLocation}
    />
  )
}
