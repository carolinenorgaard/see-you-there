import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { Badge } from '@/components/ui/badge'
import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardOverlay,
  SeeYouThereCardTitle,
} from '@/components/SeeYouThereCard'
import type { Location } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  })

  const location = result.docs[0] as Location | undefined
  if (!location) notFound()

  return (
    <div className="container pt-24 pb-24">
      <SeeYouThereCard aspect="aspect-[16/7]" className="mb-10">
        <SeeYouThereCardOverlay />
        <SeeYouThereCardHeader>
          <SeeYouThereCardBadges>
            <Badge color="bg-teal-600">Location</Badge>
          </SeeYouThereCardBadges>
        </SeeYouThereCardHeader>
        <SeeYouThereCardFooter>
          <SeeYouThereCardBody>
            <SeeYouThereCardTitle className="text-3xl md:text-5xl">
              {location.title}
            </SeeYouThereCardTitle>
          </SeeYouThereCardBody>
        </SeeYouThereCardFooter>
      </SeeYouThereCard>

      {location.description && (
        <div className="prose max-w-3xl">
          <p>{location.description}</p>
        </div>
      )}
    </div>
  )
}
