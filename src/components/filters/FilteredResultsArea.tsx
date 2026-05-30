'use client'

import type { ReactNode } from 'react'

import { useFilterTransition } from './FilterTransitionContext'

type Props = {
  children: ReactNode
  skeleton: ReactNode
  pendingLabel?: string
}

export const FilteredResultsArea = ({
  children,
  skeleton,
  pendingLabel = 'Henter resultater…',
}: Props) => {
  const { isPending } = useFilterTransition()
  return (
    <div aria-busy={isPending}>
      <span role="status" aria-live="polite" className="sr-only">
        {isPending ? pendingLabel : ''}
      </span>
      {isPending ? skeleton : children}
    </div>
  )
}
