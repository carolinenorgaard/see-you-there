import { Fragment, type ReactNode } from 'react'
import type { PaginatedDocs } from 'payload'

import { FilteredResultsArea } from '@/components/filters/FilteredResultsArea'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import { SeeYouThereCardSkeletonGrid } from '@/components/SeeYouThereCard/SeeYouThereCardSkeleton'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'

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
  const { docs, limit, page, totalPages } = result
  const hasItems = docs.length > 0

  return (
    <div className="container pt-24 pb-24">
      <div className="mb-6">{header}</div>
      <div className="mb-8">{filterBar}</div>

      <div id="filtered-listing-top" className="scroll-mt-6 lg:scroll-mt-8">
        <FilteredResultsArea
          skeleton={<SeeYouThereCardSkeletonGrid count={docs.length || limit} />}
        >
          {hasItems ? (
            <SeeYouThereGrid>
              {docs.map((doc) => (
                <Fragment key={doc.id}>{renderItem(doc)}</Fragment>
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
