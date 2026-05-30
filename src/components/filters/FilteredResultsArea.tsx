'use client'

import type { ReactNode } from 'react'

import { useFilterTransition } from './FilterTransitionContext'

type Props = {
  children: ReactNode
  skeleton: ReactNode
}

export const FilteredResultsArea = ({ children, skeleton }: Props) => {
  const { isPending } = useFilterTransition()
  return <div aria-busy={isPending}>{isPending ? skeleton : children}</div>
}
