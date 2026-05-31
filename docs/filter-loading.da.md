# Loading-indikator for filtre

Forklaring af hvordan skelet-indikatoren på `/events` og `/locations` virker, når brugeren klikker på et filter, en datoknap, en kategori, pagineringen eller "Ryd filtre".

## Problemet

Filtersiderne er server-komponenter. Når et filter ændres, skriver `nuqs` den nye værdi til URL'en med `shallow: false` (se `sharedFilterParsers.ts`). Det udløser en Next.js router-refresh, og server-komponenten kører sin Payload-forespørgsel igen.

Uden en pending-state ser brugeren ingen feedback — UI'et fryser fast i et par hundrede millisekunder, og de gamle resultater bliver stående indtil de nye render'er.

## Løsningen kort

Vi bruger Reacts `useTransition` til at fange den asynkrone server-roundtrip og vise et skelet i stedet for resultaterne, mens der ventes:

1. `FilterTransitionProvider` ligger i en route-`layout.tsx` (`events/layout.tsx` og `locations/layout.tsx`) og kalder `useTransition()`. Den deler `startTransition` og `isPending` ud via en React-context til alle sider under route'en.
2. Hver filter-kontrol læser `startTransition` fra contexten og giver den videre til sin `nuqs`-setter via `.withOptions({ startTransition })`. Dermed bliver URL-skrivningen en React-transition, og `isPending` er `true` indtil den nye server-render er klar.
3. `FilteredResultsArea` ligger rundt om resultatgridden. Den læser `isPending` og bytter `children` ud med et skelet-grid imens.

Hele filterbaren + resultat-sektionen deler samme transition, så ét tryk på en kategori udløser kun én pending-tilstand — også selvom flere URL-parametre nulstilles samtidigt (fx ved "Ryd filtre" eller når pagineringen følger med).

## Filer

| Fil | Rolle |
| --- | --- |
| `src/components/filters/FilterTransitionContext.tsx` | Provider + `useFilterTransition()` hook. Har en no-op fallback, så filterkomponenter også virker uden provideren (fx i Storybook). |
| `src/components/filters/FilteredResultsArea.tsx` | Wrapper omkring resultaterne. Viser `skeleton`-prop'en, når `isPending` er `true`. Sætter `aria-busy` for skærmlæsere. |
| `src/components/SeeYouThereCard/SeeYouThereCardSkeleton.tsx` | Skelet-kort bygget af de samme compound-dele som det rigtige `SeeYouThereCard` (samme `data-slot`, samme aspect-ratio). Eksporterer også `SeeYouThereCardSkeletonGrid` som renderer N skeletter i `SeeYouThereGrid`. |
| `src/app/(frontend)/events/layout.tsx` og `src/app/(frontend)/locations/layout.tsx` | Tynde route-layouts der wrapper deres `children` i `FilterTransitionProvider`. Det er her contexten leveres til siderne. |

## Flow trin for trin

```
Bruger klikker fx "Kreativ" chip
        │
        ▼
CategoryChipRow.toggle('creative')
        │
        ▼
setCategories(['creative'])         ◄── nuqs-setter
        │
        ▼  (pakket ind i startTransition via withOptions)
React.startTransition(() => router.refresh())
        │
        ├──► isPending = true
        │        │
        │        ▼
        │   FilteredResultsArea ser isPending = true
        │   → renderer <SeeYouThereCardSkeletonGrid />
        │
        ▼
Server-komponenten kører Payload-forespørgslen
        │
        ▼
Nyt RSC-payload kommer tilbage
        │
        ▼
React commit'er det nye tree → isPending = false
        │
        ▼
FilteredResultsArea renderer children (de nye kort)
```

## Hovedkomponenter — kort kode

`FilterTransitionContext.tsx`:

```tsx
const [isPending, startTransition] = useTransition()
// stilles til rådighed via context
```

Eksempel på en filter-kontrol (`CategoryChipRow`):

