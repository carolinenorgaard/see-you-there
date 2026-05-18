import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SourceToggle } from './SourceToggle'

const meta: Meta<typeof SourceToggle> = {
  title: 'Events/SourceToggle',
  component: SourceToggle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SourceToggle>

export const SeeYouThere: Story = {
  args: { active: 'syt' },
}

export const Community: Story = {
  args: { active: 'community' },
}
