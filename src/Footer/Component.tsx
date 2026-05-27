import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram, Mail, Twitter } from 'lucide-react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const linkSections = [
  {
    heading: 'Udforsk',
    links: [
      { label: 'Begivenheder', href: '/events' },
      { label: 'Lokationer', href: '/locations' },
      { label: 'Indlæg', href: '/posts' },
      { label: 'Søg', href: '/search' },
    ],
  },
  {
    heading: 'Konto',
    links: [
      { label: 'Log ind', href: '/login' },
      { label: 'Opret konto', href: '/signup' },
      { label: 'Min profil', href: '/profile' },
      { label: 'Opret en begivenhed', href: '/events/new' },
    ],
  },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-cream">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link className="inline-flex items-center" href="/">
              <Logo light />
            </Link>
            <p className="text-sm text-cream/70 max-w-xs">
              See You There samler mennesker omkring oplevelser — koncerter, bogklubber, yoga,
              sammenkomster og alt derimellem. Find noget at lave, eller skab det selv.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/80 transition hover:border-white hover:text-cream"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {linkSections.map(({ heading, links }) => (
            <div key={heading}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-cream/90 mb-4">
                {heading}
              </h2>
              <ul className="flex flex-col gap-2 text-sm text-cream/70">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-cream transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cream/90 mb-4">
              Kontakt
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-cream/70">
              <li>
                <a
                  href="mailto:seeyoutheredk@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-cream transition"
                >
                  <Mail className="h-4 w-4" />
                  seeyoutheredk@gmail.com
                </a>
              </li>
              <li>København, Danmark</li>
            </ul>
            <p className="mt-6 text-xs text-cream/50">
              Har du spørgsmål eller forslag? Vi hører gerne fra dig.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-cream/60">
            © {year} See You There. Alle rettigheder forbeholdes.
          </p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-cream/70">
            {navItems.map(({ link }, i) => (
              <CMSLink className="hover:text-cream transition" key={i} {...link} />
            ))}
            <ThemeSelector />
          </nav>
        </div>
      </div>
    </footer>
  )
}
