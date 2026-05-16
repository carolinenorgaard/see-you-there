import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Heart, MapPin, Star } from 'lucide-react'
import { Badge } from '../ui/badge'
import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardImage,
  SeeYouThereCardMeta,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '../SeeYouThereCard'
import { SeeYouThereGrid } from './index'

const meta: Meta<typeof SeeYouThereGrid> = {
  title: 'Components/SeeYouThereGrid',
  component: SeeYouThereGrid,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 4] },
    gap: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof SeeYouThereGrid>

const eventImages = [
  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1463694775559-eea25626346b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
]

const events = [
  {
    title: 'Canal-Side Summer Solstice',
    meta: 'Nørrebro • Tonight, 20:00',
    category: { label: 'Outdoor', color: 'bg-teal-600' },
    secondary: 'Tomorrow',
    rightBadge: 'Featured',
    rightSize: 'md' as const,
  },
  {
    title: 'Underground Jazz Sessions',
    meta: 'Nørrebro • Tonight, 20:00',
    category: { label: 'Music', color: 'bg-pink-600' },
    rightBadge: 'Free',
  },
  {
    title: 'Midnight Mixology Workshop',
    meta: 'Vesterbro • July 12, 22:00',
    category: { label: 'Nightlife', color: 'bg-purple-400' },
    rightBadge: 'DKK 150',
  },
  {
    title: 'SMK Friday Night',
    meta: 'National Gallery • Tonight, 20:00',
    category: { label: 'Arts', color: 'bg-orange-400' },
    rightBadge: 'DKK 150',
  },
  {
    title: 'Morning Kayak Expedition',
    meta: 'Vesterbro Jazz Club • Tonight, 20:00',
    category: { label: 'Sport', color: 'bg-blue-700' },
    rightBadge: 'DKK 150',
  },
  {
    title: 'Jazz & Wine Evening',
    meta: 'Vesterbro Jazz Club • Tonight, 20:00',
    category: { label: 'Nightlife', color: 'bg-purple-400' },
  },
]

export const EventsGrid: Story = {
  args: { columns: 3, gap: 'lg' },
  render: (args) => (
    <div className="bg-neutral-50 p-10">
      <SeeYouThereGrid {...args}>
        {events.map((e, i) => (
          <SeeYouThereCard key={e.title}>
            <SeeYouThereCardImage src={eventImages[i]} alt="" />
            <SeeYouThereCardOverlay />
            <SeeYouThereCardHeader>
              <SeeYouThereCardBadges>
                <Badge color={e.category.color}>{e.category.label}</Badge>
                {e.secondary && <Badge variant="translucent">{e.secondary}</Badge>}
              </SeeYouThereCardBadges>
              {e.rightBadge && (
                <Badge variant="glass" size={e.rightSize ?? 'sm'}>
                  {e.rightBadge}
                </Badge>
              )}
            </SeeYouThereCardHeader>
            <SeeYouThereCardFooter>
              <SeeYouThereCardBody>
                <SeeYouThereCardTitle>{e.title}</SeeYouThereCardTitle>
                <SeeYouThereCardMeta>
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{e.meta}</span>
                </SeeYouThereCardMeta>
              </SeeYouThereCardBody>
              <button
                type="button"
                aria-label="Save"
                className="shrink-0 rounded-full p-1.5 text-white transition hover:bg-white/10"
              >
                <Heart className="h-5 w-5" aria-hidden />
              </button>
            </SeeYouThereCardFooter>
          </SeeYouThereCard>
        ))}
      </SeeYouThereGrid>
    </div>
  ),
}

const locations = [
  {
    slug: 'cafe-paludan',
    title: 'Cafe Paludan',
    meta: 'Fiolstræde 10 • Open until 22:00',
    category: { label: 'Cafe', color: 'bg-amber-500' },
    neighbourhood: 'Indre By',
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'reffen-street-food',
    title: 'Reffen Street Food',
    meta: 'Refshalevej 167 • Open until 22:00',
    category: { label: 'Food', color: 'bg-orange-400' },
    neighbourhood: 'Refshaleøen',
    rating: 4.4,
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'la-banchina',
    title: 'La Banchina',
    meta: 'Refshalevej 141 • Open until 23:00',
    category: { label: 'Bar', color: 'bg-purple-400' },
    neighbourhood: 'Refshaleøen',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
  },
]

export const LocationsGrid: Story = {
  args: { columns: 3, gap: 'lg' },
  render: (args) => (
    <div className="bg-neutral-50 p-10">
      <SeeYouThereGrid {...args}>
        {locations.map((l) => (
          <SeeYouThereCard key={l.slug} href={`/locations/${l.slug}`}>
            <SeeYouThereCardImage src={l.image} alt="" />
            <SeeYouThereCardOverlay />
            <SeeYouThereCardHeader>
              <SeeYouThereCardBadges>
                <Badge color={l.category.color}>{l.category.label}</Badge>
                <Badge variant="translucent">{l.neighbourhood}</Badge>
              </SeeYouThereCardBadges>
              <Badge variant="glass" size="md" className="gap-1">
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                {l.rating.toFixed(1)}
              </Badge>
            </SeeYouThereCardHeader>
            <SeeYouThereCardFooter>
              <SeeYouThereCardBody>
                <SeeYouThereCardTitle>{l.title}</SeeYouThereCardTitle>
                <SeeYouThereCardMeta>
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{l.meta}</span>
                </SeeYouThereCardMeta>
              </SeeYouThereCardBody>
            </SeeYouThereCardFooter>
          </SeeYouThereCard>
        ))}
      </SeeYouThereGrid>
    </div>
  ),
}
