import { createLoader } from 'nuqs/server'
import type { CollectionSlug, PaginatedDocs, Payload, Where } from 'payload'

import { mergeFilterParsers } from './types'
import type { FiltersRecord, OptionsOf, StateOf } from './types'

type LoadListArgs<F extends FiltersRecord, TCollection extends CollectionSlug> = {
  payload: Payload
  searchParams: Promise<Record<string, string | string[] | undefined>>
  filters: F
  query: {
    collection: TCollection
    depth?: number
    sort?: string
    limit?: number
    page?: number
  }
}

export type LoadListResult<F extends FiltersRecord, T> = {
  result: PaginatedDocs<T>
  state: StateOf<F>
  options: OptionsOf<F>
}

export async function loadList<
  F extends FiltersRecord,
  TCollection extends CollectionSlug,
  T = unknown,
>({
  payload,
  searchParams,
  filters,
  query,
}: LoadListArgs<F, TCollection>): Promise<LoadListResult<F, T>> {
  const entries = Object.entries(filters)

  // nuqs createLoader is typed against a concrete parser-map literal; the
  // merged map from dynamic Filters is structurally compatible but its keys
  // can't be inferred at this site, hence the cast.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const load = createLoader(mergeFilterParsers(filters) as any)

  // URL parsing and preloads are independent — run them concurrently.
  const [loaded, optionValues] = await Promise.all([
    load(searchParams) as Promise<Record<string, unknown>>,
    Promise.all(
      entries.map(([, f]) => (f.preload ? f.preload(payload) : Promise.resolve(undefined))),
    ),
  ])

  const state = {} as StateOf<F>
  const options = {} as OptionsOf<F>
  const whereClauses: Where[] = []

  entries.forEach(([name, f], i) => {
    const parsed = f.read(loaded)
    const opts = optionValues[i]
    ;(state as Record<string, unknown>)[name] = parsed
    ;(options as Record<string, unknown>)[name] = opts
    const contribution = f.toWhere(parsed, opts)
    if (contribution) whereClauses.push(contribution)
  })

  const where: Where | undefined =
    whereClauses.length === 0
      ? undefined
      : whereClauses.length === 1
        ? whereClauses[0]
        : { and: whereClauses }

  const result = (await payload.find({
    ...query,
    overrideAccess: false,
    where,
  })) as PaginatedDocs<T>

  return { result, state, options }
}
