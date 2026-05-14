import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Logo } from './Logo'

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { className: 'invert dark:invert-0' },
}

export default meta
type Story = StoryObj<typeof Logo>

export const Default: Story = {}
export const Eager: Story = { args: { loading: 'eager', priority: 'high' } }
