import { parseAsString } from 'nuqs/server'
import type { Where } from 'payload'

import { serverSyncOptions } from '@/components/filters/sharedFilterParsers'
import { nextIsoDay } from '@/utilities/formatDateTime'

import type { Filter } from './types'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// A Filter for a single day (YYYY-MM-DD). Contributes a half-open day
// window at the given Payload path (e.g. 'startDate'): greater_than_equal
// day-start, less_than next-day-start.
export const dayFilter = (args: {
  paramKey: string
  payloadPath: string
}): Filter<string | null, undefined> => {
  const parser = parseAsString
    .withDefault('')
    .withOptions({ ...serverSyncOptions, clearOnDefault: true })

  return {
    parsers: { [args.paramKey]: parser },
    read: (loaded) => {
      const raw = (loaded[args.paramKey] as string | undefined) ?? ''
      if (!raw || !ISO_DATE.test(raw)) return null
      // Round-trip rejects shape-valid but calendar-invalid dates like
      // 2026-99-99 (would crash nextIsoDay) or 2026-02-30 (normalized).
      const d = new Date(`${raw}T00:00:00.000Z`)
      if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== raw) return null
      return raw
    },
    toWhere: (day): Where | null => {
      if (!day) return null
      return {
        [args.payloadPath]: {
          greater_than_equal: `${day}T00:00:00.000Z`,
          less_than: `${nextIsoDay(day)}T00:00:00.000Z`,
        },
      }
    },
  }
}