```tsx
const { startTransition } = useFilterTransition()
const [activeSlugs, setCategories] = useQueryState(
  'categories',
  categoriesParser.withOptions({ startTransition }),
)
```

`FilteredResultsArea.tsx`:

```tsx
const { isPending } = useFilterTransition()
return <div aria-busy={isPending}>{isPending ? skeleton : children}</div>
```

Route-`layout.tsx`:

```tsx
// src/app/(frontend)/events/layout.tsx
export default function EventsLayout({ children }: { children: ReactNode }) {
  return <FilterTransitionProvider>{children}</FilterTransitionProvider>
}
```

Brug på en side (provideren er allerede på plads via layoutet):

```tsx
<FilteredResultsArea skeleton={<SeeYouThereCardSkeletonGrid count={PAGE_SIZE} />}>
  {/* server-renderede resultater */}
</FilteredResultsArea>
```

**Bemærk:** I dag bruger `/events` og `/locations` det delte view `<FilteredListing />` ([filtered-listing.da.md](./filtered-listing.da.md)), som **selv** wrapper resultatet i `FilteredResultsArea` og bruger `PendingSkeleton`-komponenten (som læser `perPage` fra URL'en for at vælge antal skelet-kort). En ny filtreret listeside får derfor skelettet automatisk ved blot at komponere `<FilteredListing />` — du behøver ikke selv wrappe noget.

## Hvilke kontroller er tilkoblet?

Alle URL-state-ændringer på `/events` og `/locations`:

- `CategoryChipRow` (kategori-chips)
- `SlugComboboxFilter` (region- og lokation-dropdowns)
- `DateChipRail` (dato-skinnen — kun events)
- `SourceToggle` (See You There / Fællesskab — kun events)
- `PerPageSelect` (9 / 27 / 54 resultater per side)
- `EventsClearFiltersButton` og `LocationsClearFiltersButton`
- `QueryPagination`

## Sådan tilføjer du en ny filter-kontrol

1. Lav komponenten som client-component med `'use client'`.
2. Hent `startTransition` fra hook'en:
   ```tsx
   const { startTransition } = useFilterTransition()
   ```
3. Giv den videre til din `nuqs`-parser via `withOptions`, eller som andet argument til `useQueryStates`:
   ```tsx
   useQueryState('mit-param', minParser.withOptions({ startTransition }))
   // eller
   useQueryStates({ a: parserA, b: parserB }, { startTransition })
   ```
4. Brug komponenten på en side der ligger under en route med `FilterTransitionProvider` i sin `layout.tsx` (i dag `/events` og `/locations`). Skal en helt ny route have filtre, så opret en `layout.tsx` der wrapper `children` i `FilterTransitionProvider` — samme mønster som de eksisterende route-layouts.

Det er alt — så piper kontrollen automatisk ind i den delte pending-state og skeletonen vises korrekt.

## Hvorfor delt context — ikke én transition per kontrol?

Filterbaren har 5+ kontroller, og alle udløser den samme server-forespørgsel. Hvis hver kontrol havde sin egen `useTransition`, ville `isPending` kun være sand for den kontrol brugeren lige klikkede på. Det gør det svært at vise én samlet "venter på resultater"-tilstand. Med én delt transition spejler `isPending` præcis den oplevelse brugeren har: "siden henter nye resultater".

Det betyder også at "Ryd filtre", som nulstiller flere parametre på én gang, kun udløser én skelet-visning — ikke én per parameter.

## Tilgængelighed

- `FilteredResultsArea` sætter `aria-busy="true"` på wrapperen, mens der ventes. Skærmlæsere annoncerer dermed at indholdet opdateres.
- `SeeYouThereCardSkeleton` har `aria-hidden`, så placeholder-elementerne ikke læses op.

## Test

Den nemmeste manuelle test er at åbne DevTools, slå netværket ned (fx "Slow 3G"), klikke et filter og se skelettet komme frem i et par sekunder før de rigtige kort dukker op. `aria-busy="true"` kan inspiceres i Elements-fanen på wrapper-div'en omkring resultaterne.
