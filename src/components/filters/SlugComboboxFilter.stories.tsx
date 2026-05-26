import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { Region } from '@/payload-types'

import { SlugComboboxFilter } from './SlugComboboxFilter'

const regions: Region[] = [
  { id: 1, title: 'Copenhagen', slug: 'copenhagen' } as unknown as Region,
  { id: 2, title: 'Aarhus', slug: 'aarhus' } as unknown as Region,
  { id: 3, title: 'Odense', slug: 'odense' } as unknown as Region,
  { id: 4, title: 'Aalborg', slug: 'aalborg' } as unknown as Region,
]

const meta: Meta<typeof SlugComboboxFilter<Region>> = {
  title: 'Filters/SlugComboboxFilter',
  component: SlugComboboxFilter,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SlugComboboxFilter<Region>>

const baseArgs = {
  items: regions,
  paramKey: 'region',
  allLabel: 'Alle regioner',
  searchPlaceholder: 'Søg efter region…',
  ariaLabel: 'Filtrér efter region',
}

export const NoneSelected: Story = {
  args: baseArgs,
}

export const RegionSelected: Story = {
  args: baseArgs,
  parameters: { nuqs: { searchParams: '?region=copenhagen' } },
}
