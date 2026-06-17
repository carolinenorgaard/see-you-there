import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { Building2, CalendarDays, FileText, MapPin } from 'lucide-react'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
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
import { Badge } from '@/components/ui/badge'
import type { Media } from '@/payload-types'
import { populated } from '@/utilities/payloadRelations'

const collectionBadge: Record<
  'posts' | 'events' | 'locations',
  { label: string; icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }> }
> = {
  posts: { label: 'Indlæg', icon: FileText },
  events: { label: 'Begivenhed', icon: CalendarDays },
  locations: { label: 'Lokation', icon: Building2 },
}

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      doc: true,
      city: true,
      street: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
              {
                'categories.title': {
                  like: query,
                },
              },
              {
                city: {
                  like: query,
                },
              },
              {
                street: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Søg</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      <div className="container">
        {posts.totalDocs > 0 ? (
          <SeeYouThereGrid>
            {posts.docs.map((result) => {
              const relationTo = result.doc?.relationTo ?? 'posts'
              const href = result.slug ? `/${relationTo}/${result.slug}` : undefined
              const image = populated<Media>(result.meta?.image)
              const categories = (result.categories ?? []).filter(
                (c): c is { title?: string | null } => typeof c === 'object' && c !== null,
              )
              const addressLine = [result.street, result.city].filter(Boolean).join(' • ')
              const typeBadge = collectionBadge[relationTo as keyof typeof collectionBadge]

              return (
                <li key={result.id} className="contents">
                  <SeeYouThereCard href={href}>
                    {image?.url && (
                      <SeeYouThereCardImage
                        src={image.url}
                        alt={image.alt ?? result.meta?.title ?? result.title ?? ''}
                      />
                    )}
                    <SeeYouThereCardOverlay intensity="soft" />
                    <SeeYouThereCardHeader>
                      <SeeYouThereCardBadges className="flex-wrap">
                        {categories.map((c, i) => (
                          <Badge key={i}>{c.title}</Badge>
                        ))}
                      </SeeYouThereCardBadges>
                    </SeeYouThereCardHeader>
                    <SeeYouThereCardFooter>
                      <SeeYouThereCardBody>
                        <SeeYouThereCardTitle>
                          {result.meta?.title || result.title}
                        </SeeYouThereCardTitle>
                        {addressLine && (
                          <SeeYouThereCardMeta>
                            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            <span className="truncate">{addressLine}</span>
                          </SeeYouThereCardMeta>
                        )}
                      </SeeYouThereCardBody>
                      {typeBadge && (
                        <Badge variant="glass" className="shrink-0 gap-1">
                          <typeBadge.icon className="h-3 w-3" aria-hidden />
                          {typeBadge.label}
                        </Badge>
                      )}
                    </SeeYouThereCardFooter>
                  </SeeYouThereCard>
                </li>
              )
            })}
          </SeeYouThereGrid>
        ) : (
          <p>Ingen resultater fundet.</p>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `See You There Search`,
  }
}
