import { CategoryChipRow } from '@/components/filters/CategoryChipRow'
import { SlugComboboxFilter } from '@/components/filters/SlugComboboxFilter'
import type { OptionsOf } from '@/filteredList'

import { DateChipRail } from './DateChipRail'
import { EventsClearFiltersButton } from './EventsClearFiltersButton'
import { eventsFilters, hasActiveFilters, type EventsFilters } from './eventsFilters'

type EventsFilterBarProps = {
  filters: EventsFilters
  options: OptionsOf<typeof eventsFilters>
  showDate?: boolean
}

export const EventsFilterBar = ({ filters, options, showDate = true }: EventsFilterBarProps) => {
  const { categories, region: regions, location: locations } = options

  return (
    <div className="space-y-4">
      {showDate && <DateChipRail />}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
          {locations.length > 0 && (
            <SlugComboboxFilter
              items={locations}
              paramKey="location"
              allLabel="Alle lokationer"
              searchPlaceholder="Søg efter lokation…"
              ariaLabel="Filtrér efter lokation"
            />
          )}
          {hasActiveFilters(filters) && <EventsClearFiltersButton />}
        </div>
      </div>
    </div>
  )
}
