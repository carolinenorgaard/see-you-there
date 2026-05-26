# Logout must be POST, not GET — Convention

## Context

In production on Vercel, users were being silently logged out on the next navigation after visiting `/profile`. The same code worked fine in `next dev`.

Root cause: `/logout` was a `GET` route handler that cleared the `payload-token` cookie. `/profile` rendered a `<Link href="/logout">` for the "Log ud" button. In production, Next.js **automatically prefetches every `<Link>` in the viewport** by issuing a `GET` to the target URL. The prefetch executed the logout handler, the browser applied the `Set-Cookie: payload-token=; Max-Age=0` from the response, and the user was logged out without ever clicking the link.

`next dev` disables automatic `<Link>` prefetch, which is why it never reproduced locally.

## Convention

Any route handler that mutates server or client state — clearing cookies, deleting records, sending email, toggling flags — must respond to `POST` (or `DELETE` / `PUT` / `PATCH`), never `GET`. `GET` handlers must be safe and idempotent.

In the UI, trigger such handlers with a `<form method="POST">` and a submit button, not with `<Link>` or `<a href>`. Forms are never prefetched.

## Example — the logout flow

`src/app/(frontend)/(auth)/logout/route.ts`:

```ts
export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  await fetch(`${getServerSideURL()}/api/users/logout`, {
    method: 'POST',
    headers: { cookie },
  }).catch(() => null)

  const res = NextResponse.redirect(new URL('/', req.url), { status: 303 })
  res.cookies.set('payload-token', '', { path: '/', maxAge: 0 })
  return res
}
```

`src/components/profile/ProfileHero.tsx`:

```tsx
<form action="/logout" method="POST">
  <Button type="submit" variant="ghost">Log ud</Button>
</form>
```

Notes:

- Redirect with status **303** so the browser follows the POST→GET to `/` cleanly.
- No client JS required — works without hydration.
- The `<form>` is non-prefetchable, so Next won't accidentally clear the cookie when the profile page renders.

## Symptom to recognise next time

If something that should only happen on user action is happening from a render — cookies disappearing, records mutating, emails firing — check whether a `<Link>` points at a `GET` route handler with side effects. The fix is almost always: switch the handler to `POST` and the trigger to a `<form>`.
