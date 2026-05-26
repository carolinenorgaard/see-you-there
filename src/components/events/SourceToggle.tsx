'use client'

import { useQueryStates } from 'nuqs'

import { eventsFilterParsers, type EventSource } from '@/components/events/filters/eventsFilters'
import { cn } from '@/utilities/ui'

const options: { value: EventSource; label: string }[] = [
  { value: 'syt', label: 'See You There' },
  { value: 'community', label: 'Community' },
]

export const SourceToggle = ({ active }: { active: EventSource }) => {
  const [, setStates] = useQueryStates({
    source: eventsFilterParsers.source,
    page: eventsFilterParsers.page,
  })

  return (
    <div
      role="tablist"
      aria-label="Filtrér begivenheder efter kilde"
      className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 p-1"
    >
      {options.map(({ value, label }) => {
        const isActive = value === active
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              void setStates({ source: value, page: null })
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              isActive
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
