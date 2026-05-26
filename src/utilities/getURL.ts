import canUseDOM from './canUseDOM'

export const getServerSideURL = () => {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  )
}

export const getAllowedOrigins = (): string[] => {
  const urls = new Set<string>()
  if (process.env.NEXT_PUBLIC_SERVER_URL) urls.add(process.env.NEXT_PUBLIC_SERVER_URL)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    urls.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  if (process.env.VERCEL_BRANCH_URL) urls.add(`https://${process.env.VERCEL_BRANCH_URL}`)
  if (process.env.VERCEL_URL) urls.add(`https://${process.env.VERCEL_URL}`)
  if (urls.size === 0) urls.add('http://localhost:3000')
  return [...urls]
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
