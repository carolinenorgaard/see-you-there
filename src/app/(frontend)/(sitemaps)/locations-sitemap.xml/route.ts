import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getServerSideURL } from '@/utilities/getURL'

const getLocationsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'locations',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((location) => Boolean(location?.slug))
          .map((location) => ({
            loc: `${SITE_URL}/locations/${location?.slug}`,
            lastmod: location.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['locations-sitemap'],
  {
    tags: ['locations-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getLocationsSitemap()

  return getServerSideSitemap(sitemap)
}
