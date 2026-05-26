/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so
 * Next.js image optimization treats them as local rather than fetching
 * through `remotePatterns`, which blocks private IPs since Next.js 16.
 */
import { getServerSideURL } from './getURL'

const SERVER_URL = getServerSideURL()

export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Strip our own origin so next/image treats the path as local — its loopback-IP guard
  // rejects absolute localhost URLs.
  let relativeUrl = url
  if (SERVER_URL && relativeUrl.startsWith(SERVER_URL)) {
    relativeUrl = relativeUrl.slice(SERVER_URL.length) || '/'
  }

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${relativeUrl}?${cacheTag}` : relativeUrl
}
