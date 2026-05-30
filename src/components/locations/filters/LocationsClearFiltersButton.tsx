'use client'

import { useQueryStates } from 'nuqs'
import { X } from 'lucide-react'

import { useFilterTransition } from '@/components/filters/FilterTransitionContext'
import { cn } from '@/utilities/ui'
import { locationsUrlParsers } from './locationsFilters'

const PARSERS = {
  categories: locationsUrlParsers.categories,
  region: locationsUrlParsers.region,
  page: locationsUrlParsers.page,
}

export const LocationsClearFiltersButton = ({ className }: { className?: string }) => {
  const { startTransition } = useFilterTransition()
  const [, setStates] = useQueryStates(PARSERS, { startTransition })
  const clear = () => void setStates({ categories: null, region: null, page: null })

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
