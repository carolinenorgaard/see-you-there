'use client'

import { useQueryStates } from 'nuqs'

import { useFilterTransition } from '@/components/filters/FilterTransitionContext'
import { COPENHAGEN_TZ, cphIsoDay, nextIsoDay } from '@/utilities/formatDateTime'
import { togglePillClasses } from '@/utilities/togglePillClasses'
import { cn } from '@/utilities/ui'
import { eventsUrlParsers } from './eventsFilters'

const DAYS_AHEAD = 14

type Chip = { iso: string; weekday: string; day: number; label?: string }

const buildDateRailChips = (): Chip[] => {
  let iso = cphIsoDay(new Date())
  const chips: Chip[] = []
  for (let i = 0; i < DAYS_AHEAD; i++) {
    // Midday UTC keeps the weekday label stable across DST transitions in Copenhagen.
    const d = new Date(`${iso}T12:00:00Z`)
    chips.push({
      iso,
      weekday: d.toLocaleDateString('da-DK', {
        weekday: 'short',
        timeZone: COPENHAGEN_TZ,
      }),
      day: Number(iso.slice(8, 10)),
      label: i === 0 ? 'I dag' : undefined,
    })
    iso = nextIsoDay(iso)
  }
  return chips
}

export const DateChipRail = () => {
  const { startTransition } = useFilterTransition()
  const [{ date: rawDate }, setStates] = useQueryStates(
    {
      date: eventsUrlParsers.date,
      page: eventsUrlParsers.page,
    },
    { startTransition },
  )
  const setDate = (value: string | null) => setStates({ date: value, page: null })
  const activeDate = rawDate || null
  const chips = buildDateRailChips()

  return (
    <div className="scrollbar-pretty -mx-2 flex gap-2 overflow-x-auto px-2 pt-1 pb-3">
      <button
        type="button"
        onClick={() => setDate(null)}
        aria-pressed={!activeDate}
        className={cn(
          'flex h-14 shrink-0 cursor-pointer items-center rounded-full border px-4 text-xs font-semibold transition',
          togglePillClasses(!activeDate),
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
              'flex h-14 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-full border text-[10px] font-semibold uppercase tracking-wide transition',
              togglePillClasses(isActive),
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
