import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { Region } from '@/payload-types'
import { RegionSelect } from './RegionSelect'

const regions: Region[] = [
  { id: 1, title: 'Copenhagen', slug: 'copenhagen' } as unknown as Region,
  { id: 2, title: 'Aarhus', slug: 'aarhus' } as unknown as Region,
  { id: 3, title: 'Odense', slug: 'odense' } as unknown as Region,
  { id: 4, title: 'Aalborg', slug: 'aalborg' } as unknown as Region,
]

const meta: Meta<typeof RegionSelect> = {
  title: 'Filters/RegionSelect',
  component: RegionSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof RegionSelect>

export const NoneSelected: Story = {
  args: { regions },
}

export const RegionSelected: Story = {
  args: { regions },
  parameters: { nuqs: { searchParams: '?region=copenhagen' } },
}
