'use client'

import { useQueryStates } from 'nuqs'
import { X } from 'lucide-react'

import { useFilterTransition } from '@/components/filters/FilterTransitionContext'
import { cn } from '@/utilities/ui'
import { eventsUrlParsers } from './eventsFilters'

const PARSERS = {
  date: eventsUrlParsers.date,
  categories: eventsUrlParsers.categories,
  region: eventsUrlParsers.region,
  location: eventsUrlParsers.location,
  page: eventsUrlParsers.page,
}

export const EventsClearFiltersButton = ({ className }: { className?: string }) => {
  const { startTransition } = useFilterTransition()
  const [, setStates] = useQueryStates(PARSERS, { startTransition })
  const clear = () =>
    void setStates({ date: null, categories: null, region: null, location: null, page: null })

  return (
    <button
      type="button"
      onClick={clear}
      className={cn(
        'inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:text-foreground',
        className,
      )}
    >
      <X className="h-4 w-4" aria-hidden />
      Ryd filtre
    </button>
  )
}
