# `<FilteredListing />` — det delte view-modul

Den delte page-level shell som `/events` og `/locations` (og fremtidige filtrerede arkivsider) komponerer omkring deres resultat. Den ejer container-padding, header-placering, filter-bar-rækken, `PerPageSelect`, grid + skelet, og pagination.

Komplementært til [filtered-list.da.md](./filtered-list.da.md) (filter-systemet på serveren) og [filter-loading.da.md](./filter-loading.da.md) (skelet/pending-state).

## Hvor det bor

- `src/components/FilteredListing/FilteredListing.tsx` — selve komponenten
- `src/components/FilteredListing/PendingSkeleton.tsx` — skelet-grid der læser `perPage` fra URL'en
- `src/components/FilteredListing/index.ts` — public eksport (`FilteredListing`)
- `src/components/FilteredListing/FilteredListing.stories.tsx` — Storybook-eksempler (`WithItems`, `Empty`, `Paginated`)
- `tests/int/FilteredListing.int.spec.tsx` — komponent-spec (slots, pagination on/off, per-page on/off, tom-tilstand)

## Kontrakten

```tsx
type FilteredListingProps<Doc extends { id: string | number }> = {
  result: PaginatedDocs<Doc>      // resultatet fra loadFilteredList
  header: ReactNode               // titel + evt. toggle (top af siden)
  filterBar: ReactNode            // filter-kontroller (chips, dropdowns …)
  empty: ReactNode                // vises når result.docs er tom
  renderItem: (doc: Doc) => ReactNode // én item i griddet
}
```

Komponenten er generisk over `Doc` — pages binder typen til fx `Event` eller `Location`.

## Hvad den selv sørger for

1. **Container + padding** (`container pt-24 pb-24`) — pages skal ikke sætte deres egen.
2. **Header + filter-bar layout** — header øverst, filter-bar i en flex-række med `PerPageSelect` til højre.
3. **Per-page-selector** vises kun når `result.totalDocs > PER_PAGE_OPTIONS[0]` (= 9). Ingen grund til at vælge "9 per side" når der er færre end 9 i alt.
4. **Grid eller empty-state** — viser `SeeYouThereGrid` med `renderItem` når der er docs, ellers `empty`-slottet.
5. **Pending-skelet** — wrapper griddet i `<FilteredResultsArea>` med `<PendingSkeleton />`, så skelettet vises automatisk under filter-ændringer. `PendingSkeleton` læser `perPage` for at vælge antal skelet-kort (matcher det forventede grid-layout).
6. **Pagination** — `<QueryPagination>` rendres kun når `totalPages > 1`.
7. **Scroll-til-top anker** — div'en `id="filtered-listing-top"` ligger lige over resultatområdet. `PerPageSelect` og `QueryPagination` scroller dertil med `behavior: 'smooth'` så brugeren ikke ender langt nede på siden efter et sidetal-skift.

## Brug på en side

```tsx
// src/app/(frontend)/events/page.tsx
return (
  <FilteredListing<Event>
    result={result}
    header={
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Begivenhedsvæg</h1>
        <SourceToggle active={filters.source} />
      </div>
    }
    filterBar={<EventsFilterBar filters={filters} options={options} />}
    empty={<EmptyEventsMessage filters={filters} />}
    renderItem={(event) => <EventCard event={event} action={…} />}
  />
)
```

Locations-siden følger samme mønster — se `src/app/(frontend)/locations/page.tsx`.

## Forudsætninger

- Siden skal være wrapped i `FilterTransitionProvider` (de eksisterende `events/layout.tsx` og `locations/layout.tsx` gør det). Uden den falder `PendingSkeleton`/`FilteredResultsArea` tilbage på en no-op transition og kan stadig renderes — du får bare ingen skelet-feedback. Se [filter-loading.da.md](./filter-loading.da.md).
- Pages skal stadig parse `page` og `perPage` selv via `createLoader({ page: pageParser, perPage: perPageParser })` og sende dem ind i `loadFilteredList`s `query`-objekt. `FilteredListing` rendrer dem kun — den henter dem ikke.

## Tilføj en ny filtreret listeside — opskrift

1. Lav en `layout.tsx` for route'en der wrapper `children` i `<FilterTransitionProvider>` (medmindre route'en allerede ligger under en).
2. I `page.tsx`: parse `page`/`perPage`, kald `loadFilteredList`, og returnér `<FilteredListing<Doc> … />`.
3. Skriv en filter-deklaration (`xxxFilters`) — se [filtered-list.da.md](./filtered-list.da.md).
4. Komponér din egen `header`, `filterBar`, `empty`, og `renderItem` — ingen container-/grid-/pagination-/skelet-kode hører hjemme her.

## Test

Komponent-testen i `tests/int/FilteredListing.int.spec.tsx` stubber `QueryPagination` og `PerPageSelect` (de bruger nuqs + transition-context) og dækker:

- empty-slot vs `renderItem` over docs
- per-page-selector vises/skjules afhængigt af `totalDocs`
- pagination vises/skjules afhængigt af `totalPages`
- header- og filter-bar-slots renderes

Kør:

```bash
npx vitest run --config ./vitest.config.mts tests/int/FilteredListing.int.spec.tsx
```
