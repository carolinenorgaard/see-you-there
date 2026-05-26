import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/events/${doc.slug}`

    payload.logger.info(`Revalidating event at path: ${path}`)

    revalidatePath(path)
    revalidateTag('events-sitemap', 'max')

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/events/${previousDoc.slug}`
      revalidatePath(oldPath)
    }
  }
  return doc
}

export const revalidateEventDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/events/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('events-sitemap', 'max')
  }

  return doc
}
