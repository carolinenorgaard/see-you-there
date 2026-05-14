import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CollectionArchive } from './index'
import { mockPosts } from '../../../.storybook/fixtures'

const meta: Meta<typeof CollectionArchive> = {
  title: 'Components/CollectionArchive',
  component: CollectionArchive,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CollectionArchive>

export const Default: Story = {
  args: { posts: mockPosts },
}

export const Empty: Story = {
  args: { posts: [] },
}
