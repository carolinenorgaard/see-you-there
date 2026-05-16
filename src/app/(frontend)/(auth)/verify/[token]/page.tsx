import { redirect } from 'next/navigation'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const res = await fetch(`${getServerSideURL()}/api/users/verify/${token}`, {
    method: 'POST',
  })

  if (res.ok) redirect('/login?verified=1')

  return (
    <div className="container max-w-md pt-24 pb-24">
      <h1 className="text-3xl font-semibold mb-4">Verification failed</h1>
      <p>The link is invalid or has expired.</p>
    </div>
  )
}
