'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/utilities/ui'

const Command: React.FC<React.ComponentProps<typeof CommandPrimitive>> = ({
  className,
  ...props
}) => (
  <CommandPrimitive
    data-slot="command"
    className={cn(
      'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
      className,
    )}
    {...props}
  />
)

const CommandInput: React.FC<React.ComponentProps<typeof CommandPrimitive.Input>> = ({
  className,
  ...props
}) => (
  <div data-slot="command-input-wrapper" className="flex items-center gap-2 border-b px-3">
    <Search className="size-4 shrink-0 text-neutral-500" aria-hidden />
    <CommandPrimitive.Input
      data-slot="command-input"
      className={cn(
        'flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
)

const CommandList: React.FC<React.ComponentProps<typeof CommandPrimitive.List>> = ({
  className,
  ...props
}) => (
  <CommandPrimitive.List
    data-slot="command-list"
    className={cn('max-h-72 overflow-x-hidden overflow-y-auto', className)}
    {...props}
  />
)

const CommandEmpty: React.FC<React.ComponentProps<typeof CommandPrimitive.Empty>> = (props) => (
  <CommandPrimitive.Empty
    data-slot="command-empty"
    className="py-6 text-center text-sm text-neutral-500"
    {...props}
  />
)

const CommandGroup: React.FC<React.ComponentProps<typeof CommandPrimitive.Group>> = ({
  className,
  ...props
}) => (
  <CommandPrimitive.Group
    data-slot="command-group"
    className={cn(
      'text-popover-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500',
      className,
    )}
    {...props}
  />
)

const CommandSeparator: React.FC<React.ComponentProps<typeof CommandPrimitive.Separator>> = ({
  className,
  ...props
}) => (
  <CommandPrimitive.Separator
    data-slot="command-separator"
    className={cn('-mx-1 h-px bg-neutral-200', className)}
    {...props}
  />
)

const CommandItem: React.FC<React.ComponentProps<typeof CommandPrimitive.Item>> = ({
  className,
  ...props
}) => (
  <CommandPrimitive.Item
    data-slot="command-item"
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-neutral-100 data-[selected=true]:text-neutral-900 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
)

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
}
