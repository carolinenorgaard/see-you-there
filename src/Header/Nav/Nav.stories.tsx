import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeaderNav } from './index'

const meta: Meta<typeof HeaderNav> = {
  title: 'Layout/HeaderNav',
  component: HeaderNav,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof HeaderNav>

export const Default: Story = {
  args: {
    data: {
      navItems: [
        { link: { type: 'custom', url: '/about', label: 'About' } },
        { link: { type: 'custom', url: '/posts', label: 'Posts' } },
      ],
    } as any,
  },
}

export const Empty: Story = {
  args: { data: { navItems: [] } as any },
}
