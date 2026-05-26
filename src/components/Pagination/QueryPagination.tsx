'use client'

import { useQueryState } from 'nuqs'
import React from 'react'

import { pageParser } from '@/components/filters/sharedFilterParsers'
import { Pagination } from '@/components/Pagination'

export const QueryPagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const [, setPage] = useQueryState('page', pageParser)
  // Pagination originally hardcoded router.push('/posts/page/N'); we added the
  // onNavigate hook so query-string archives like /events can reuse the markup
  // without forking the component.
  return <Pagination {...props} onNavigate={(target) => void setPage(target)} />
}
