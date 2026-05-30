import configPromise from '@payload-config'
import { MapPin } from 'lucide-react'
import { getPayload } from 'payload'

import { CategoryChipRow } from '@/components/filters/CategoryChipRow'
import { FilteredResultsArea } from '@/components/filters/FilteredResultsArea'
import { loadFilteredList } from '@/filteredList'
import { SlugComboboxFilter } from '@/components/filters/SlugComboboxFilter'
import { LocationsClearFiltersButton } from '@/components/locations/filters/LocationsClearFiltersButton'
import { SeeYouThereCardSkeletonGrid } from '@/components/SeeYouThereCard/SeeYouThereCardSkeleton'
import {
  hasActiveFilters,
  locationsFilters,
} from '@/components/locations/filters/locationsFilters'
import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
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
import { SeeYouThereGrid } from '@/components/SeeYouThereGrid'
import type { Category, Location, Media, Region } from '@/payload-types'
import { categoryColorClass } from '@/utilities/categoryColor'
import { populated } from '@/utilities/payloadRelations'

import { hostEventIntro } from './content'

const QUERY_LIMIT = 100

export const dynamic = 'force-dynamic'

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const payload = await getPayload({ config: configPromise })

  const { result, filters, options } = await loadFilteredList<typeof locationsFilters, 'locations', Location>({
    payload,
    searchParams,
    filters: locationsFilters,
    query: {
      collection: 'locations',
      depth: 1,
      limit: QUERY_LIMIT,
    },
  })

  const { categories, region: regions } = options

  return (
    <div className="container pt-24 pb-24">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Lokationer</h1>
      <RichText data={hostEventIntro} enableGutter={false} className="mb-10 max-w-3xl" />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {categories.length > 0 && <CategoryChipRow categories={categories} />}
        <div className="flex flex-wrap items-center gap-2">
          {regions.length > 0 && (
            <SlugComboboxFilter
              items={regions}
              paramKey="region"
              allLabel="Alle regioner"
              searchPlaceholder="Søg efter region…"
              ariaLabel="Filtrér efter region"
            />
          )}
          {hasActiveFilters(filters) && <LocationsClearFiltersButton />}
        </div>
      </div>
      <FilteredResultsArea skeleton={<SeeYouThereCardSkeletonGrid count={result.docs.length || 12} />}>
        {result.docs.length === 0 ? (
          <p>Ingen lokationer fundet.</p>
        ) : (
          <SeeYouThereGrid>
            {result.docs.map((location: Location) => {
            const region =
              typeof location.address.region === 'object' ? (location.address.region as Region) : null
            const locationCategories = (location.categories ?? []).filter(
              (c): c is Category => typeof c === 'object' && c !== null,
            )
            const image = populated<Media>(location.image)

            return (
              <SeeYouThereCard
                key={location.id}
                href={location.slug ? `/locations/${location.slug}` : undefined}
              >
                {image?.url && (
                  <SeeYouThereCardImage src={image.url} alt={image.alt ?? location.title} />
                )}
                <SeeYouThereCardOverlay intensity="soft" />
                <SeeYouThereCardHeader>
                  <SeeYouThereCardBadges className="flex-wrap">
                    {locationCategories.map((c) => (
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
      </FilteredResultsArea>
    </div>
  )
}
