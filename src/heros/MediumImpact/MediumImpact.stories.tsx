import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MediumImpactHero } from './index'
import { mockMedia, mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof MediumImpactHero> = {
  title: 'Heros/MediumImpact',
  component: MediumImpactHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof MediumImpactHero>

export const Default: Story = {
  args: {
    type: 'mediumImpact',
    media: mockMedia,
    richText: mockRichText,
    links: [
      { link: { type: 'custom', url: '/about', label: 'Learn more', appearance: 'default' } },
    ],
  } as any,
}

export const WithCaption: Story = {
  args: {
    type: 'mediumImpact',
    media: { ...mockMedia, caption: mockRichText },
    richText: mockRichText,
    links: [],
  } as any,
}
