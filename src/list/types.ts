import type { Payload, Where } from 'payload'

// A nuqs ParserBuilder. We don't constrain T because the filter factories
// handle concrete typing; loadList only needs to merge parser maps.
export type AnyParser = unknown

export type FilterUrlParsers = Record<string, AnyParser>

export type SlugItem = { id: string | number; slug?: string | null }

// A Filter is one axis of narrowing on a List. It owns its URL parser
// entries, how to read its parsed values out of the merged loader result,
// an optional preload (option collection, current user, or any other
// per-request context), and the Payload Where contribution.
export type Filter<
  TState = unknown,
  TOptions = unknown,
  TParsers extends FilterUrlParsers = FilterUrlParsers,
> = {
  parsers: TParsers
  read: (loaded: Record<string, unknown>) => TState
  preload?: (payload: Payload) => Promise<TOptions>
  toWhere: (state: TState, options: TOptions) => Where | null
}

export type FiltersRecord = Record<string, Filter<any, any, any>>

export type StateOf<F extends FiltersRecord> = {
  [K in keyof F]: F[K] extends Filter<infer S, any, any> ? S : never
}

export type OptionsOf<F extends FiltersRecord> = {
  [K in keyof F]: F[K] extends Filter<any, infer O, any> ? O : never
}

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never

export type ParsersOf<F extends FiltersRecord> = UnionToIntersection<F[keyof F]['parsers']>

// Merge every Filter's URL parsers into one map suitable for nuqs createLoader
// (server) or useQueryStates (client). loadList uses this internally; pages
// can also re-export the merged map for client components that pick a subset.
export const mergeFilterParsers = <F extends FiltersRecord>(filters: F): ParsersOf<F> =>
  Object.values(filters).reduce<FilterUrlParsers>(
    (acc, f) => Object.assign(acc, f.parsers),
    {},
  ) as ParsersOf<F>
