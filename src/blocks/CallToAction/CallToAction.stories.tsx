import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CallToActionBlock } from './Component'
import { mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof CallToActionBlock> = {
  title: 'Blocks/CallToAction',
  component: CallToActionBlock,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CallToActionBlock>

export const Default: Story = {
  args: {
    blockType: 'cta',
    richText: mockRichText,
    links: [
      { link: { type: 'custom', url: '/about', label: 'Learn more', appearance: 'default' } },
      { link: { type: 'custom', url: '/contact', label: 'Contact us', appearance: 'outline' } },
    ] as any,
  },
}

export const SingleLink: Story = {
  args: {
    blockType: 'cta',
    richText: mockRichText,
    links: [
      { link: { type: 'custom', url: '/about', label: 'Get started', appearance: 'default' } },
    ] as any,
  },
}
