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
    state: {
      source: 'syt',
      date: null,
      categories: [],
      region: null,
      location: null,
    },
  },
}

export const NoCommunityEvents: Story = {
  args: {
    state: {
      source: 'community',
      date: null,
      categories: [],
      region: null,
      location: null,
    },
  },
}

export const NoMatchingFilters: Story = {
  args: {
    state: {
      source: 'syt',
      date: '2026-05-20',
      categories: ['music', 'food'],
      region: 'copenhagen',
      location: null,
    },
  },
}
