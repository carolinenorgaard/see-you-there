# Refleksion og konklusion

## Lever projektet op til kravene fra 01?

I [01_intro.md](./01_intro.md) opstillede jeg fem krav til løsningen. Her er en ærlig status pr. krav:

- **"Sitet skal fungere både på desktop og mobil"** — *opfyldt*. Tailwind-baseret responsive design, og hele Storybook-komponent-biblioteket er udviklet med en mobil-first tankegang. En burger-menu kom på plads sent (PR `26-05-2026.5`) for at lukke det sidste hul på mobil.
- **"Let for brugeren at få overblik over hvad der sker"** — *delvist opfyldt*. Begivenhedsvæggen og location-siden har filtre og kategori-chips, men jeg har ikke en kort/map-visning, som er den feature der mest direkte ville svare på "tæt på mig". Det er det første jeg ville bygge næste gang.
- **"Tryg og gennemsigtig"** — *delvist opfyldt*. Auth-flowet er sikkert (httpOnly-cookies, CSRF, korrekt POST på logout), og adgangskontrol er håndhævet på datalaget. Men den **sociale** tryghed — at se hvem der står bag et event, hvem der har deltaget før, og hvordan moderation foregår — er stadig tynd. Det er primært et produktarbejde, ikke et teknisk arbejde, men det er værd at være ærlig om.
- **"Skal kunne fungere i flere lande på sigt"** — *forberedt, ikke implementeret*. Datamodellen har `Regions` som en selvstændig collection knyttet til locations, så geografi er ikke hardcoded til Danmark. Men der er ingen sprog-håndtering eller multi-locale endnu, og Payload understøtter det out-of-the-box via deres localization-funktion, så det vil være ligetil at tilføje når behovet opstår.
- **"Nemt for kommende udviklere og administratorer at navigere"** — *opfyldt*. Hele projektet er TypeScript-typet end-to-end via Payloads auto-genererede typer, der er en CLAUDE.md-skill der dokumenterer Payload-konventioner, og denne opgavetekst i sig selv fungerer som onboarding for en ny udvikler der træder ind på projektet.

## Hvad jeg lærte teknisk

**Headless CMS' egentlige værdi viser sig først når typerne deles**. Det første jeg lagde mærke til efter at have arbejdet med Payload i en uge eller to var, at det ikke var admin-UI'et der gjorde forskellen — det var at jeg kunne importere `Event`, `Location`, `User` direkte i mine React-komponenter, og at en omdøbning af et felt i `Events.ts` straks markerede de steder i frontenden, hvor jeg refererede til det gamle navn. Den slags trygge omdøbninger gør at jeg tør røre datamodellen meget længere ned i projektets levetid end jeg ville turde i en løsere koblet stack.

**Server components plus Local API skipper en hel klasse af problemer**. Jeg har slet ikke skullet håndtere API-versionering, CORS mellem domæner, eller fordobling af typer mellem klient og server. Det var ikke noget jeg satte stor pris på fra dag 1, men det er noget jeg har lært at sætte stor pris på i takt med at jeg har set hvor mange problemer det fjerner.

