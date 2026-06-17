import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { cphIsoDay, nextIsoDay } from '@/utilities/formatDateTime'
import { DateChipRail } from './DateChipRail'

const todayIso = () => cphIsoDay(new Date())
const futureIso = (offset: number) => {
  let iso = todayIso()
  for (let i = 0; i < offset; i++) iso = nextIsoDay(iso)
  return iso
}

const meta: Meta<typeof DateChipRail> = {
  title: 'Events/Filters/DateChipRail',
  component: DateChipRail,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof DateChipRail>

export const Default: Story = {}

export const TodaySelected: Story = {
  parameters: { nuqs: { searchParams: `?date=${todayIso()}` } },
}

export const FutureDateSelected: Story = {
  parameters: { nuqs: { searchParams: `?date=${futureIso(5)}` } },
}
