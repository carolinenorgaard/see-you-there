import { createLoader } from 'nuqs/server'
import type { CollectionSlug, PaginatedDocs, Payload, Where } from 'payload'

import { mergeFilterParsers } from './types'
import type { FiltersRecord, OptionsOf, FiltersOf } from './types'

type LoadFilteredListArgs<F extends FiltersRecord, TCollection extends CollectionSlug> = {
  payload: Payload
  searchParams: Promise<Record<string, string | string[] | undefined>>
  filters: F
  baseWhere?: Where
  query: {
    collection: TCollection
    depth?: number
    sort?: string
    limit?: number
    page?: number
  }
}

export type LoadFilteredListResult<F extends FiltersRecord, T> = {
  result: PaginatedDocs<T>
  filters: FiltersOf<F>
  options: OptionsOf<F>
}

export async function loadFilteredList<
  F extends FiltersRecord,
  TCollection extends CollectionSlug,
  T = unknown,
>({
  payload,
  searchParams,
  filters,
  baseWhere,
  query,
}: LoadFilteredListArgs<F, TCollection>): Promise<LoadFilteredListResult<F, T>> {
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

  const allClauses = baseWhere ? [baseWhere, ...whereClauses] : whereClauses
  const where: Where | undefined =
    allClauses.length === 0
      ? undefined
      : allClauses.length === 1
        ? allClauses[0]
        : { and: allClauses }

  const result = (await payload.find({
    ...query,
    overrideAccess: false,
    where,
  })) as PaginatedDocs<T>

  return { result, filters: parsed, options }
}
