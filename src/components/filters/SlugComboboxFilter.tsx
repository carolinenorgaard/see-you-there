'use client'

import { Check, ChevronDown, MapPin, type LucideIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

import { slugParser } from './sharedFilterParsers'

const ALL_VALUE = '__all__'

type Item = { id: string | number; title: string; slug?: string | null }

type Props<T extends Item> = {
  items: T[]
  paramKey: string
  allLabel: string
  searchPlaceholder: string
  ariaLabel: string
  icon?: LucideIcon
}

const itemSlug = (item: Item): string => item.slug ?? String(item.id)

export const SlugComboboxFilter = <T extends Item>({
  items,
  paramKey,
  allLabel,
  searchPlaceholder,
  ariaLabel,
  icon: Icon = MapPin,
}: Props<T>) => {
  const [activeSlug, setSlug] = useQueryState(paramKey, slugParser)
  const [open, setOpen] = useState(false)

  const activeItem = items.find((i) => itemSlug(i) === activeSlug) ?? null

  const choose = (value: string) => {
    setSlug(value === ALL_VALUE ? null : value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            'border-input flex h-10 min-w-44 cursor-pointer items-center gap-2 rounded-full border bg-transparent px-3 text-sm shadow-xs transition-colors',
            'focus-visible:ring-ring/40 focus-visible:ring-4 focus-visible:outline-1',
          )}
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span
            className={cn('flex-1 truncate text-left', !activeItem && 'text-muted-foreground')}
          >
            {activeItem?.title ?? allLabel}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Ingen resultater</CommandEmpty>
            <CommandGroup>
              <CommandItem value={allLabel} onSelect={() => choose(ALL_VALUE)}>
                <span className="flex-1">{allLabel}</span>
                <Check className={cn('size-4', activeSlug ? 'opacity-0' : 'opacity-100')} />
              </CommandItem>
              {items.map((item) => {
                const slug = itemSlug(item)
                const selected = slug === activeSlug
                return (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => choose(slug)}
                  >
                    <span className="flex-1 truncate">{item.title}</span>
                    <Check className={cn('size-4', selected ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
