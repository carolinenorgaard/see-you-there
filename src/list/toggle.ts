import { parseAsStringLiteral } from 'nuqs/server'
import type { Where } from 'payload'

import { serverSyncOptions } from '@/components/filters/sharedFilterParsers'

import type { Filter } from './types'

// A Filter that toggles between string-literal URL values and always
// contributes a boolean Where clause at the given path. The clause is
// emitted even at the default value (the URL just clears the param).
//
// Example for the Events 'source' toggle:
//   toggleFilter({
//     paramKey: 'source',
//     values: ['syt', 'community'],
//     defaultValue: 'syt',
//     payloadPath: 'createdBySeeYouThere',
//     trueWhen: 'syt',
//   })
export const toggleFilter = <K extends string, V extends string>(args: {
  paramKey: K
  values: readonly V[]
  defaultValue: V
  payloadPath: string
  trueWhen: V
}) => {
  const parser = parseAsStringLiteral(args.values)
    .withDefault(args.defaultValue)
    .withOptions({ ...serverSyncOptions, clearOnDefault: true })

  return {
    parsers: { [args.paramKey]: parser } as Record<K, typeof parser>,
    read: (loaded: Record<string, unknown>): V =>
      (loaded[args.paramKey] as V | undefined) ?? args.defaultValue,
    toWhere: (value: V): Where => ({
      [args.payloadPath]: { equals: value === args.trueWhen },
    }),
  } satisfies Filter<V, undefined, Record<K, typeof parser>>
}
