'use client'

import { useQueryState } from 'nuqs'

import { toIsoDay } from '@/utilities/formatDateTime'
import { cn } from '@/utilities/ui'
import { eventsFilterParsers } from './eventsFilters'

const DAYS_AHEAD = 14

type Chip = { iso: string; weekday: string; day: number; label?: string }

const chipState = (isActive: boolean) =>
  isActive
    ? 'border-neutral-900 bg-neutral-900 text-white'
    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'

const buildDateRailChips = (): Chip[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const chips: Chip[] = []
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    chips.push({
      iso: toIsoDay(d),
      weekday: d.toLocaleDateString('da-DK', { weekday: 'short' }),
      day: d.getDate(),
      label: i === 0 ? 'I dag' : undefined,
    })
  }
  return chips
}

export const DateChipRail = () => {
  const [rawDate, setDate] = useQueryState('date', eventsFilterParsers.date)
  const activeDate = rawDate || null
  const chips = buildDateRailChips()

  return (
    <div className="-mx-2 flex gap-2 overflow-x-auto px-2 py-1">
      <button
        type="button"
        onClick={() => setDate(null)}
        aria-pressed={!activeDate}
        className={cn(
          'flex h-14 shrink-0 items-center rounded-full border px-4 text-xs font-semibold transition',
          chipState(!activeDate),
        )}
      >
        Alle
      </button>
      {chips.map((chip) => {
        const isActive = activeDate === chip.iso
        return (
          <button
            key={chip.iso}
            type="button"
            onClick={() => setDate(isActive ? null : chip.iso)}
            aria-pressed={isActive}
            className={cn(
              'flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border text-[10px] font-semibold uppercase tracking-wide transition',
              isActive
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400',
            )}
            title={chip.label ?? `${chip.weekday} ${chip.day}`}
          >
            <span className="text-[9px] leading-none">{chip.label ?? chip.weekday}</span>
            <span className="mt-0.5 text-base leading-none font-bold">{chip.day}</span>
          </button>
        )
      })}
    </div>
  )
}
