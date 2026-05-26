import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Heart, X } from 'lucide-react'

import type { Event } from '@/payload-types'

import { ProfileEventsSection } from './ProfileEventsSection'

const image = (url: string) =>
  ({
    id: 1,
    alt: 'Sample event image',
    url,
    filename: 'sample.jpg',
    mimeType: 'image/jpeg',
    filesize: 12345,
    width: 1200,
    height: 800,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }) as any

const category = (id: number, title: string, color: string) =>
  ({
    id,
    title,
    slug: title.toLowerCase(),
    color,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }) as any

const location = (title: string, img: string) =>
  ({
    id: 1,
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    image: image(img),
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }) as any

const mockEvent = (overrides: Partial<Event> = {}): Event =>
  ({
    id: '1',
    title: 'Canal-Side Summer Solstice',
    slug: 'canal-side-summer-solstice',
    startDate: '2026-06-21',
    startTime: '20:00',
    categories: [category(1, 'Outdoor', 'teal')],
    location: location(
      'Nørrebro',
      'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
    ),
    image: image(
      'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
    ),
    likes: [],
    attendees: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }) as unknown as Event

const events: Event[] = [
  mockEvent(),
  mockEvent({
    id: '2',
    title: 'Underground Jazz Sessions',
    slug: 'underground-jazz',
    startDate: '2026-06-25',
    startTime: '21:30',
    categories: [category(2, 'Music', 'pink')],
    image: image(
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80',
    ),
  }),
  mockEvent({
    id: '3',
    title: 'Midnight Mixology Workshop',
    slug: 'midnight-mixology',
    startDate: '2026-07-12',
    startTime: '22:00',
    categories: [category(3, 'Nightlife', 'purple')],
    image: image(
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    ),
  }),
]

const cancelButton = (
  <button
    type="button"
    aria-label="Annullér tilmelding"
    title="Annullér tilmelding"
    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black bg-black text-white shadow-sm"
  >
    <X className="h-4 w-4" />
  </button>
)

const likeButton = (
  <button
    type="button"
    aria-label="Fjern like"
    title="Fjern like"
    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-pink-500 bg-pink-500 text-white shadow-sm"
  >
    <Heart className="h-4 w-4 fill-current" />
  </button>
)

const attendingCopy = {
  title: 'Begivenheder du deltager i',
  emptyMessage: 'Du har endnu ikke tilmeldt dig nogen begivenheder.',
}

const likedCopy = {
  title: 'Begivenheder du har liket',
  emptyMessage: 'Ingen likede begivenheder endnu.',
}

const meta: Meta<typeof ProfileEventsSection> = {
  title: 'Profile/ProfileEventsSection',
  component: ProfileEventsSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ProfileEventsSection>

export const Attending: Story = {
  args: { ...attendingCopy, events, renderAction: () => cancelButton },
}

export const Liked: Story = {
  args: { ...likedCopy, events, renderAction: () => likeButton },
}

export const Empty: Story = {
  args: { ...attendingCopy, events: [] },
}

export const SingleEvent: Story = {
  args: { ...attendingCopy, events: [events[0]!], renderAction: () => cancelButton },
}

/** Section without per-card actions — e.g. a read-only history view. */
export const ReadOnly: Story = {
  args: {
    title: 'Begivenheder du tidligere har deltaget i',
    emptyMessage: 'Ingen tidligere begivenheder.',
    events,
  },
}
