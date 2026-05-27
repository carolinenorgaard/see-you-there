# Kodeeksempler

Dette afsnit zoomer ind på de steder i kodebasen, hvor der ligger en konkret beslutning bag — ikke bare boilerplate fra Payload-templaten. Hvert eksempel er valgt for at vise et princip jeg har lænet mig op ad: DRY, komposition, sikkerhed på datalaget, og delbarhed via URL'en.

## 1. Like- og deltag-knappen — én fælles toggle-fabrik

Like og RSVP gør reelt det samme: tjek at brugeren er logget ind, hent eventet, og tilføj eller fjern brugerens ID fra et `hasMany`-felt på `events`-collectionen (`likes` eller `attendees`). I stedet for at skrive to næsten identiske endpoints lagde jeg logikken i en fabriks-funktion, `buildToggleEndpoints`, og lod hvert endpoint nøjes med en kort konfiguration.

```ts
// src/endpoints/like.ts
import { buildToggleEndpoints } from './toggleRelationship'

export const likeEndpoints = buildToggleEndpoints({
  basePath: '/:id/like',
  collection: 'events',
  field: 'likes',
  responseKey: 'liked',
})
```

`rsvp.ts` er det samme med `field: 'attendees'`. Hele toggle-logikken bor ét sted:

```ts
// src/endpoints/toggleRelationship.ts (forkortet)
export const buildToggleEndpoints = ({ basePath, collection, field, responseKey }: ToggleConfig): Endpoint[] => [
  {
    path: basePath,
    method: 'post',
    handler: async (req) => {
      if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
      const id = getId(req)
      const doc = await req.payload.findByID({ collection, id, depth: 0 })
      const current = extractIds((doc as Record<string, unknown>)[field])
      const userId = req.user.id
      if (!current.includes(userId)) {
        await req.payload.update({
          collection, id,
          data: { [field]: [...current, userId] } as never,
          overrideAccess: true,
        })
      }
      return Response.json({ ok: true, [responseKey]: true })
    },
  },
  // DELETE-handleren spejler POST og filtrerer userId fra arrayet i stedet
]
```

To detaljer er værd at bemærke: `overrideAccess: true` bruges fordi vi allerede har valideret `req.user` selv — vi har bevidst lukket op for at almindelige brugere kan opdatere et event, men *kun* via den her smalle vej. Og `depth: 0` gør at relationerne returneres som rene ID'er i stedet for fuldt joinede dokumenter, hvilket både er hurtigere og gør `extractIds`-hjælperen unødvendigt.

På frontend er `LikeButton` en client component. Mens kaldet er undervejs disables knappen via en `loading`-flag; først når serveren har bekræftet ændringen, opdateres den lokale state og `router.refresh()` får den omkringliggende server component til at re-rendere.

```tsx
// src/components/events/LikeButton.tsx (uddrag)
const toggle = async (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  setLoading(true)
  try {
    await authFetch(`/api/events/${eventId}/like`, {
      method: liked ? 'DELETE' : 'POST',
    })
    setLiked(!liked)
    setCount((c) => c + (liked ? -1 : 1))
    router.refresh()
  } catch (err) {
    console.error('Like toggle failed', err)
  } finally {
    setLoading(false)
  }
}
```

Det er en bevidst sekventiel flow, ikke en optimistic update: jeg venter på at serveren bekræfter inden jeg ændrer knappens tilstand. Det er en lille sløvere oplevelse end et rent optimistic toggle, men det undgår at brugeren ser et "liket"-kort der bagefter springer tilbage hvis kaldet fejler. Når serveren har svaret, kalder `router.refresh()` server component'et igen, så like-tallet på begge kort (og evt. like-listen et andet sted på siden) opdateres fra samme single source of truth i Payload. Knappen sætter også `aria-pressed={liked}`, så en skærmlæser kan annoncere om eventet er liket eller ej.

En oplagt forbedring senere er at flytte til en faktisk optimistic update med Reacts `useOptimistic`-hook, så toggle'en føles instant og kun revertes hvis kaldet fejler.

## 2. SeeYouThereCard — compound component i shadcn-stil

Et event-card og et location-card har det samme visuelle skelet: baggrundsbillede, mørk gradient i bunden, badges i toppen, titel og meta i bunden. Men indholdet er forskelligt — et event har en dato- og tidslinje samt en like-knap, mens et location har en region-badge og en adresselinje. I stedet for at lave én komponent med 15 props eller to næsten ens komponenter, byggede jeg `SeeYouThereCard` som en *compound component* — en lille familie af sub-komponenter der composeres på callsiten. Det er det samme mønster shadcn/ui og Radix bruger.

