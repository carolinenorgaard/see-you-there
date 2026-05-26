'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { MenuIcon, SearchIcon } from 'lucide-react'

const mobileRowClass =
  'rounded-md px-3 py-3 text-lg font-medium text-foreground hover:bg-accent'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <>
      <nav className="hidden md:flex gap-3 items-center">
        {navItems.map(({ link }, i) => (
          <CMSLink key={i} {...link} appearance="link" />
        ))}
        <Link href="/search">
          <span className="sr-only">Søg</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center text-primary"
            aria-label="Åbn menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 pt-12">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav className="flex flex-col px-2">
            {navItems.map(({ link }, i) => (
              <SheetClose key={i} asChild>
                <CMSLink {...link} appearance="inline" className={mobileRowClass} />
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Link href="/search" className={cn('flex items-center gap-3', mobileRowClass)}>
                <SearchIcon className="w-5 h-5 text-primary" />
                <span>Søg</span>
              </Link>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
