import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { toIsoDay } from '@/utilities/formatDateTime'
import { DateChipRail } from './DateChipRail'

const todayIso = () => toIsoDay(new Date())
const futureIso = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return toIsoDay(d)
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