```tsx
// src/components/SeeYouThereCard/index.tsx (uddrag)
const SeeYouThereCard: React.FC<CardRootProps> = ({ className, href, aspect = 'aspect-[528/325]', children, ...props }) => {
  const content = (
    <article
      data-slot="syt-card"
      className={cn('group relative w-full overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-sm', aspect, className)}
      {...props}
    >
      {children}
    </article>
  )
  if (href) {
    return (
      <Link href={href} className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        {content}
      </Link>
    )
  }
  return content
}

export { SeeYouThereCard, SeeYouThereCardHeader, SeeYouThereCardFooter, SeeYouThereCardBody,
         SeeYouThereCardTitle, SeeYouThereCardMeta, SeeYouThereCardBadges,
         SeeYouThereCardImage, SeeYouThereCardOverlay }
```

På callsiten ser det sådan ud — strukturen er deklarativ og forskellige varianter (event vs. location) bygges af de samme byggesten. Her er event-kortet, hvor `action`-slot'en bruges til at injicere en `LikeButton`:

```tsx
// src/components/events/EventCard.tsx (uddrag)
<SeeYouThereCard href={`/events/${event.slug}`}>
  {image?.url && <SeeYouThereCardImage src={image.url} alt={image.alt ?? event.title} />}
  <SeeYouThereCardOverlay intensity="soft" />
  <SeeYouThereCardHeader>
    <SeeYouThereCardBadges className="flex-wrap">
      {categories.map((c) => (
        <Badge key={c.id} color={categoryColorClass(c.color)}>{c.title}</Badge>
      ))}
    </SeeYouThereCardBadges>
    {action && <div className="shrink-0">{action}</div>}
  </SeeYouThereCardHeader>
  <SeeYouThereCardFooter>
    <SeeYouThereCardBody>
      <SeeYouThereCardTitle>{event.title}</SeeYouThereCardTitle>
      {location && (
        <SeeYouThereCardMeta>
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{location.title}</span>
        </SeeYouThereCardMeta>
      )}
      <SeeYouThereCardMeta>
        <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate">{formatDate(event.startDate)} • {formatTime(event.startTime)}</span>
      </SeeYouThereCardMeta>
    </SeeYouThereCardBody>
  </SeeYouThereCardFooter>
</SeeYouThereCard>
```

Location-kortet i `src/app/(frontend)/locations/page.tsx` bruger præcis samme primitives, men bytter dato-meta ud med en adresselinje og smider en region-badge i headerens højreside i stedet for en like-knap:

```tsx
<SeeYouThereCardHeader>
  <SeeYouThereCardBadges className="flex-wrap">
    {locationCategories.map((c) => (
      <Badge key={c.id} color={categoryColorClass(c.color)}>{c.title}</Badge>
    ))}
  </SeeYouThereCardBadges>
  {region && <Badge variant="glass" size="md">{region.title}</Badge>}
</SeeYouThereCardHeader>
<SeeYouThereCardFooter>
  <SeeYouThereCardBody>
    <SeeYouThereCardTitle>{location.title}</SeeYouThereCardTitle>
    <SeeYouThereCardMeta>
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="truncate">{location.address.street} • {location.address.city}</span>
    </SeeYouThereCardMeta>
  </SeeYouThereCardBody>
</SeeYouThereCardFooter>
```

Hver sub-komponent får et `data-slot`-attribut (fx `data-slot="syt-card-title"`), så jeg kan style udefra med en CSS-selector hvis det bliver nødvendigt, uden at skulle eksponere endnu en `titleClassName`-prop. `cn()` er en lille hjælper der fletter klassenavne sammen og lader callsiten override defaults. Når `href` er sat, wrappes hele kortet i `next/link` med en `focus-visible:ring` — så hele kortet er klikbart med musen, men kun viser en synlig fokus-ring når brugeren tabber sig dertil.

## 3. Storybook som komponent-bibliotek (og fremtidig Chromatic)

Jeg har installeret Storybook 9 (`@storybook/nextjs-vite`), så komponenter kan udvikles og dokumenteres isoleret — uden at jeg skal navigere til den rigtige side med de rigtige filtre for at se en variant. Hver komponent har en `*.stories.tsx`-fil ved siden af sig, og Storybook samler dem alle i et browsbart bibliotek på `localhost:6006`.

