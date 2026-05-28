import { parseAsString } from 'nuqs/server'
import type { Where } from 'payload'

import { serverSyncOptions } from '@/components/filters/sharedFilterParsers'
import { nextIsoDay } from '@/utilities/formatDateTime'

import type { Filter } from './types'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// A Filter for a single day (YYYY-MM-DD). Contributes a half-open day
// window at the given Payload path (e.g. 'startDate'): greater_than_equal
// day-start, less_than next-day-start.
export const dayFilter = <K extends string>(args: {
  paramKey: K
  payloadPath: string
}) => {
  const parser = parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true })

  return {
    parsers: { [args.paramKey]: parser } as Record<K, typeof parser>,
    read: (loaded: Record<string, unknown>): string | null => {
      const raw = (loaded[args.paramKey] as string | undefined) ?? ''
      return raw && ISO_DATE.test(raw) ? raw : null
    },
    toWhere: (day: string | null): Where | null => {
      if (!day) return null
      return {
        [args.payloadPath]: {
          greater_than_equal: `${day}T00:00:00.000Z`,
          less_than: `${nextIsoDay(day)}T00:00:00.000Z`,
        },
      }
    },
  } satisfies Filter<string | null, undefined, Record<K, typeof parser>>
}
