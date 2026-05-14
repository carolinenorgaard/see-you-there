import { cn } from '@/utilities/ui'
import * as React from 'react'

export type SeeYouThereGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Maximum number of columns at the largest breakpoint. */
  columns?: 1 | 2 | 3 | 4
  /** Gap size between cards. */
  gap?: 'sm' | 'md' | 'lg'
}

const columnsClasses: Record<NonNullable<SeeYouThereGridProps['columns']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const gapClasses: Record<NonNullable<SeeYouThereGridProps['gap']>, string> = {
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-6 lg:gap-8',
}

export const SeeYouThereGrid: React.FC<SeeYouThereGridProps> = ({
  className,
  columns = 3,
  gap = 'lg',
  ...props
}) => {
  return (
    <div
      data-slot="syt-grid"
      className={cn('grid', columnsClasses[columns], gapClasses[gap], className)}
      {...props}
    />
  )
}
