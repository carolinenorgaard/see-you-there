import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RelatedPosts } from './Component'
import { mockPosts, mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof RelatedPosts> = {
  title: 'Blocks/RelatedPosts',
  component: RelatedPosts,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RelatedPosts>

export const Default: Story = {
  args: { docs: mockPosts.slice(0, 2) },
}

export const WithIntro: Story = {
  args: { docs: mockPosts.slice(0, 2), introContent: mockRichText },
}

export const Empty: Story = {
  args: { docs: [] },
}
