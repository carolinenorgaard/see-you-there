import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageRange } from './index'

const meta: Meta<typeof PageRange> = {
  title: 'Components/PageRange',
  component: PageRange,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof PageRange>

export const FirstPage: Story = {
  args: { collection: 'posts', currentPage: 1, limit: 10, totalDocs: 42 },
}
export const MiddlePage: Story = {
  args: { collection: 'posts', currentPage: 3, limit: 10, totalDocs: 42 },
}
export const NoResults: Story = {
  args: { collection: 'posts', currentPage: 1, limit: 10, totalDocs: 0 },
}
export const CustomLabels: Story = {
  args: {
    collectionLabels: { singular: 'Article', plural: 'Articles' },
    currentPage: 1,
    limit: 5,
    totalDocs: 7,
  },
}
