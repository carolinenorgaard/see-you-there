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
import { usePathname } from 'next/navigation'
import { MenuIcon, SearchIcon } from 'lucide-react'

const mobileRowClass =
  'rounded-md px-3 py-3 text-lg font-medium text-foreground hover:bg-accent'

type NavLink = NonNullable<NonNullable<HeaderType['navItems']>[number]['link']>

const resolveHref = (link: NavLink): string | null => {
  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = link.reference.value.slug
    if (!slug) return null
    if (link.reference.relationTo === 'pages') {
      return slug === 'home' ? '/' : `/${slug}`
    }
    return `/${link.reference.relationTo}/${slug}`
  }
  return link.url ?? null
}

const isActiveHref = (pathname: string | null, href: string | null): boolean => {
  if (!pathname || !href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const searchActive = isActiveHref(pathname, '/search')

  return (
    <>
      <nav className="hidden md:flex gap-3 items-center">
        {navItems.map(({ link }, i) => {
          const active = isActiveHref(pathname, resolveHref(link))
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              aria-current={active ? 'page' : undefined}
              className={cn(active && 'underline underline-offset-4 font-semibold')}
            />
          )
        })}
        <Link
          href="/search"
          aria-current={searchActive ? 'page' : undefined}
          className={cn(
            'cursor-pointer',
            searchActive && 'text-primary',
          )}
        >
          <span className="sr-only">Søg</span>
          <SearchIcon
            className={cn('w-5 text-primary', searchActive && 'stroke-[2.5]')}
          />
        </Link>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="md:hidden inline-flex cursor-pointer items-center justify-center text-primary"
            aria-label="Åbn menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 pt-12">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav className="flex flex-col px-2">
            {navItems.map(({ link }, i) => {
              const active = isActiveHref(pathname, resolveHref(link))
              return (
                <SheetClose key={i} asChild>
                  <CMSLink
                    {...link}
                    appearance="inline"
                    aria-current={active ? 'page' : undefined}
                    className={cn(mobileRowClass, active && 'bg-accent font-semibold')}
                  />
                </SheetClose>
              )
            })}
            <SheetClose asChild>
              <Link
                href="/search"
                aria-current={searchActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3',
                  mobileRowClass,
                  searchActive && 'bg-accent font-semibold',
                )}
              >
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
