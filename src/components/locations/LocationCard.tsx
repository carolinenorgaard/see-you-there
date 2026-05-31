import { MapPin } from 'lucide-react'
import * as React from 'react'

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
} from '@/components/SeeYouThereCard'
import { Badge } from '@/components/ui/badge'
import type { Category, Location, Media, Region } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { populated } from '@/utilities/payloadRelations'

type LocationCardProps = {
  location: Location
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const region =
    typeof location.address.region === 'object' ? (location.address.region as Region) : null
  const categories = (location.categories ?? []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  const image = populated<Media>(location.image)

  return (
    <SeeYouThereCard href={location.slug ? `/locations/${location.slug}` : undefined}>
      {image?.url && <SeeYouThereCardImage src={image.url} alt={image.alt ?? location.title} />}
      <SeeYouThereCardOverlay intensity="soft" />
      <SeeYouThereCardHeader>
        <SeeYouThereCardBadges className="flex-wrap">
          {categories.map((c) => (
            <Badge key={c.id} color={categoryColorClass(c.color)}>
              {c.title}
            </Badge>
          ))}
        </SeeYouThereCardBadges>
        {region && (
          <Badge variant="glass" size="md">
            {region.title}
          </Badge>
        )}
      </SeeYouThereCardHeader>
      <SeeYouThereCardFooter>
        <SeeYouThereCardBody>
          <SeeYouThereCardTitle>{location.title}</SeeYouThereCardTitle>
          <SeeYouThereCardMeta>
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {location.address.street} • {location.address.city}
            </span>
          </SeeYouThereCardMeta>
        </SeeYouThereCardBody>
      </SeeYouThereCardFooter>
    </SeeYouThereCard>
  )
}
