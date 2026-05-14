import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import RichText from './index'
import { mockRichText } from '../../../.storybook/fixtures'

const meta: Meta<typeof RichText> = {
  title: 'Components/RichText',
  component: RichText,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RichText>

export const Default: Story = {
  args: { data: mockRichText },
}

export const NoGutter: Story = {
  args: { data: mockRichText, enableGutter: false },
}

export const NoProse: Story = {
  args: { data: mockRichText, enableProse: false },
}
