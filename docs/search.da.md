# Søgning — arkitektur

Søgningen på `/search` står oven på `@payloadcms/plugin-search`. Pluginnet vedligeholder en `search`-collection som et denormaliseret indeks: hvert dokument i de indekserede collections får sin egen `search`-række, og pluggens `beforeSync`-hook bestemmer hvilke felter der kopieres ind.

## Hvad er indekseret

`src/plugins/index.ts` registrerer tre collections hos `searchPlugin`:

- `posts` — har Payload's SEO-meta-gruppe ud af boksen
- `events` — har **ikke** SEO-meta; vi syntetiserer den
- `locations` — har **ikke** SEO-meta; vi syntetiserer den

## Schema-udvidelse

`src/search/fieldOverrides.ts` tilføjer fire top-level felter til `search`-collection'en ud over Payload's defaults:

| Felt | Type | Indekseret | Hvorfor |
| --- | --- | --- | --- |
| `slug` | text | ja | Bruges til at bygge URL'en (`/${relationTo}/${slug}`). |
| `meta` | group (`title`, `description`, `image`) | ja | SEO-snapshot pr. dokument (incl. syntetiseret for events/locations). |
| `city` | text | ja | Populeres fra `address.city` på locations (og events' relaterede location). |
| `street` | text | ja | Populeres fra `address.street` på samme måde. |
| `categories` | array (`relationTo`, `categoryID`, `title`) | nej | Snapshot af categories — så `categories.title` kan matches uden join. |

`city` og `street` på top-niveau gør det muligt at matche adresser i `payload.find({ where: { city: { like: q } } })` uden depth-traversal.

## `beforeSync` — synthesis pr. collection

`src/search/beforeSync.ts` kaldes af pluginnet hver gang et dokument syncs til `search`. Den modtager `originalDoc` (det rigtige dokument) og `searchDoc` (det skeleton pluginnet har bygget) og returnerer den endelige række.

**For posts:** Brug det eksisterende `meta`-objekt direkte (post'en har SEO-pluggin); fyld kun `meta.title` op med post'ens egen titel hvis SEO-meta'en mangler en.

**For events og locations:** Syntetisér `meta` fra dokumentets egne felter:

```ts
{
  title: originalDoc.title,
  description: originalDoc.description,
  image:
    collection === 'events'
      ? imageId(image) ?? eventLocationImageId  // fald tilbage på location's image
      : imageId(image),
}
```

Adresse-felter:

- For **locations**: kopiér `address.city` og `address.street` direkte.
- For **events**: tag adressen fra event's `location`-relation. Hvis relationen er populated (`depth > 0`), brug objektet; ellers `findByID` på `locations` med `select: { address: true, image: true }` for at undgå at hente hele lokationen.

`categories` populeres med `{ relationTo, categoryID, title }` for hver kategori — relationen `findByID`'es individuelt hvis den ikke allerede er populated.

## `/search`-where-klausulen

`src/app/(frontend)/search/page.tsx` bygger en `or`-klausul med syv `like`-matches:

```ts
{ or: [
  { title:               { like: q } },
  { 'meta.description':  { like: q } },
  { 'meta.title':        { like: q } },
  { slug:                { like: q } },
  { 'categories.title':  { like: q } },
  { city:                { like: q } },
  { street:              { like: q } },
] }
```

Resultatet hentes med `pagination: false` og `limit: 12` — vi viser de første 12 matches uden total-tæller.

## Rendring af resultater

Siden bruger det delte `SeeYouThereCard` + `SeeYouThereGrid` så søgeresultater ser ud som event/location-kortene andetsteds. Ud over titel og kategori-badges får hvert kort:

- **Adresse-linje** — `"${street} • ${city}"` (kun synlig hvis feltet er udfyldt).
- **Type-badge** i bunden — bygges fra `collectionBadge`-mappet: `Indlæg` / `Begivenhed` / `Lokation` med passende ikon. Det er sådan brugeren ser om et resultat er en post, et event eller en location.
- **Billede** — `meta.image` (med fallback til location's billede for events uden eget billede).

## Re-indekser når noget ændrer sig

`@payloadcms/plugin-search` syncer automatisk via collection-hooks når et indekseret dokument oprettes eller opdateres. Hvis du ændrer `beforeSync`-logikken eller tilføjer/fjerner felter i `searchFields`, skal eksisterende `search`-rækker re-syncs — den nemmeste vej er at gemme et dokument fra hver collection igen i admin'en, eller skrive et migrations-script der itererer collection'erne og kalder `payload.update`.
