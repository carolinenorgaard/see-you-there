import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ContentBlock } from './Component'
import { mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof ContentBlock> = {
  title: 'Blocks/Content',
  component: ContentBlock,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContentBlock>

export const FullWidth: Story = {
  args: {
    blockType: 'content',
    columns: [{ size: 'full', richText: mockRichText, enableLink: false }] as any,
  },
}

export const TwoColumns: Story = {
  args: {
    blockType: 'content',
    columns: [
      { size: 'half', richText: mockRichText, enableLink: false },
      { size: 'half', richText: mockRichText, enableLink: false },
    ] as any,
  },
}

export const ThreeColumns: Story = {
  args: {
    blockType: 'content',
    columns: [
      { size: 'oneThird', richText: mockRichText, enableLink: false },
      { size: 'oneThird', richText: mockRichText, enableLink: false },
      { size: 'oneThird', richText: mockRichText, enableLink: false },
    ] as any,
  },
}

export const WithLinks: Story = {
  args: {
    blockType: 'content',
    columns: [
      {
        size: 'half',
        richText: mockRichText,
        enableLink: true,
        link: { type: 'custom', url: '/about', label: 'Read more', appearance: 'default' },
      },
      {
        size: 'half',
        richText: mockRichText,
        enableLink: true,
        link: { type: 'custom', url: '/contact', label: 'Contact', appearance: 'outline' },
      },
    ] as any,
  },
}
