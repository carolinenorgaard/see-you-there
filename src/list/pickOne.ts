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
export const pickOneFilter = <T extends SlugItem = SlugItem, K extends string = string>(args: {
  paramKey: K
  collection: CollectionSlug
  payloadPath: string
  // Limit on docs preloaded from the option collection (default 200).
  limit?: number
  sort?: string
  select?: Record<string, true>
}) => {
  const parser = parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true })

  return {
    parsers: { [args.paramKey]: parser } as Record<K, typeof parser>,
    read: (loaded: Record<string, unknown>): string | null =>
      normalizeSlug((loaded[args.paramKey] as string | undefined) ?? ''),
    preload: async (payload: Payload): Promise<T[]> => {
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
    toWhere: (slug: string | null, options: T[]): Where | null => {
      if (!slug) return null
      const id = resolveIdBySlug(slug, options)
      if (id === null) return null
      return { [args.payloadPath]: { equals: id } }
    },
  } satisfies Filter<string | null, T[], Record<K, typeof parser>>
}
