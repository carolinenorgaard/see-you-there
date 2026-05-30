import { createLoader } from 'nuqs/server'
import type { CollectionSlug, PaginatedDocs, Payload, Where } from 'payload'

import { mergeFilterParsers } from './types'
import type { FiltersRecord, OptionsOf, FiltersOf } from './types'

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
  filters: FiltersOf<F>
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
  const load = createLoader(mergeFilterParsers(filters))

  // URL parsing and preloads are independent — run them concurrently.
  const [loaded, optionValues] = await Promise.all([
    load(searchParams),
    Promise.all(
      entries.map(([, f]) => (f.preload ? f.preload(payload) : Promise.resolve(undefined))),
    ),
  ])

  const parsed = {} as FiltersOf<F>
  const options = {} as OptionsOf<F>
  const whereClauses: Where[] = []

  entries.forEach(([name, f], i) => {
    const value = f.read(loaded)
    const opts = optionValues[i]
    ;(parsed as Record<string, unknown>)[name] = value
    ;(options as Record<string, unknown>)[name] = opts
    const contribution = f.toWhere(value, opts)
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

  return { result, filters: parsed, options }
}
