import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Label text' },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-[280px] gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Jane Doe" />
    </div>
  ),
}
