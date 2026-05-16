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
} from './index'

const meta: Meta<typeof SeeYouThereCard> = {
  title: 'Components/SeeYouThereCard',
  component: SeeYouThereCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof SeeYouThereCard>

const canalSide =
  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80'
const jazzCrowd =
  'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80'
const cocktails =
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80'
const cafe =
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80'

const HeartButton = () => (
  <button
    type="button"
    aria-label="Save"
    className="shrink-0 rounded-full p-1.5 text-white transition hover:bg-white/10"
  >
    <Heart className="h-5 w-5" aria-hidden />
  </button>
)

/** A featured event with a Tomorrow pill and a Featured pill. */
export const FeaturedEvent: Story = {
  render: () => (
    <div className="w-[528px]">
      <SeeYouThereCard>
        <SeeYouThereCardImage src={canalSide} alt="Canal side at night" />
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-teal-600">Outdoor</Badge>
            <Badge variant="translucent">Tomorrow</Badge>
          </SeeYouThereCardBadges>
          <Badge variant="glass" size="md">
            Featured
          </Badge>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle>Canal-Side Summer Solstice</SeeYouThereCardTitle>
            <SeeYouThereCardMeta>
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Nørrebro • Tonight, 20:00</span>
            </SeeYouThereCardMeta>
          </SeeYouThereCardBody>
        </SeeYouThereCardFooter>
      </SeeYouThereCard>
    </div>
  ),
}

/** Standard event card with a Free badge and a like button. */
export const FreeEvent: Story = {
  render: () => (
    <div className="w-[528px]">
      <SeeYouThereCard>
        <SeeYouThereCardImage src={jazzCrowd} alt="Jazz crowd" />
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-pink-600">Music</Badge>
          </SeeYouThereCardBadges>
          <Badge variant="glass">Free</Badge>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle>Underground Jazz Sessions</SeeYouThereCardTitle>
            <SeeYouThereCardMeta>
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Nørrebro • Tonight, 20:00</span>
            </SeeYouThereCardMeta>
          </SeeYouThereCardBody>
          <HeartButton />
        </SeeYouThereCardFooter>
      </SeeYouThereCard>
    </div>
  ),
}

/** Priced event with DKK badge. */
export const PricedEvent: Story = {
  render: () => (
    <div className="w-[528px]">
      <SeeYouThereCard>
        <SeeYouThereCardImage src={cocktails} alt="Cocktails" />
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-purple-400">Nightlife</Badge>
          </SeeYouThereCardBadges>
          <Badge variant="glass">DKK 150</Badge>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle>Midnight Mixology Workshop</SeeYouThereCardTitle>
            <SeeYouThereCardMeta>
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Vesterbro • July 12, 22:00</span>
            </SeeYouThereCardMeta>
          </SeeYouThereCardBody>
          <HeartButton />
        </SeeYouThereCardFooter>
      </SeeYouThereCard>
    </div>
  ),
}

/** Same primitives reused for a Location card — neighbourhood pill, rating pill, no date. */
export const LocationCard: Story = {
  render: () => (
    <div className="w-[528px]">
      <SeeYouThereCard href="/locations/cafe-paludan">
        <SeeYouThereCardImage src={cafe} alt="Cafe Paludan interior" />
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-amber-500">Cafe</Badge>
            <Badge variant="translucent">Indre By</Badge>
          </SeeYouThereCardBadges>
          <Badge variant="glass" size="md" className="gap-1">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden /> 4.6
          </Badge>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle>Cafe Paludan</SeeYouThereCardTitle>
            <SeeYouThereCardMeta>
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Fiolstræde 10 • Open until 22:00</span>
            </SeeYouThereCardMeta>
          </SeeYouThereCardBody>
        </SeeYouThereCardFooter>
      </SeeYouThereCard>
    </div>
  ),
}
