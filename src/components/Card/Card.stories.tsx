import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './index'
import { mockPost } from '../../../.storybook/fixtures'

const meta: Meta<typeof Card> = {
  title: 'Components/Card (Post)',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    doc: mockPost,
    relationTo: 'posts',
    showCategories: true,
    className: 'w-80',
  },
}

export const WithoutCategories: Story = {
  args: {
    doc: mockPost,
    relationTo: 'posts',
    showCategories: false,
    className: 'w-80',
  },
}

export const TitleOverride: Story = {
  args: {
    doc: mockPost,
    relationTo: 'posts',
    title: 'Custom title from prop',
    showCategories: true,
    className: 'w-80',
  },
}
