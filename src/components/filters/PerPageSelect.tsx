'use client'

import { useQueryStates } from 'nuqs'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useFilterTransition } from './FilterTransitionContext'
import {
  PER_PAGE_OPTIONS,
  normalizePerPage,
  pageParser,
  perPageParser,
} from './sharedFilterParsers'

const PARSERS = { page: pageParser, perPage: perPageParser }

export const PerPageSelect = () => {
  const { startTransition } = useFilterTransition()
  const [{ perPage }, setStates] = useQueryStates(PARSERS, { startTransition })

  const handleChange = (next: string) => {
    const parsed = Number(next)
    if (!Number.isFinite(parsed)) return
    void setStates({ page: null, perPage: parsed })
    document
      .getElementById('filtered-listing-top')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Select value={String(normalizePerPage(perPage))} onValueChange={handleChange}>
      <SelectTrigger
        aria-label="Resultater per side"
        className="h-10 w-auto min-w-28 rounded-full"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PER_PAGE_OPTIONS.map((option) => (
          <SelectItem key={option} value={String(option)}>
            {option} per side
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
