import type { Payload, Where } from 'payload'

export type SlugItem = { id: string | number; slug?: string | null }

// A Filter is one axis of narrowing on a List. It owns its URL parser
// entries, how to read its parsed values out of the merged loader result,
// an optional preload (option collection, current user, or any other
// per-request context), and the Payload Where contribution.
export type Filter<TState = unknown, TOptions = unknown> = {
  parsers: Record<string, any>
  read: (loaded: Record<string, unknown>) => TState
  preload?: (payload: Payload) => Promise<TOptions>
  toWhere: (state: TState, options: TOptions) => Where | null
}

export type FiltersRecord = Record<string, Filter<any, any>>

export type FiltersOf<F extends FiltersRecord> = {
  [K in keyof F]: F[K] extends Filter<infer S, any> ? S : never
}

export type OptionsOf<F extends FiltersRecord> = {
  [K in keyof F]: F[K] extends Filter<any, infer O> ? O : never
}

// Merge every Filter's URL parsers into one map for nuqs createLoader
// (server) or useQueryStates (client). loadList uses this internally; pages
// can also re-export the merged map for client components that pick a subset.
export const mergeFilterParsers = (filters: FiltersRecord): Record<string, any> =>
  Object.values(filters).reduce<Record<string, any>>(
    (acc, f) => Object.assign(acc, f.parsers),
    {},
  )
