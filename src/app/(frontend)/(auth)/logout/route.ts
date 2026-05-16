import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  await fetch(`${getServerSideURL()}/api/users/logout`, {
    method: 'POST',
    headers: { cookie },
  }).catch(() => null)

  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('payload-token', '', { path: '/', maxAge: 0 })
  return res
}
