import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Type here…' },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}
export const Email: Story = { args: { type: 'email', placeholder: 'you@example.com' } }
export const Password: Story = { args: { type: 'password', placeholder: '••••••••' } }
export const Disabled: Story = { args: { disabled: true, value: 'Read only' } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'invalid' } }

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-[280px] gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...args} />
    </div>
  ),
}
