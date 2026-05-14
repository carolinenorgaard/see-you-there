import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LowImpactHero } from './index'
import { mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof LowImpactHero> = {
  title: 'Heros/LowImpact',
  component: LowImpactHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof LowImpactHero>

export const RichText: Story = {
  args: { richText: mockRichText } as any,
}

export const WithChildren: Story = {
  args: { children: <h1 className="text-4xl font-bold">Hello from children</h1> } as any,
}
