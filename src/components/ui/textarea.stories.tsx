import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from './label'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Type a message…' },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true, value: 'Read only' } }

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="msg">Message</Label>
      <Textarea id="msg" {...args} />
    </div>
  ),
}
