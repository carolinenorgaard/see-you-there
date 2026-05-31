import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, description, image, meta } = originalDoc

  const imageId = (value: unknown): string | number | undefined => {
    if (!value) return undefined
    if (typeof value === 'object') return (value as { id?: string | number }).id
    return value as string | number
  }

  let city: string | undefined
  let street: string | undefined
  let eventLocationImageId: string | number | undefined

  if (collection === 'locations') {
    city = originalDoc.address?.city
    street = originalDoc.address?.street
  } else if (collection === 'events') {
    const loc = originalDoc.location
    if (loc && typeof loc === 'object') {
      city = loc.address?.city
      street = loc.address?.street
      eventLocationImageId = imageId(loc.image)
    } else if (loc) {
      const locationDoc = await req.payload.findByID({
        collection: 'locations',
        id: loc,
        disableErrors: true,
        depth: 0,
        select: { address: true, image: true },
        req,
      })
      if (locationDoc) {
        city = locationDoc.address?.city
        street = locationDoc.address?.street
        eventLocationImageId = imageId(locationDoc.image)
      }
    }
  }

  const metaForSync =
    collection === 'posts'
      ? {
          ...meta,
          title: meta?.title || title,
          image: imageId(meta?.image) ?? meta?.image,
          description: meta?.description,
        }
      : {
          title,
          description,
          image:
            collection === 'events'
              ? imageId(image) ?? eventLocationImageId
              : imageId(image),
        }

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: metaForSync,
    city,
    street,
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}