```tsx
// src/components/SeeYouThereCard/SeeYouThereCard.stories.tsx (uddrag)
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof SeeYouThereCard> = {
  title: 'Components/SeeYouThereCard',
  component: SeeYouThereCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta

export const FeaturedEvent: StoryObj<typeof SeeYouThereCard> = {
  render: () => (
    <SeeYouThereCard>
      <SeeYouThereCardImage src={canalSide} alt="Canal side at night" />
      <SeeYouThereCardOverlay />
      {/* … header, footer, badges … */}
    </SeeYouThereCard>
  ),
}
```

`tags: ['autodocs']` får Storybook til automatisk at generere en dokumentationsside med proptyper og eksempler — den er ren bivirkning af komponentens TypeScript-typer, så dokumentationen kan ikke komme ud af sync med koden. Stories fungerer dermed både som en levende styleguide og som en kontrakt: hvis en story knækker visuelt, har komponenten ændret adfærd.

På sigt vil jeg gerne tilføje **Chromatic**, som er en hosting-tjeneste lavet af Storybooks team. Chromatic kører Storybook i skyen og tager visuelle snapshots ved hvert pull request — hvis et badge utilsigtet flytter sig nogle pixels efter en CSS-ændring, fanger den det som en *visual regression*. Det er noget hverken TypeScript-checks eller unit-tests fanger, fordi koden i sig selv er stadig "korrekt". Det er en lavt hængende sikkerhedsline, der kan trækkes ind når Storybook-biblioteket først er sat op.

## 4. Filterstate i URL'en med nuqs

Filtrene på `/events` og `/locations` (kategorier, region, lokation, side) ligger i URL'en, ikke i React-state. Hvis to brugere deler "koncerter i Aarhus i denne uge" som et link, skal modtageren lande på præcis den filtrerede visning — den slags er svært at gøre rigtigt hvis filtrene kun lever i komponent-state.

Jeg bruger `nuqs` som en typesikker bro mellem URL'en og React. Parserne er trukket ud i en delt fil, så samme `?categories=jazz,rock` virker både på events- og locations-siden.

```ts
// src/components/filters/sharedFilterParsers.ts (uddrag)
import { parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs/server'

// shallow:false triggers a Next.js router refresh on each write so the
// server component re-runs the Payload query with the new filters.
export const serverSyncOptions = { shallow: false } as const

export const categoriesParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions(serverSyncOptions)

export const slugParser = parseAsString
  .withDefault('')
  .withOptions({ ...serverSyncOptions, clearOnDefault: true })
```

`shallow: false` er den centrale detalje: når en bruger klikker en kategori-chip, opdaterer nuqs ikke bare URL'en, den får også Next.js til at rerendere server component'et. Det betyder at Payload-queryen kører igen med de nye filtre, og de rigtige events kommer tilbage fra databasen — uden et fuldt page reload.

På serveren samles URL-parametrene til en Payload `Where`-query:

```ts
// src/components/locations/filters/locationsFilters.ts (uddrag)
export const loadLocationsFilters = createLoader({
  categories: categoriesParser,
  region: regionParser,
})

export const buildLocationsWhere = (
  filters: ParsedLocationFilters,
  { categories, regions }: { categories: Category[]; regions: Region[] },
): Where => {
  const categoryIds = resolveIdsBySlug(filters.categorySlugs, categories)
  const regionId = resolveIdBySlug(filters.regionSlug, regions)

  const where: Where = {}
  if (categoryIds.length) where.categories = { in: categoryIds }
  if (regionId !== null) where['address.region'] = { equals: regionId }
  return where
}
```

URL'en bruger menneske-læselige `slug`'s (`?categories=jazz,koncert`), mens Payload internt arbejder med `id`'s. `resolveIdsBySlug` mapper imellem dem. Sidegevinsterne ved at have state i URL'en er gratis: browserens fremad/tilbage-knapper virker, en filtreret side kan bookmarkes, og søgemaskiner får faktiske URL'er at indeksere — i modsætning til en SPA med usynlige client-side filtre.

