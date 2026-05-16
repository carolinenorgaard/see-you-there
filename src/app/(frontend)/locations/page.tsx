import configPromise from '@payload-config'
import { MapPin } from 'lucide-react'
import { getPayload } from 'payload'

import { Badge } from '@/components/ui/badge'
import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardMeta,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '@/components/SeeYouThereCard'
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import type { Category, Location, Region } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'

export const dynamic = 'force-dynamic'

export default async function LocationsPage() {
  const payload = await getPayload({ config: configPromise })

  const locations = await payload.find({
    collection: 'locations',
    depth: 1,
    limit: 100,
    overrideAccess: false,
  })

  return (
    <div className="container pt-24 pb-24">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Locations</h1>
      {locations.docs.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <SeeYouThereGrid>
          {locations.docs.map((location: Location) => {
            const region =
              typeof location.address.region === 'object' ? (location.address.region as Region) : null
            const categories = (location.categories ?? []).filter(
              (c): c is Category => typeof c === 'object' && c !== null,
            )

            return (
              <SeeYouThereCard
                key={location.id}
                href={location.slug ? `/locations/${location.slug}` : undefined}
              >
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
          })}
        </SeeYouThereGrid>
      )}
    </div>
  )
}
