import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'glass', 'translucent', 'outline'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Solid: Story = {
  args: { children: 'Music', variant: 'solid', color: 'bg-pink-600' },
}

export const Glass: Story = {
  args: { children: 'DKK 150', variant: 'glass', size: 'md' },
}

export const Translucent: Story = {
  render: (args) => (
    <div className="bg-neutral-800 p-6">
      <Badge {...args} />
    </div>
  ),
  args: { children: 'Tomorrow', variant: 'translucent' },
}

export const Outline: Story = {
  render: (args) => (
    <div className="bg-neutral-800 p-6">
      <Badge {...args} />
    </div>
  ),
  args: { children: 'Coming soon', variant: 'outline' },
}

export const Palette: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 bg-neutral-100 p-6">
      <Badge color="bg-teal-600">Outdoor</Badge>
      <Badge color="bg-pink-600">Music</Badge>
      <Badge color="bg-purple-400">Nightlife</Badge>
      <Badge color="bg-orange-400">Arts</Badge>
      <Badge color="bg-blue-700">Sport</Badge>
      <Badge color="bg-amber-500">Food</Badge>
    </div>
  ),
}