**Authorization som data er et mønster jeg vil tage med videre**. At en access-funktion i Payload kan returnere enten `true`/`false` eller en `Where`-query (se [05_kodeeksempler.md](./05_kodeeksempler.md#6-access-control--rbac-på-collection-niveau)) var en aha-oplevelse. Det er et mønster der gør sikkerhed udtryksfuld i stedet for imperativ, og det er en idé jeg gerne vil prøve at overføre til andre projekter.

## Hvad jeg lærte om processen

**Mange små PR'er slår få store**. Min historik viser flere dage med 5–7 PR'er — det blev en disciplin der gjorde det nemmere at fange fejl i preview-deployments, fordi diff'en var overskuelig nok til at jeg gad åbne preview-URL'en for hver. Den dag jeg vidste at en `<Link>`-prefetch logger brugere ud, var en lille fokuseret PR (PR #14) — havde det været en stor blandet PR, ville den slags subtile fejl have druknet i støj.

**At skrive dokumentationen undervejs er en form for tænkning**. Jeg påbegyndte denne opgavetekst tidligt i forløbet og udvidede den løbende, frem for at vente til slutningen. Det betød at jeg blev tvunget til at sætte ord på *hvorfor* jeg havde valgt noget, mens valget stadig var friskt — og det fangede mig flere gange i at have valgt noget af forkerte grunde, hvor jeg så kunne nå at lave det om.

## Hvad jeg ikke nåede

For at være ærlig om hvor projektet stadig er tyndt — bevidste fravalg på POC-stadiet, men ting der står øverst på listen hvis projektet bevæger sig mod lancering:

- **Ingen brugertests**: alle antagelser om brugeren er informerede gæt frem for målte indsigter.
- **Ingen formelle personas eller customer journeys**: jeg har én bruger i hovedet, ikke team-validerede artefakter.
- **Begrænset indholdsmoderation-design**: hvordan ser admin-UI'et ud når det er en redaktør, der ikke er udvikler, der skal moderere et upassende kommentar? Ikke afklaret.
- **Ingen systematisk tilgængeligheds-test**: jeg er bevidst om vigtigheden, men har ikke kørt formelle audits (Lighthouse, axe-core) eller skærmlæser-tests og kan derfor ikke dokumentere at sitet overholder WCAG.

## Hvad jeg ville lave anderledes hvis jeg startede forfra

- **PWA fra starten** (gentaget fra 03). Offline-funktionalitet og install-to-homescreen er ting jeg tror brugerne ville sætte pris på, og det er sværere at retroficere ind end at planlægge for fra dag 1.
- **PostgreSQL i stedet for MongoDB**, hvis kerneforespørgslerne viser sig at være relationelle. MongoDB er valgt fordi Payload anbefaler det, men en stor del af mine queries går allerede gennem joins i applikationslaget, som en relationel database håndterer mere elegant. Payload understøtter heldigvis PostgreSQL, så det er ikke et lock-in.
- **`useOptimistic` på Like/RSVP fra dag 1**. Den nuværende sekventielle flow (vent på server, opdatér så UI) er sikker, men sløv. React 19's `useOptimistic`-hook er bygget præcis til denne slags, og jeg har bare ikke prioriteret at tage skiftet endnu.
- **Lighthouse og a11y-audit som en del af CI** så jeg ville fange regressioner automatisk i stedet for at skulle huske at tjekke dem manuelt.

## Næste skridt

Konkrete ting der står øverst på listen efter eksamen:

- **Brugertests** med 3–5 personer fra den primære målgruppe — for at validere eller falsificere mine antagelser fra [02_målgruppe_og_design.md](./02_målgruppe_og_design.md).
- **Kommentartråde** på events (datamodellen er klar via `EventComments`-collectionen, det er kun UI'et der mangler).
- **Notifikationer**: når et event jeg har tilmeldt mig ændres eller aflyses, bør jeg få besked. Det kræver en mail-pipeline der ikke længere er en privat Gmail-konto.
- **Migration af mail til Resend eller Clerk** for at få mail-driften ud af mine egne hænder.
- **Kort/map-visning** så "find events tæt på mig" bliver et reelt svar i stedet for et tekstfilter.

## Konklusion

POC'en bekræfter at konceptet er teknisk muligt med en lille kodebase: hele systemet — frontend, admin, datalag, auth — kører på én Next.js-applikation, hostes for under 0 kr. på Vercels gratis tier, og er stadig overskueligt nok til at en ny udvikler kan onboardes på det på en eftermiddag. De største risici fremadrettet ligger ikke i teknologien men i **produktet**: hvordan platformen tiltrækker nok indhold til at være interessant, hvordan kvalitet og moderation håndteres når brugere selv begynder at oprette events, og hvordan tryghed kommunikeres i praksis. Det er emner et eksamensprojekt naturligvis ikke besvarer — men det er værd at navngive dem som det egentlige arbejde, der står tilbage.
