import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PostHero } from './index'
import { mockCategory, mockMedia, mockPost } from '../../../.storybook/fixtures'

const meta: Meta<typeof PostHero> = {
  title: 'Heros/PostHero',
  component: PostHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof PostHero>

const postWithMeta = {
  ...mockPost,
  heroImage: mockMedia,
  publishedAt: '2024-08-15T10:00:00.000Z',
  populatedAuthors: [{ id: '1', name: 'Jane Doe' }],
  categories: [mockCategory],
} as any

export const Default: Story = {
  args: { post: postWithMeta },
}

export const NoAuthor: Story = {
  args: { post: { ...postWithMeta, populatedAuthors: [] } },
}
