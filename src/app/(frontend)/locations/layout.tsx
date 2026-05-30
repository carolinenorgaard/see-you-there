import type { ReactNode } from 'react'

import { FilterTransitionProvider } from '@/components/filters/FilterTransitionContext'

export default function LocationsLayout({ children }: { children: ReactNode }) {
  return <FilterTransitionProvider>{children}</FilterTransitionProvider>
}
