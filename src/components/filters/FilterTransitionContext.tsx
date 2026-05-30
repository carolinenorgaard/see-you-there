'use client'

import { createContext, useContext, useTransition, type ReactNode, type TransitionStartFunction } from 'react'

type FilterTransition = {
  isPending: boolean
  startTransition: TransitionStartFunction
}

const fallback: FilterTransition = {
  isPending: false,
  startTransition: (cb) => cb(),
}

const FilterTransitionContext = createContext<FilterTransition | null>(null)

export const FilterTransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isPending, startTransition] = useTransition()
  return (
    <FilterTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </FilterTransitionContext.Provider>
  )
}

export const useFilterTransition = (): FilterTransition => {
  const ctx = useContext(FilterTransitionContext)
  if (!ctx) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[useFilterTransition] No <FilterTransitionProvider> in the tree — filter URL writes will skip the loading skeleton. Wrap the route layout in <FilterTransitionProvider>.',
      )
    }
    return fallback
  }
  return ctx
}
