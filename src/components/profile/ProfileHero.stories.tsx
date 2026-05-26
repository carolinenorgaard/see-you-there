import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProfileHero, type ProfileHeroUser } from './ProfileHero'

const baseUser: ProfileHeroUser = {
  name: 'Karoline Bjørn',
  email: 'karoline@example.com',
  zipCode: '2200',
  city: 'København N',
  age: 27,
  bio: 'Elsker koncerter, café-mornings og spontane kanalture med vennerne.',
}

const meta: Meta<typeof ProfileHero> = {
  title: 'Profile/ProfileHero',
  component: ProfileHero,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    user: baseUser,
    attendingCount: 12,
    likedCount: 34,
  },
}

export default meta
type Story = StoryObj<typeof ProfileHero>

export const Default: Story = {}

export const Minimal: Story = {
  args: {
    user: { name: null, email: 'new.user@example.com', zipCode: null, city: null, age: null, bio: null },
    attendingCount: 0,
    likedCount: 0,
  },
}

/** No name — initials fall back to the email's leading letters. */
export const NoName: Story = {
  args: { user: { ...baseUser, name: null } },
}

export const SingleName: Story = {
  args: { user: { ...baseUser, name: 'Mads' } },
}

export const LongBio: Story = {
  args: {
    user: {
      ...baseUser,
      bio: 'Jeg er flyttet til København for nylig og leder altid efter nye steder at opdage — fra de små kanalcaféer i Christianshavn til de larmende klubber i Kødbyen. Skriv gerne, hvis du vil med på opdagelse!',
    },
    attendingCount: 47,
    likedCount: 128,
  },
}

export const ActiveUser: Story = {
  args: { attendingCount: 256, likedCount: 1024 },
}
