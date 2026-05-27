import { CalendarDays, Mail, MapPin, Pencil } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@/payload-types'

export type ProfileHeroUser = Pick<
  User,
  'name' | 'email' | 'zipCode' | 'city' | 'age' | 'bio'
>

export type ProfileHeroProps = {
  user: ProfileHeroUser
  attendingCount: number
  likedCount: number
  editHref?: string
}

const computeInitials = (name: string): string =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  user,
  attendingCount,
  likedCount,
  editHref = '/profile/edit',
}) => {
  const displayName = user.name || user.email
  const initials = computeInitials(displayName)

  return (
    <Card className="overflow-hidden border-0 bg-card-invert text-card-invert-foreground shadow-lg">
      <CardContent className="relative p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-6">
            <div
              aria-hidden
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-card-invert-foreground/10 text-3xl font-semibold tracking-wide ring-1 ring-card-invert-foreground/20"
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{displayName}</h1>
              <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-card-invert-foreground/80">
                <li className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" aria-hidden />
                  <span>{user.email}</span>
                </li>
                {(user.zipCode || user.city) && (
                  <li className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden />
                    <span>{[user.zipCode, user.city].filter(Boolean).join(' ')}</span>
                  </li>
                )}
                {typeof user.age === 'number' && (
                  <li className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    <span>{user.age} år</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="secondary"
              className="bg-card-invert-foreground text-card-invert hover:bg-card-invert-foreground/90"
            >
              <Link href={editHref}>
                <Pencil className="h-4 w-4" aria-hidden />
                Rediger profil
              </Link>
            </Button>
            <form action="/logout" method="POST">
              <Button
                type="submit"
                variant="ghost"
                className="text-card-invert-foreground hover:bg-card-invert-foreground/10"
              >
                Log ud
              </Button>
            </form>
          </div>
        </div>

        {user.bio && (
          <p className="mt-8 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-card-invert-foreground/90">
            {user.bio}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-8 border-t border-card-invert-border pt-6 text-sm">
          <div>
            <div className="text-2xl font-semibold">{attendingCount}</div>
            <div className="text-card-invert-foreground/70">Deltager i</div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{likedCount}</div>
            <div className="text-card-invert-foreground/70">Likede</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
