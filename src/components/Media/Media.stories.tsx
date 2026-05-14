import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Media } from './index'
import { mockMedia } from '../../../.storybook/fixtures'

const meta: Meta<typeof Media> = {
  title: 'Components/Media',
  component: Media,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Media>

export const Image: Story = {
  args: {
    resource: mockMedia,
    className: 'w-96',
  },
}

export const ImageWithSrc: Story = {
  args: {
    src: {
      src: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200',
      width: 1200,
      height: 800,
    } as any,
    alt: 'Static image',
    className: 'w-96',
  },
}
