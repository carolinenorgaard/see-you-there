import { parseAsString } from 'nuqs/server'
import type { CollectionSlug, Payload, Where } from 'payload'

import {
  normalizeSlug,
  resolveIdBySlug,
  serverSyncOptions,
} from '@/components/filters/sharedFilterParsers'

import type { Filter, SlugItem } from './types'

// A Filter where the user picks one item from an option collection.
// The URL holds a single slug; the filter resolves it to an id and
// contributes { [payloadPath]: { equals: id } }.
export const pickOneFilter = <T extends SlugItem = SlugItem>(args: {
  paramKey: string
  collection: CollectionSlug
  payloadPath: string
  // Limit on docs preloaded from the option collection (default 200).
  limit?: number
  sort?: string
  select?: Record<string, true>
}): Filter<string | null, T[]> => {
  const parser = parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true })

  return {
    parsers: { [args.paramKey]: parser },
    read: (loaded) => normalizeSlug((loaded[args.paramKey] as string | undefined) ?? ''),
    preload: async (payload: Payload) => {
      const res = await payload.find({
        collection: args.collection,
        depth: 0,
        limit: args.limit ?? 200,
        overrideAccess: false,
        sort: args.sort,
        select: args.select,
      })
      return res.docs as unknown as T[]
    },
    toWhere: (slug, options): Where | null => {
      if (!slug) return null
      const id = resolveIdBySlug(slug, options)
      if (id === null) return null
      return { [args.payloadPath]: { equals: id } }
    },
  }
}
