'use client'

import { MapPin } from 'lucide-react'
import { useQueryState } from 'nuqs'

import type { Region } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { eventsFilterParsers } from './eventsFilters'

const ALL_REGIONS = '__all__'

export const RegionSelect = ({ regions }: { regions: Region[] }) => {
  const [rawSlug, setRegion] = useQueryState('region', eventsFilterParsers.region)
  const activeSlug = rawSlug || null

  return (
    <Select
      value={activeSlug ?? ALL_REGIONS}
      onValueChange={(value) => setRegion(value === ALL_REGIONS ? null : value)}
    >
      <SelectTrigger aria-label="Filter by region" className="h-10 w-auto min-w-44 rounded-full">
        <MapPin className="text-neutral-500" aria-hidden />
        <SelectValue placeholder="All regions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_REGIONS}>All regions</SelectItem>
        {regions.map((region) => (
          <SelectItem key={region.id} value={region.slug ?? String(region.id)}>
            {region.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
