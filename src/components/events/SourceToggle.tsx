'use client'

import { useQueryStates } from 'nuqs'

import { eventsUrlParsers, type EventSource } from '@/components/events/filters/eventsFilters'
import { useFilterTransition } from '@/components/filters/FilterTransitionContext'
import { cn } from '@/utilities/ui'

const options: { value: EventSource; label: string; activeClass: string }[] = [
  {
    value: 'syt',
    label: 'See You There',
    activeClass: 'bg-brand-teal text-cream shadow-sm',
  },
  {
    value: 'community',
    label: 'Fællesskab',
    activeClass: 'bg-brand-mint text-cream shadow-sm',
  },
]

export const SourceToggle = ({ active }: { active: EventSource }) => {
  const { startTransition } = useFilterTransition()
  const [, setStates] = useQueryStates(
    {
      source: eventsUrlParsers.source,
      page: eventsUrlParsers.page,
    },
    { startTransition },
  )

  return (
    <div
      role="tablist"
      aria-label="Filtrér begivenheder efter kilde"
      className="inline-flex rounded-full border border-border bg-muted p-1"
    >
      {options.map(({ value, label, activeClass }) => {
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
              'cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition',
              isActive ? activeClass : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
