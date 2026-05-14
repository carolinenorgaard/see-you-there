import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Pagination } from './index'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination (Posts)',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const FirstPage: Story = { args: { page: 1, totalPages: 10 } }
export const MiddlePage: Story = { args: { page: 5, totalPages: 10 } }
export const LastPage: Story = { args: { page: 10, totalPages: 10 } }
export const SinglePage: Story = { args: { page: 1, totalPages: 1 } }
