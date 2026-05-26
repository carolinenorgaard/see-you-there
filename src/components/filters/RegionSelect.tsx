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

import { regionParser } from './sharedFilterParsers'

const ALL_REGIONS = '__all__'

export const RegionSelect = ({ regions }: { regions: Region[] }) => {
  const [rawSlug, setRegion] = useQueryState('region', regionParser)
  const activeSlug = rawSlug || null

  return (
    <Select
      value={activeSlug ?? ALL_REGIONS}
      onValueChange={(value) => setRegion(value === ALL_REGIONS ? null : value)}
    >
      <SelectTrigger aria-label="Filtrér efter region" className="h-10 w-auto min-w-44 rounded-full">
        <MapPin className="text-neutral-500" aria-hidden />
        <SelectValue placeholder="Alle regioner" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_REGIONS}>Alle regioner</SelectItem>
        {regions.map((region) => (
          <SelectItem key={region.id} value={region.slug ?? String(region.id)}>
            {region.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
