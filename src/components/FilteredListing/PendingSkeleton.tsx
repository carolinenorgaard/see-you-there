'use client'

import { useQueryState } from 'nuqs'

import { SeeYouThereCardSkeletonGrid } from '@/components/SeeYouThereCard/SeeYouThereCardSkeleton'
import { normalizePerPage, perPageParser } from '@/components/filters/sharedFilterParsers'

export const PendingSkeleton = () => {
  const [perPage] = useQueryState('perPage', perPageParser)
  return <SeeYouThereCardSkeletonGrid count={normalizePerPage(perPage)} />
}
