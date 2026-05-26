import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Location } from '../../payload-types'

export const revalidateLocation: CollectionAfterChangeHook<Location> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/locations/${doc.slug}`

    payload.logger.info(`Revalidating location at path: ${path}`)

    revalidatePath(path)
    revalidateTag('locations-sitemap', 'max')

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/locations/${previousDoc.slug}`
      revalidatePath(oldPath)
    }
  }
  return doc
}

export const revalidateLocationDelete: CollectionAfterDeleteHook<Location> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/locations/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('locations-sitemap', 'max')
  }

  return doc
}
