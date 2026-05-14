import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeaderClient } from './Component.client'

const mockHeader = {
  navItems: [
    { link: { type: 'custom', url: '/about', label: 'About' } },
    { link: { type: 'custom', url: '/posts', label: 'Posts' } },
    { link: { type: 'custom', url: '/contact', label: 'Contact' } },
  ],
} as any

const meta: Meta<typeof HeaderClient> = {
  title: 'Layout/Header',
  component: HeaderClient,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof HeaderClient>

export const Default: Story = {
  args: { data: mockHeader },
}

export const NoNav: Story = {
  args: { data: { navItems: [] } as any },
}
