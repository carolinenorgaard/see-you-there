import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MediaBlock } from './Component'
import { mockMedia, mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof MediaBlock> = {
  title: 'Blocks/MediaBlock',
  component: MediaBlock,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MediaBlock>

export const Default: Story = {
  args: {
    blockType: 'mediaBlock',
    media: mockMedia,
  },
}

export const WithCaption: Story = {
  args: {
    blockType: 'mediaBlock',
    media: { ...mockMedia, caption: mockRichText } as any,
  },
}

export const NoGutter: Story = {
  args: {
    blockType: 'mediaBlock',
    media: mockMedia,
    enableGutter: false,
  },
}
