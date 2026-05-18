import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { EmptyEventsMessage } from './EmptyEventsMessage'

const meta: Meta<typeof EmptyEventsMessage> = {
  title: 'Events/EmptyEventsMessage',
  component: EmptyEventsMessage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof EmptyEventsMessage>

export const NoSeeYouThereEvents: Story = {
  args: {
    filters: { source: 'syt', date: null, categorySlugs: [], regionSlug: null },
  },
}

export const NoCommunityEvents: Story = {
  args: {
    filters: { source: 'community', date: null, categorySlugs: [], regionSlug: null },
  },
}

export const NoMatchingFilters: Story = {
  args: {
    filters: {
      source: 'syt',
      date: '2026-05-20',
      categorySlugs: ['music', 'food'],
      regionSlug: 'copenhagen',
    },
  },
}
