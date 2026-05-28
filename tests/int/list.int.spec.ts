import { parseAsString } from 'nuqs/server'
import type { CollectionSlug, Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { loadList, mergeFilterParsers, pickOneFilter } from '@/list'
import type { Filter } from '@/list'

// ---------------------------------------------------------------------------
// 1. mergeFilterParsers — the smallest unit. It just folds every filter's
//    `parsers` map into one big map. No nuqs, no Payload, no async.
// ---------------------------------------------------------------------------
describe('mergeFilterParsers', () => {
  // A throwaway Filter shape — read/toWhere are required by the type but
  // mergeFilterParsers never calls them, so they can be no-ops.
  const fakeFilter = (parsers: Record<string, unknown>): Filter =>
    ({
      parsers,
      read: () => null,
      toWhere: () => null,
    }) as unknown as Filter

  it('merges the parsers maps from every filter into one object', () => {
    const filters = {
      a: fakeFilter({ foo: 'parserA' }),
      b: fakeFilter({ bar: 'parserB', baz: 'parserC' }),
    }

    const merged = mergeFilterParsers(filters)

    expect(Object.keys(merged).sort()).toEqual(['bar', 'baz', 'foo'])
    expect(merged.foo).toBe('parserA')
  })
})

// ---------------------------------------------------------------------------
// 2. pickOneFilter — one of the four filter factories. Exercises read() and
//    toWhere() directly so you can see how a slug becomes a Payload where.
// ---------------------------------------------------------------------------
describe('pickOneFilter', () => {
  const filter = pickOneFilter({
    paramKey: 'region',
    collection: 'regions' as CollectionSlug,
    payloadPath: 'region',
  })

  it('read() returns null when the slug param is missing', () => {
    expect(filter.read({})).toBeNull()
  })

  it('read() returns the slug string when present in the URL', () => {
    expect(filter.read({ region: 'copenhagen' })).toBe('copenhagen')
  })

  it('toWhere() returns null when no slug is selected', () => {
    expect(filter.toWhere(null, [])).toBeNull()
  })

  it('toWhere() returns null when the slug does not match any option', () => {
    const options = [{ id: 1, slug: 'aarhus' }]
    expect(filter.toWhere('copenhagen', options)).toBeNull()
  })

  it('toWhere() resolves the slug to an id and builds a where clause', () => {
    const options = [
      { id: 1, slug: 'aarhus' },
      { id: 2, slug: 'copenhagen' },
    ]
    expect(filter.toWhere('copenhagen', options)).toEqual({
      region: { equals: 2 },
    })
  })
})

// ---------------------------------------------------------------------------
// 3. loadList — the orchestrator. We stub `payload.find` with vi.fn so no
//    database is touched, and assert that loadList wires URL → filters →
//    where-clause → payload.find correctly.
// ---------------------------------------------------------------------------
describe('loadList', () => {
  // A minimal Filter we can hand-roll for the test. Its parser is a real nuqs
  // ParserBuilder (loadList needs that), but read/toWhere are trivial.
  const stringFilter = (urlKey: string, payloadPath: string): Filter<string | null, unknown> => ({
    parsers: { [urlKey]: parseAsString.withDefault('') },
    read: (loaded) => ((loaded[urlKey] as string) || null),
    toWhere: (value) => (value ? { [payloadPath]: { equals: value } } : null),
  })

  it('combines every filter contribution into a single AND where clause', async () => {
    const findMock = vi.fn().mockResolvedValue({
      docs: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
    })
    const payload = { find: findMock } as unknown as Payload

    const { state, result } = await loadList({
      payload,
      searchParams: Promise.resolve({ tag: 'music', region: 'cph' }),
      filters: {
        tagF: stringFilter('tag', 'tag'),
        regionF: stringFilter('region', 'region'),
      },
      query: { collection: 'events' as CollectionSlug },
    })

    // state is keyed by filter name (not URL key)
    expect(state).toEqual({ tagF: 'music', regionF: 'cph' })

    // payload.find received the AND-combined where clause
    expect(findMock).toHaveBeenCalledTimes(1)
    expect(findMock.mock.calls[0][0]).toMatchObject({
      collection: 'events',
      overrideAccess: false,
      where: {
        and: [{ tag: { equals: 'music' } }, { region: { equals: 'cph' } }],
      },
    })

    expect(result.totalDocs).toBe(0)
  })

  it('passes where=undefined when no filter contributes', async () => {
    const findMock = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 })
    const payload = { find: findMock } as unknown as Payload

    await loadList({
      payload,
      searchParams: Promise.resolve({}),
      filters: { tagF: stringFilter('tag', 'tag') },
      query: { collection: 'events' as CollectionSlug },
    })

    expect(findMock.mock.calls[0][0].where).toBeUndefined()
  })

  it('runs each filter preload exactly once and passes the result into toWhere', async () => {
    const findMock = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 })
    const payload = { find: findMock } as unknown as Payload

    const preload = vi.fn().mockResolvedValue(['preloaded-data'])
    const toWhere = vi.fn().mockReturnValue(null)

    const filterWithPreload: Filter<string | null, string[]> = {
      parsers: { tag: parseAsString.withDefault('') },
      read: () => 'whatever',
      preload,
      toWhere,
    }

    await loadList({
      payload,
      searchParams: Promise.resolve({}),
      filters: { f: filterWithPreload },
      query: { collection: 'events' as CollectionSlug },
    })

    expect(preload).toHaveBeenCalledTimes(1)
    expect(preload).toHaveBeenCalledWith(payload)
    expect(toWhere).toHaveBeenCalledWith('whatever', ['preloaded-data'])
  })
})