Det samme resultat kunne i princippet være opnået med en håndskrevet `linkBuilder`-funktion der serialiserer filtre til en query string, kombineret med Next.js' indbyggede `searchParams` i server components. Det ville fjerne en dependency, men ville samtidig betyde at jeg selv skulle holde styr på parsing, defaults, type-safety og immutable updates på tværs af events- og locations-siderne. `nuqs` giver mig alt det ud af kassen i ét konsistent API, som både server og client komponenter bruger på samme måde — og det er den ensartethed jeg har prioriteret over at undgå én ekstra dependency.

## 5. Validering af events med et `beforeValidate`-hook

En af de største fordele ved Payload — sammenlignet med en custom Express-backend — er at forretningsregler hører hjemme på datalaget i stedet for i hver formular. På `events`-collectionen har jeg lagt et `beforeValidate`-hook der sikrer at slutdatoen aldrig kan ligge før startdatoen, og at sluttiden ikke kan ligge før starttiden hvis eventet ender samme dag.

```ts
// src/collections/Events.ts (uddrag)
hooks: {
  beforeValidate: [
    ({ data, req }) => {
      if (!data?.startDate || !data?.endDate) return data
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      const errors: { message: string; path: string }[] = []

      if (end < start) {
        errors.push({ path: 'endDate', message: 'End date must be on or after start date.' })
      } else {
        const sameDay = start.toDateString() === end.toDateString()
        if (sameDay && data.startTime && data.endTime &&
            new Date(data.endTime) < new Date(data.startTime)) {
          errors.push({ path: 'endTime', message: 'End time must be on or after start time …' })
        }
      }

      if (errors.length > 0) throw new ValidationError({ collection: 'events', errors, req })
      return data
    },
  ],
}
```

Pointen er at reglen gælder *uanset* hvem der opretter eventet — admin-UI'et, en REST-klient, et fremtidigt import-script eller en mobil-app. Hvis valideringen sad i `NewEventForm.tsx`, ville en udvikler der senere bygger et nyt opretningsflow skulle huske at duplikere logikken. Når hookket sidder på collectionen, er det umuligt at omgå.

`ValidationError` med en eksplicit `path` på det specifikke felt får Payloads admin-UI til at fremhæve fejlen ved det rigtige inputfelt — markant bedre brugeroplevelse end en generisk fejlbesked øverst i formularen.

I `beforeChange` har jeg desuden en lille bekvemmelighed: når en bruger opretter et event, tilføjes de automatisk til `attendees`-listen, så de straks er tilmeldt deres eget event.

## 6. Access control / RBAC på collection-niveau

Authorization (hvem må læse/skrive hvad) er typisk noget der ender med at blive duplikeret over hele kodebasen — i route handlers, i sidekomponenter, måske igen i databaseforespørgsler. Payloads access control samler det hele ét sted: i collectionens config, som en funktion der kører før hver operation.

```ts
// src/access/adminOrSelf.ts
import type { Access } from 'payload'

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}
```

Tricket er at en access-funktion ikke bare kan returnere `true`/`false` — den kan også returnere en Payload `Where`-query. Når en almindelig bruger kalder `GET /api/users`, vil Payload automatisk tilføje `{ id: { equals: user.id } }` til queryen, så hun kun ser sit eget dokument. En admin returnerer `true` og ser alle. Reglen er udtrykt som data, ikke som imperativ kode.

På `Users`-collectionen er det bundet sammen sådan her:

```ts
// src/collections/Users/index.ts (uddrag)
export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: admin,
    create: anyone,
    delete: admin,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  fields: [
    // …
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [{ label: 'User', value: 'user' }, { label: 'Admin', value: 'admin' }],
      access: {
        create: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
```

Bemærk *field-level access* på `role`-feltet. En bruger har `update`-adgang til sit eget user-dokument via `adminOrSelf`, men `role`-feltet har sin egen, snævrere regel: kun admins. Det betyder at selv om en bruger kunne sende en `PATCH` med `{ role: 'admin' }`, ville Payload stille og roligt strippe det felt fra payloaden inden update'et rammer databasen. Privilege escalation er afværget på datalaget i stedet for at være afhængig af at frontend-koden husker at skjule feltet.

Resultatet er at frontend-koden er mere uskyldig: jeg kan kalde `payload.find({ collection: 'users', overrideAccess: false })` og stole på at Payload allerede har filtreret dokumenter væk som den aktuelle bruger ikke må se. Det er den slags ting et headless CMS er bygget til at give gratis, hvis man husker at slå `overrideAccess` *fra* når kaldet sker på vegne af en almindelig bruger.
