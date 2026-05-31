import { CategoryChipRow } from '@/components/filters/CategoryChipRow'
import { SlugComboboxFilter } from '@/components/filters/SlugComboboxFilter'
import type { OptionsOf } from '@/filteredList'

import { LocationsClearFiltersButton } from './LocationsClearFiltersButton'
import { hasActiveFilters, locationsFilters, type LocationsFilters } from './locationsFilters'

type LocationsFilterBarProps = {
  filters: LocationsFilters
  options: OptionsOf<typeof locationsFilters>
}

export const LocationsFilterBar = ({ filters, options }: LocationsFilterBarProps) => {
  const { categories, region: regions } = options

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
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
  )
}
