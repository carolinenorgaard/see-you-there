import { cleanup, render } from '@testing-library/react'
import type { PaginatedDocs } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(cleanup)

// QueryPagination uses nuqs + a transition context; stub it with a marker
// so the orchestration test stays focused on FilteredListing's own branches.
vi.mock('@/components/Pagination/QueryPagination', () => ({
  QueryPagination: ({ page, totalPages }: { page: number; totalPages: number }) => (
    <div data-testid="pagination">
      {page}/{totalPages}
    </div>
  ),
}))

import { FilteredListing } from '@/components/FilteredListing'

type Doc = { id: number; title: string }

const makeResult = (overrides: Partial<PaginatedDocs<Doc>> = {}): PaginatedDocs<Doc> => ({
  docs: [],
  totalDocs: 0,
  limit: 24,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
  ...overrides,
})

const baseProps = {
  header: <h1>Header</h1>,
  filterBar: <div>Filter bar</div>,
  empty: <p data-testid="empty">Empty</p>,
  renderItem: (doc: Doc) => <article data-testid="item">{doc.title}</article>,
}

describe('FilteredListing', () => {
  it('renders the empty slot when result has no docs', () => {
    const { queryByTestId } = render(
      <FilteredListing<Doc> {...baseProps} result={makeResult()} />,
    )

    expect(queryByTestId('empty')).not.toBeNull()
    expect(queryByTestId('item')).toBeNull()
  })

  it('renders each doc through renderItem when result has docs', () => {
    const result = makeResult({
      docs: [
        { id: 1, title: 'Alpha' },
        { id: 2, title: 'Beta' },
      ],
      totalDocs: 2,
    })

    const { getAllByTestId, queryByTestId } = render(
      <FilteredListing<Doc> {...baseProps} result={result} />,
    )

    const items = getAllByTestId('item')
    expect(items).toHaveLength(2)
    expect(items[0].textContent).toBe('Alpha')
    expect(items[1].textContent).toBe('Beta')
    expect(queryByTestId('empty')).toBeNull()
  })

  it('omits pagination when totalPages <= 1', () => {
    const result = makeResult({
      docs: [{ id: 1, title: 'Alpha' }],
      totalDocs: 1,
      totalPages: 1,
    })

    const { queryByTestId } = render(<FilteredListing<Doc> {...baseProps} result={result} />)

    expect(queryByTestId('pagination')).toBeNull()
  })

  it('renders pagination when totalPages > 1', () => {
    const result = makeResult({
      docs: [{ id: 1, title: 'Alpha' }],
      totalDocs: 50,
      totalPages: 3,
      page: 2,
    })

    const { getByTestId } = render(<FilteredListing<Doc> {...baseProps} result={result} />)

    expect(getByTestId('pagination').textContent).toBe('2/3')
  })

  it('renders header and filter bar slots', () => {
    const { getByTestId } = render(
      <FilteredListing<Doc>
        {...baseProps}
        header={<h1 data-testid="header">Hello</h1>}
        filterBar={<nav data-testid="bar">Bar</nav>}
        result={makeResult()}
      />,
    )

    expect(getByTestId('header').textContent).toBe('Hello')
    expect(getByTestId('bar').textContent).toBe('Bar')
  })
})
