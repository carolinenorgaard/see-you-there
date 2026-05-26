import Link from 'next/link'

import type { EventSource } from '@/components/events/filters/eventsFilters'
import { cn } from '@/utilities/ui'

const options: { value: EventSource; label: string }[] = [
  { value: 'syt', label: 'See You There' },
  { value: 'community', label: 'Community' },
]

export const SourceToggle = ({ active }: { active: EventSource }) => (
  <div
    role="tablist"
    aria-label="Filtrér begivenheder efter kilde"
    className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 p-1"
  >
    {options.map(({ value, label }) => {
      const isActive = value === active
      return (
        <Link
          key={value}
          href={`/events?source=${value}`}
          role="tab"
          aria-selected={isActive}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition',
            isActive
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900',
          )}
        >
          {label}
        </Link>
      )
    })}
  </div>
)
