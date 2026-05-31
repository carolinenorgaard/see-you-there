import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { PaginatedDocs } from 'payload'

import {
  SeeYouThereCard,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '@/components/SeeYouThereCard'

import { FilteredListing } from './FilteredListing'

type DemoDoc = { id: number; title: string }

const meta: Meta<typeof FilteredListing<DemoDoc>> = {
  title: 'Components/FilteredListing',
  component: FilteredListing<DemoDoc>,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FilteredListing<DemoDoc>>

const makeResult = (overrides: Partial<PaginatedDocs<DemoDoc>> = {}): PaginatedDocs<DemoDoc> => ({
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

const demoDocs: DemoDoc[] = [
  { id: 1, title: 'First listing' },
  { id: 2, title: 'Second listing' },
  { id: 3, title: 'Third listing' },
]

const sharedSlots = {
  header: <h1 className="text-4xl font-bold tracking-tight">Demo header</h1>,
  filterBar: (
    <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
      Filter bar slot
    </div>
  ),
  empty: <p className="text-muted-foreground">Nothing to show.</p>,
  renderItem: (doc: DemoDoc) => (
    <SeeYouThereCard>
      <SeeYouThereCardOverlay intensity="soft" />
      <SeeYouThereCardFooter>
        <SeeYouThereCardBody>
          <SeeYouThereCardTitle>{doc.title}</SeeYouThereCardTitle>
        </SeeYouThereCardBody>
      </SeeYouThereCardFooter>
    </SeeYouThereCard>
  ),
}

export const WithItems: Story = {
  args: {
    ...sharedSlots,
    result: makeResult({ docs: demoDocs, totalDocs: demoDocs.length }),
  },
}

export const Empty: Story = {
  args: {
    ...sharedSlots,
    result: makeResult(),
  },
}

export const Paginated: Story = {
  args: {
    ...sharedSlots,
    result: makeResult({
      docs: demoDocs,
      totalDocs: 80,
      totalPages: 4,
      page: 2,
      hasPrevPage: true,
      hasNextPage: true,
      prevPage: 1,
      nextPage: 3,
    }),
  },
}
