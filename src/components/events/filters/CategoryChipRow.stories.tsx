import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { Category } from '@/payload-types'
import { CategoryChipRow } from './CategoryChipRow'

const categories: Category[] = [
  { id: 1, title: 'Music', slug: 'music', color: 'pink' } as unknown as Category,
  { id: 2, title: 'Food', slug: 'food', color: 'orange' } as unknown as Category,
  { id: 3, title: 'Outdoor', slug: 'outdoor', color: 'teal' } as unknown as Category,
  { id: 4, title: 'Workshop', slug: 'workshop', color: 'purple' } as unknown as Category,
  { id: 5, title: 'Nightlife', slug: 'nightlife', color: 'blue' } as unknown as Category,
  { id: 6, title: 'Family', slug: 'family', color: 'amber' } as unknown as Category,
]

const meta: Meta<typeof CategoryChipRow> = {
  title: 'Events/Filters/CategoryChipRow',
  component: CategoryChipRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CategoryChipRow>

export const NoneSelected: Story = {
  args: { categories },
}

export const OneSelected: Story = {
  args: { categories },
  parameters: { nuqs: { searchParams: '?categories=music' } },
}

export const MultipleSelected: Story = {
  args: { categories },
  parameters: { nuqs: { searchParams: '?categories=music,food,outdoor' } },
}
