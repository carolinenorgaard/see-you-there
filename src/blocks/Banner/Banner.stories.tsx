import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BannerBlock } from './Component'
import { mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof BannerBlock> = {
  title: 'Blocks/Banner',
  component: BannerBlock,
  tags: ['autodocs'],
  argTypes: {
    style: { control: 'select', options: ['info', 'error', 'success', 'warning'] },
  },
}

export default meta
type Story = StoryObj<typeof BannerBlock>

const baseArgs = { content: mockRichText, blockType: 'banner' as const }

export const Info: Story = { args: { ...baseArgs, style: 'info' } }
export const Success: Story = { args: { ...baseArgs, style: 'success' } }
export const Warning: Story = { args: { ...baseArgs, style: 'warning' } }
export const Error: Story = { args: { ...baseArgs, style: 'error' } }
