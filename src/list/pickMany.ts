import type { CollectionSlug, Payload, Where } from 'payload'

import {
  categoriesParser,
  normalizeCategorySlugs,
  resolveIdsBySlug,
} from '@/components/filters/sharedFilterParsers'

import type { Filter, SlugItem } from './types'

// A Filter where the user picks several items from an option collection.
// The URL holds an array of slugs; the filter resolves them to ids and
// contributes { [payloadPath]: { in: ids } }.
export const pickManyFilter = <T extends SlugItem = SlugItem, K extends string = string>(args: {
  paramKey: K
  collection: CollectionSlug
  payloadPath: string
  limit?: number
  sort?: string
  select?: Record<string, true>
}) => {
  return {
    parsers: { [args.paramKey]: categoriesParser } as Record<K, typeof categoriesParser>,
    read: (loaded: Record<string, unknown>): string[] => {
      const raw = (loaded[args.paramKey] as string[] | undefined) ?? []
      return normalizeCategorySlugs(raw)
    },
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
    toWhere: (slugs: string[], options: T[]): Where | null => {
      if (slugs.length === 0) return null
      const ids = resolveIdsBySlug(slugs, options)
      if (ids.length === 0) return null
      return { [args.payloadPath]: { in: ids } }
    },
  } satisfies Filter<string[], T[], Record<K, typeof categoriesParser>>
}
