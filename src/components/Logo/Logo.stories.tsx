import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Logo } from './Logo'

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Logo>

export const Default: Story = {}

export const IconOnly: Story = {
  args: { iconOnly: true },
}

export const Light: Story = {
  args: { light: true },
  decorators: [
    (Story) => (
      <div className="bg-black p-6">
        <Story />
      </div>
    ),
  ],
}
