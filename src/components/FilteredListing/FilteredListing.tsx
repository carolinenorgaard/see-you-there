import { type ReactNode } from 'react'
import type { PaginatedDocs } from 'payload'

import { FilteredResultsArea } from '@/components/filters/FilteredResultsArea'
import { PerPageSelect } from '@/components/filters/PerPageSelect'
import { PER_PAGE_OPTIONS } from '@/components/filters/sharedFilterParsers'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'

import { PendingSkeleton } from './PendingSkeleton'

type FilteredListingProps<Doc extends { id: string | number }> = {
  result: PaginatedDocs<Doc>
  header: ReactNode
  filterBar: ReactNode
  empty: ReactNode
  renderItem: (doc: Doc) => ReactNode
}

export function FilteredListing<Doc extends { id: string | number }>({
  result,
  header,
  filterBar,
  empty,
  renderItem,
}: FilteredListingProps<Doc>) {
  const { docs, page, totalDocs, totalPages } = result
  const hasItems = docs.length > 0
  const showPerPage = totalDocs > PER_PAGE_OPTIONS[0]

  return (
    <div className="container pt-24 pb-24">
      <div className="mb-6">{header}</div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">{filterBar}</div>
        {showPerPage && <PerPageSelect />}
      </div>

      <div id="filtered-listing-top" className="scroll-mt-6 lg:scroll-mt-8">
        <FilteredResultsArea skeleton={<PendingSkeleton />}>
          {hasItems ? (
            <SeeYouThereGrid>
              {docs.map((doc) => (
                <li key={doc.id} className="contents">
                  {renderItem(doc)}
                </li>
              ))}
            </SeeYouThereGrid>
          ) : (
            empty
          )}
        </FilteredResultsArea>
      </div>

      {totalPages > 1 && page && <QueryPagination page={page} totalPages={totalPages} />}
    </div>
  )
}
