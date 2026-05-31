# nuqs Usage — Convention

## Context

The project uses `nuqs@2.8.9` to manage URL query state for archive filters (events, locations), pagination, and search-adjacent UI.

The question was raised earlier whether nuqs was needed, since most params drive navigation rather than client state and a `<Link>` + link-builder util would work for chips and pagination. After weighing it, **we chose to keep nuqs everywhere for URL-driven filter/pagination UI.** Consistency across the filter stack beats the marginal wins of a mixed approach.

This document records the convention and where it applies.

## Convention

For any UI that reads or writes a query param, use nuqs. Do **not** mix nuqs with hand-rolled `<Link href="?foo=bar">` link-builders on the same surface — pick one and stick with it. We pick nuqs.

Reach for the shared parsers in `src/components/filters/sharedFilterParsers.ts` rather than constructing parsers ad hoc.

Use `useQueryStates` (not `useQueryState`) when changing a filter must also reset `page` atomically — see `DateChipRail` / `SourceToggle`.

## Current Usage Inventory

**Package:** `nuqs@2.8.9`

**Adapter:** `<NuqsAdapter>` wraps the app at `src/app/(frontend)/layout.tsx:42`.

**Client hooks (`useQueryState` / `useQueryStates`):**

| Component | File | Param(s) | Parser / options |
|---|---|---|---|
| `CategoryChipRow` | `src/components/filters/CategoryChipRow.tsx` | `categories[]` | `categoriesParser` (shared) |
| `SlugComboboxFilter` | `src/components/filters/SlugComboboxFilter.tsx` | dynamic (`region`, `location`) | `slugParser` (shared) |
| `QueryPagination` | `src/components/Pagination/QueryPagination.tsx` | `page` | `pageParser` (shared) |
| `PerPageSelect` | `src/components/filters/PerPageSelect.tsx` | `perPage` + `page` | `useQueryStates` — resets `page` on per-page change |
| `PendingSkeleton` | `src/components/FilteredListing/PendingSkeleton.tsx` | `perPage` (read-only) | `perPageParser` (shared) — picks skeleton count |
| `SourceToggle` | `src/components/events/SourceToggle.tsx` | `source` + `page` | `useQueryStates` — resets `page` on source change |
| `DateChipRail` | `src/components/events/filters/DateChipRail.tsx` | `date` + `page` | `useQueryStates` — resets `page` on date change |

**Shared parsers:** `src/components/filters/sharedFilterParsers.ts` — `categoriesParser`, `slugParser` (aliased as `regionParser` / `locationParser`), `pageParser`, `perPageParser`.

`perPageParser` is whitelisted against `PER_PAGE_OPTIONS = [9, 27, 54]` via `normalizePerPage(raw)`; anything outside the whitelist falls back to the default (`9`). Pages read it on the server and feed it into `query.limit`.

**Server-side loaders (`createLoader`):**
- `src/app/(frontend)/events/page.tsx` — `{ page, perPage }` (pagination, not Filters)
- `src/app/(frontend)/locations/page.tsx` — `{ page, perPage }` (pagination, not Filters)
- `src/components/events/filters/eventsFilters.ts` — `source`, `date`, `categories`, `region`, `location` (Filter system)
- `src/components/locations/filters/locationsFilters.ts` — `categories`, `region` (Filter system)

**Conventions baked into the shared parsers:**
- `shallow: false` everywhere (forces RSC re-run on change)
- `clearOnDefault: true` on singles, pagination, and per-page (clean URLs)
- Related params paired via `useQueryStates` so changing a filter atomically resets `page`

## URL State Not (Yet) Using nuqs

| File | Pattern | Migration candidate? |
|---|---|---|
| `src/search/Component.tsx` | `useState` + debounce + `router.push('/search?q=...')` in `useEffect` | **Yes** — classic nuqs use case (debounced input with `throttleMs`) |
| `src/app/(frontend)/(auth)/login/page.tsx` | `useSearchParams().get('verified' \| 'redirect')` | No — one-shot reads in auth flow |
| `src/app/(frontend)/(auth)/reset-password/page.tsx` | Same as above | No |
| `src/components/Pagination/index.tsx` | `router.push('/posts/page/N')` — path segments, not query | No — different routing pattern (path segments) |

## Why nuqs-everywhere (the tradeoff we accepted)

**Wins we keep:**
- One mental model — every filter param read/written the same way.
- Typed param extraction in RSC via `createLoader`.
- Atomic multi-param updates (`useQueryStates`) for resetting `page` on filter change.
- `SlugComboboxFilter` (controlled input committing to URL) and a future debounced `Search` are genuine nuqs sweet spots — having the rest already on nuqs means they fit naturally.

**Tradeoffs we accept:**
- Filter buttons/chips are `<button>` + `onClick`, not `<a href>`. We lose native middle-click / cmd-click / open-in-new-tab / native prefetch on those controls. This is a deliberate cost for consistency.
- An extra `'use client'` boundary on each filter component.

## Future Direction

- **Migrate `Search`** to `useQueryState('q', …)` with `throttleMs` — eliminates the `useState` + `useEffect` + `router.push` trio.
- **Don't** propose migrating chips/pagination back to `<Link>` + link-builder. That direction has been considered and rejected.
