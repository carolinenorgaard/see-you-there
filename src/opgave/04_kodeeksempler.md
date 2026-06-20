# Kodeeksempler

Dette afsnit zoomer ind på de steder i kodebasen, hvor der ligger en konkret beslutning bag — ikke bare boilerplate fra Payload-templaten. Hvert eksempel er valgt for at vise et princip, jeg har lænet mig op ad: DRY, komposition, sikkerhed på datalaget og delbarhed via URL'en.

## 1. Like- og deltag-knappen — én fælles toggle-fabrik

Like og RSVP gør reelt det samme: tjek at brugeren er logget ind, hent eventet, og tilføj eller fjern brugerens ID fra et `hasMany`-felt på `events`-collectionen (`likes` eller `attendees`). I stedet for at skrive to næsten identiske endpoints, lagde jeg logikken i en fabriks-funktion, `buildToggleEndpoints`, og lod hvert endpoint nøjes med en kort konfiguration.

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
export const buildToggleEndpoints = ({
  basePath,
  collection,
  field,
  responseKey,
}: ToggleConfig): Endpoint[] => [
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
          collection,
          id,
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

To detaljer er værd at bemærke:

- **`overrideAccess: true`** — vi har allerede tjekket `req.user` selv. En almindelig bruger må normalt ikke opdatere events, men her åbner vi bevidst en smal vej til præcis dette ene felt.
- **`depth: 0`** — relationerne returneres som rene ID'er i stedet for fuldt joinede dokumenter. Det er hurtigere og gør `extractIds`-hjælperens arbejde enkelt.

På frontend er `LikeButton` en client component. Mens kaldet er undervejs, deaktiveres knappen via et `loading`-flag; først når serveren har bekræftet ændringen, opdateres den lokale state, og `router.refresh()` får den omkringliggende server component til at re-rendere.

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

Knappen skifter bevidst først tilstand, når serveren har bekræftet ændringen — ikke som en optimistic update. Det er en anelse sløvere, men undgår at brugeren ser et "liket"-kort springe tilbage, hvis kaldet fejler.

Når serveren har svaret, kalder `router.refresh()` server component'et igen, så like-tallet opdateres alle steder på siden fra samme kilde i Payload. Knappen sætter også `aria-pressed={liked}`, så en skærmlæser kan annoncere, om eventet er liket eller ej.

En oplagt forbedring senere er at flytte til en faktisk optimistic update med Reacts `useOptimistic`-hook, så toggle'en føles instant og kun ruller tilbage, hvis kaldet fejler.

## 2. SeeYouThereCard — compound component i shadcn-stil

Et event-kort og et location-kort har det samme visuelle skelet: baggrundsbillede, mørk gradient i bunden, badges i toppen, titel og meta i bunden. Men indholdet er forskelligt — et event har en dato- og tidslinje samt en like-knap, mens et location har en region-badge og en adresselinje. I stedet for at lave én komponent med 15 props eller to næsten ens komponenter, byggede jeg `SeeYouThereCard` som en _compound component_ — en lille familie af sub-komponenter, der sammensættes på det enkelte brugssted. Det er det samme mønster, shadcn/ui og Radix bruger.

```tsx
// src/components/SeeYouThereCard/index.tsx (uddrag)
const SeeYouThereCard: React.FC<CardRootProps> = ({
  className,
  href,
  aspect = 'aspect-[528/325]',
  children,
  ...props
}) => {
  const content = (
    <article
      data-slot="syt-card"
      className={cn(
        'group relative w-full overflow-hidden rounded-3xl bg-card-invert text-card-invert-foreground shadow-sm',
        aspect,
        className,
      )}
      {...props}
    >
      {children}
    </article>
  )
  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {content}
      </Link>
    )
  }
  return content
}

export {
  SeeYouThereCard,
  SeeYouThereCardHeader,
  SeeYouThereCardFooter,
  SeeYouThereCardBody,
  SeeYouThereCardTitle,
  SeeYouThereCardMeta,
  SeeYouThereCardBadges,
  SeeYouThereCardImage,
  SeeYouThereCardOverlay,
}
```

På brugsstedet ser det sådan ud — strukturen er deklarativ, og forskellige varianter (event vs. location) bygges af de samme byggesten. Her er event-kortet, hvor `action`-slot'en bruges til at indsætte en `LikeButton`:

```tsx
// src/components/events/EventCard.tsx (uddrag)
<SeeYouThereCard href={`/events/${event.slug}`}>
  {image?.url && <SeeYouThereCardImage src={image.url} alt={image.alt ?? event.title} />}
  <SeeYouThereCardOverlay intensity="soft" />
  <SeeYouThereCardHeader>
    <SeeYouThereCardBadges className="flex-wrap">
      {categories.map((c) => (
        <Badge key={c.id} color={categoryColorClass(c.color)}>
          {c.title}
        </Badge>
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
        <span className="truncate">
          {formatDate(event.startDate)} • {formatTime(event.startTime)}
        </span>
      </SeeYouThereCardMeta>
    </SeeYouThereCardBody>
  </SeeYouThereCardFooter>
</SeeYouThereCard>
```

Location-kortet i `src/components/locations/LocationCard.tsx` bruger præcis samme byggesten, men bytter dato-meta ud med en adresselinje og placerer en region-badge i headerens højreside i stedet for en like-knap:

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

Tre små detaljer er værd at bemærke:

- **`data-slot`-attributter** på hver sub-komponent (fx `data-slot="syt-card-title"`) gør det muligt at style udefra med en CSS-selector — uden at skulle eksponere endnu en `titleClassName`-prop.
- **`cn()`** er en lille hjælper, der fletter klassenavne sammen og lader brugsstedet overskrive defaults.
- **Klikbart kort med synligt fokus** — når `href` er sat, wrappes kortet i `next/link` med en `focus-visible:ring`, så hele kortet er klikbart med musen, men kun viser en fokus-ring, når brugeren tabber sig dertil.

## 3. Storybook som komponent-bibliotek (og fremtidig Chromatic)

Jeg har installeret Storybook 10 (`@storybook/nextjs-vite`), så komponenter kan udvikles og dokumenteres isoleret — uden at jeg skal navigere til den rigtige side med de rigtige filtre for at se en variant. Hver komponent har en `*.stories.tsx`-fil ved siden af sig, og Storybook samler dem alle i et browsbart bibliotek på `localhost:6006`.

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

`tags: ['autodocs']` får Storybook til automatisk at generere en dokumentationsside med proptyper og eksempler — den er en ren bivirkning af komponentens TypeScript-typer, så dokumentationen ikke kan komme ud af trit med koden. Stories fungerer dermed både som en levende styleguide og som en kontrakt: hvis en story knækker visuelt, har komponenten ændret adfærd.

Storybook er ikke kun et lokalt værktøj — jeg hoster det gratis på **GitHub Pages** via en GitHub Actions-workflow i `.github/workflows/storybook.yml`. Workflowen kører `npm run build-storybook`, hver gang der pushes til `main`, og publicerer det statiske output til [carolinenorgaard.github.io/see-you-there](https://carolinenorgaard.github.io/see-you-there/). Det betyder, at designsystemet er offentligt tilgængeligt og kan deles via et link — fx til en designer, der gerne vil tjekke en komponent uden at skulle klone og køre projektet lokalt. Det er også grunden til, at Storybook fungerer som single source of truth for designsystemet, som beskrevet i [02_målgruppe_og_design.md](./02_målgruppe_og_design.md#designsystem-og-værktøjer).

På sigt vil jeg gerne tilføje **Chromatic**, som er en hosting-tjeneste lavet af Storybooks team. Chromatic kører Storybook i skyen og tager visuelle snapshots ved hvert pull request — hvis et badge utilsigtet flytter sig nogle pixels efter en CSS-ændring, fanger den det som en _visual regression_. Det er noget, hverken TypeScript-checks eller unit-tests fanger, fordi koden i sig selv stadig er "korrekt". Det er en lavthængende sikkerhedsline, der kan trækkes ind, når Storybook-biblioteket først er sat op.

## 4. Filterstate i URL'en — et lille filter-system ovenpå nuqs

Filtrene på `/events` og `/locations` (kategorier, region, lokation, dato, side) ligger i URL'en, ikke i React-state. Hvis to brugere deler "koncerter i Aarhus i denne uge" som et link, skal modtageren lande på præcis den filtrerede visning — den slags er svært at gøre rigtigt, hvis filtrene kun lever i komponent-state.

Da events- og locations-siderne fik flere og flere filtre, begyndte logikken at gentage sig: parse URL-parameter, hent option-collection fra Payload, slug → id-opslag, byg et `Where`-fragment. I stedet for at duplikere det per side, samlede jeg de fælles dele i et lille filter-system af genbrugelige byggesten ovenpå `nuqs`. Hver byggesten — ét filter — består af fire dele:

```ts
// src/filteredList/types.ts (uddrag)
export type Filter<TState = unknown, TOptions = unknown> = {
  parsers: Record<string, any>
  read: (loaded: Record<string, unknown>) => TState
  preload?: (payload: Payload) => Promise<TOptions>
  toWhere: (state: TState, options: TOptions) => Where | null
}
```

De fire dele følger filterets rejse fra et klik til en opdateret liste:

- **`parsers`** — hvad filteret hedder i URL'en. Fx oversætter `?categories=jazz,koncert` til en liste med to elementer.
- **`read`** — filterets måde at finde sin egen værdi i det fælles resultat fra URL-læsningen.
- **`preload`** — henter valgmulighederne fra databasen (fx alle kategorier). Valgfrit, fordi et simpelt til/fra-filter ikke har noget at vælge imellem.
- **`toWhere`** — oversætter brugerens valg til et databasespørgsmål: "jazz og koncert" bliver til "find events med disse kategorier". Returnerer `null`, hvis brugeren ikke har valgt noget.

`TState` og `TOptions` er bare TypeScripts måde at sige "her står typen af filterets værdi" og "her står typen af dets valgmuligheder", så hver filtertype selv beskriver sine data.

I praksis konstrueres konkrete filtre med fabriks-funktioner som `pickManyFilter`, `pickOneFilter`, `dayFilter` og `toggleFilter`. En hel side-konfiguration bliver dermed deklarativ:

```ts
// src/components/locations/filters/locationsFilters.ts (uddrag)
import { pickManyFilter, pickOneFilter } from '@/filteredList'

export const locationsFilters = {
  categories: pickManyFilter<Category>({
    paramKey: 'categories',
    collection: 'categories',
    payloadPath: 'categories',
    limit: 100,
  }),
  region: pickOneFilter<Region>({
    paramKey: 'region',
    collection: 'regions',
    payloadPath: 'address.region',
    sort: 'title',
  }),
}
```

På serveren samles det hele af `loadFilteredList`, som kører URL-parsing og option-preloads parallelt, kalder hvert filters `toWhere` og kombinerer bidragene til den endelige Payload-query. Server component'et på `/locations` reducerer dermed til et enkelt kald:

```ts
// src/app/(frontend)/locations/page.tsx (uddrag)
const { result, filters, options } = await loadFilteredList<typeof locationsFilters, 'locations', Location>({
  payload,
  searchParams,
  filters: locationsFilters,
  query: { collection: 'locations', depth: 1, limit, page },
})
```

Selve URL-synkroniseringen håndteres stadig af `nuqs`. I de fælles parsere (`src/components/filters/sharedFilterParsers.ts`) sættes `shallow: false`, hvilket er den centrale detalje: når en bruger klikker en kategori-chip, opdaterer nuqs ikke bare URL'en, den får også Next.js til at rerendere server component'et. Payload-queryen kører igen med de nye filtre, og de rigtige resultater kommer tilbage fra databasen — uden et fuldt page reload.

URL'en bruger menneskelæselige `slug`'s (`?categories=jazz,koncert`), mens Payload internt arbejder med `id`'er. `resolveIdsBySlug` oversætter imellem dem inde i filter-fabrikkerne, så hvert filter selv ejer den oversættelse. Sidegevinsterne ved at have state i URL'en er gratis: browserens frem- og tilbage-knapper virker, en filtreret side kan bogmærkes, og søgemaskiner får faktiske URL'er at indeksere — i modsætning til en SPA, hvor filtrene kun lever i browseren.

Filter-systemet betalte sig hurtigt tilbage:

- **Genbrug på tværs af sider** — events-siden bruger præcis samme `pickManyFilter`/`pickOneFilter`-byggesten, blot med `payloadPath: 'location.address.region'` (to-hop) i stedet for `address.region` (ét-hop).
- **Nye filtertyper ét sted** — fx implementeres et dato-interval som en `dayFilter`-fabrik og kan derefter sættes ind på alle relevante sider.
- **Klar arbejdsdeling** — sidekoden beskriver kun *hvilke* filtre der findes, mens *hvordan* de virker, bor i filter-systemet.

## 5. Validering af events med et `beforeValidate`-hook

En af de største fordele ved Payload — sammenlignet med en custom Express-backend — er, at forretningsregler hører hjemme på datalaget i stedet for i hver formular. På `events`-collectionen har jeg lagt et `beforeValidate`-hook, der sikrer, at slutdatoen aldrig kan ligge før startdatoen, og at sluttiden ikke kan ligge før starttiden, hvis eventet ender samme dag.

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
        const sameDay =
          start.getUTCFullYear() === end.getUTCFullYear() &&
          start.getUTCMonth() === end.getUTCMonth() &&
          start.getUTCDate() === end.getUTCDate()
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

Pointen er, at reglen gælder _uanset_ hvem der opretter eventet — admin-UI'et, en REST-klient, et fremtidigt import-script eller en mobil-app. Hvis valideringen sad i `NewEventForm.tsx`, ville en udvikler, der senere bygger et nyt opretningsflow, skulle huske at duplikere logikken. Når hooket sidder på collectionen, er det umuligt at omgå.

`ValidationError` med en eksplicit `path` på det specifikke felt får Payloads admin-UI til at fremhæve fejlen ved det rigtige inputfelt — markant bedre brugeroplevelse end en generisk fejlbesked øverst i formularen.

Samme princip bruger jeg i et `beforeChange`-hook, der automatisk tilføjer opretteren til `attendees`-listen — så reglen "opretteren deltager i sit eget event" gælder uanset hvor eventet oprettes fra.

## 6. Access control / RBAC på collection-niveau

Authorization (hvem må læse/skrive hvad) er typisk noget, der ender med at blive duplikeret over hele kodebasen — i route handlers, i sidekomponenter, måske igen i databaseforespørgsler. Payloads access control samler det hele ét sted: i collectionens config, som en funktion, der kører før hver operation.

```ts
// src/access/adminOrSelf.ts
import type { Access } from 'payload'

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}
```

Tricket er, at en access-funktion ikke bare kan returnere `true`/`false` — den kan også returnere en Payload `Where`-query. Når en almindelig bruger kalder `GET /api/users`, tilføjer Payload automatisk `{ id: { equals: user.id } }` til queryen, så brugeren kun ser sit eget dokument. En admin returnerer `true` og ser alle. Reglen er udtrykt som data, ikke som imperativ kode.

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
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        create: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
```

Bemærk _field-level access_ på `role`-feltet. En bruger har `update`-adgang til sit eget user-dokument via `adminOrSelf`, men `role`-feltet har sin egen, snævrere regel: kun admins. Det betyder, at selv om en bruger forsøger at sende en `PATCH` med `{ role: 'admin' }`, håndhæver Payload reglen på feltet og afviser ændringen — privilege escalation er afværget på datalaget i stedet for at være afhængig af, at frontend-koden husker at skjule feltet.

Resultatet er, at frontend-koden er mere uskyldig: jeg kan kalde `payload.find({ collection: 'users', overrideAccess: false })` og stole på, at Payload allerede har filtreret de dokumenter væk, som den aktuelle bruger ikke må se. Det er den slags, et headless CMS er bygget til at give gratis — så længe man husker at slå `overrideAccess` _fra_, når kaldet sker på vegne af en almindelig bruger.

## 7. Logout som POST-only — en bug der lærte mig om prefetch

En af de mest lærerige fejl i projektet handlede ikke om en algoritme eller en datamodel, men om noget så banalt som hvordan et logout-link var lavet. Oprindeligt var det bare et almindeligt link:

```tsx
// Den oprindelige (problematiske) variant
<Link href="/logout">Log ud</Link>
```

I udvikling så alt fint ud. Først efter at projektet var lagt online, opdagede jeg, at brugerne blev logget ud — helt uden at klikke på noget.

**Hvad gik galt?** Next.js har en smart funktion, der henter sider i baggrunden, så snart et link bliver synligt på skærmen. Det får navigationen til at føles lynhurtig, fordi siden er klar, før brugeren overhovedet klikker. Problemet var bare, at den "skjulte hentning" af `/logout` havde præcis samme effekt som et rigtigt klik — den loggede brugeren ud. Funktionen er slået fra under udvikling, hvilket er grunden til, at jeg ikke fangede det lokalt.

**Lidt baggrund om GET og POST.** Internettet bruger flere forskellige kaldetyper (GET, POST, PUT, DELETE m.fl.) — de to relevante her er:

- **GET** henter data og bør aldrig ændre noget på serveren.
- **POST** sender data og udfører handlinger — det er her, ændringer hører hjemme.

Min fejl var, at logout virkede på et GET-kald. Det betød, at den skjulte hentning i baggrunden kunne afslutte sessionen — uden at brugeren havde gjort noget.

**Løsningen** var at flytte logout til et POST-kald og lade frontend submitte en lille usynlig formular i stedet for at navigere til et link:

```ts
// src/app/(frontend)/(auth)/logout/route.ts
import { NextResponse } from 'next/server'
import { getServerSideURL } from '@/utilities/getURL'

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

Filen har kun en `POST`-funktion. Forsøger nogen at slå adressen op med et GET-kald, får de en fejl — sessionen kan kun afsluttes ved et bevidst klik.

**Den større lære:** handlinger, der ændrer noget, hører ikke hjemme på et GET-kald — fordi adressen kan kaldes uden et klik fra brugeren.
