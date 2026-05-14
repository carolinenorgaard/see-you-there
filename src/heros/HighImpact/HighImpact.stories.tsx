import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HighImpactHero } from './index'
import { mockMedia, mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof HighImpactHero> = {
  title: 'Heros/HighImpact',
  component: HighImpactHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof HighImpactHero>

export const Default: Story = {
  args: {
    type: 'highImpact',
    media: mockMedia,
    richText: mockRichText,
    links: [
      { link: { type: 'custom', url: '/about', label: 'Learn more', appearance: 'default' } },
      { link: { type: 'custom', url: '/contact', label: 'Contact', appearance: 'outline' } },
    ],
  } as any,
}

export const WithoutLinks: Story = {
  args: {
    type: 'highImpact',
    media: mockMedia,
    richText: mockRichText,
    links: [],
  } as any,
}
