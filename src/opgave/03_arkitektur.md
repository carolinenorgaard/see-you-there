# Arkitektur

## Stack

Dette afsnit beskriver de teknologier, som applikationen er bygget på.

### PayloadCMS

PayloadCMS udgør kernen i projektet. Det er et Node.js-baseret headless CMS (Content Management System), som fungerer særdeles godt sammen med Next.js. En væsentlig fordel ved denne løsning er, at både frontend og backend er skrevet i JavaScript/TypeScript, hvilket skaber et mere ensartet udviklingsmiljø og gør udviklingsprocessen mere overskuelig, da jeg ikke skal arbejde på tværs af forskellige programmeringssprog.

Payload er open source og understøttes af et aktivt community, hvilket gør det til et veletableret og moderne CMS, der passer godt til projektets behov. I 2025 blev Payload desuden opkøbt af Figma, hvilket både viser/indikerer stor interesse for teknologien og giver gode muligheder for en stabil videreudvikling af platformen. Den version af Payload, jeg bruger, er v3, som blev udgivet i november 2024 og fortsat vedligeholdes aktivt.

**Fordele:**

- Frontend og backend anvender samme sprog (TypeScript), hvilket giver en mere sammenhængende udviklingsproces.
- Hurtigt at lære og let at tilpasse til projektets egne datamodeller
- Hosting er enklere, da der ikke kræves en separat PHP-server, som eksempelvis ved WordPress
- Understøtter flere databaser - jeg valgte MongoDB, som Payload anbefaler

**Ulemper:**

- Mindre community end eksempelvis WordPress, hvilket betyder — færre færdige plugins, guides og vejledninger at slå op
- Stadig et ungt projekt, så dokumentation og API'er ændrer sig oftere
- Tæt koblet til Next.js — kan gøre det mere omfattende og svært at skifte frontend-teknologi senere i projektets levetid

### Next.js

En af grundene til, at jeg valgte Payload, er, at systemet som standard er bygget sammen med Next.js, som jeg allerede kender og har erfaring med i forvejen. Next.js er et React-framework, der understøtter både server-side rendering og client-side rendering, hvilket gør det muligt at bygge en moderne og solid frontend-webapplikation. I projektet anvender jeg Next.js 16 (udgivet i oktober 2025) med App Router, som benytter filbaseret routing. Dette gør det nemt at oprette og strukturere nye sider, da routingen automatisk genereres ud fra projektets mappestruktur, sammenlignet med en mere traditionel client-side React-opsætning, hvor routing typisk konfigureres manuelt.

**Fordele:**

- Samme programmeringssprog som backend (TypeScript), hvilket giver en mere ensartet udviklingsproces
- Filbaseret routing via App Router gør projektets sidestruktur overskuelig og forudsigelig
- React Server Components gør det muligt at hente data direkte på serveren uden behov for et ekstra API-lag
- Indbygget optimering af billeder, skrifttyper og bundling bidrager til bedre performance
- Tæt integration med Vercel, som er den anbefalede hostingplatform til Next.js.

**Ulemper:**

- Stærkt bundet til Vercel — hvilket er bedst, hvis man bliver i deres økosystem
- Hyppige opdateringer og nye versioner kan medføre behov for løbende vedligeholdelse og oprydning i koden
- Fejlfinding kan være besværlig og mere kompleks, fordi det ikke altid er tydeligt, om en fejl opstår på server eller i browseren

### MongoDB / Atlas

MongoDB er en dokumentbaseret NoSQL-database, som gemmer data i JSON-lignende dokumenter frem for i traditionelle tabeller med faste skemaer. Denne struktur passer godt til et CMS-drevet projekt, fordi datamodellen ofte udvikler sig undervejs i projektforløbet. Nye felter kan tilføjes, ændres eller fjernes uden behov for at køre tunge og omfattende migrationsprocesser. Samtidig arbejder Payload internt med JSON-lignende datastrukturer, hvilket gør integrationen mellem CMS og database naturlig.

Til hosting af databasen anvendes MongoDB Atlas, som er MongoDBs egen cloud-baserede løsning. Atlas tilbyder blandt andet automatiseret drift, sikkerhedsfunktioner og et gratis cluster, som er tilstrækkeligt til en prototype af denne størrelse.

**Fordele:**

- Fleksibelt skema, som gør det muligt at ændre datamodellen uden omfattende migrationsprocesser
- Velegnet til JSON-lignende data, som Payload allerede arbejder med i forvejen
- Gratis cluster i MongoDB Atlas er rigeligt til udvikling og prototyping
- Tæt integration med Payload og den øvrige teknologistak.

**Ulemper:**

- Færre garantier og indbyggede muligheder for komplekse relationer, sammenlignet med SQL-databaser - fx: på tværs af tabeller
- Komplekse og avancerede forespørgsler på tværs af store datamængder kan blive klodsede og være mere komplekse at implementere
- Et skift til en anden database-type senere, kan kræve ændringer og omskrivning i datalaget og applikationslogikken

### URL-baseret state med nuqs

Når en bruger filtrerer eller bladrer i en liste, skal applikationen huske, hvad brugeren har valgt. Det kunne f.eks. være "vis kun events i København inden for kategorien musik". Til at håndtere dette bruger jeg [nuqs](https://nuqs.dev/), som gemmer brugerens valg direkte i selve adressen (URL'en) i browseren – det er det, der står efter et `?` i en webadresse.

Det har flere praktiske fordele: Brugeren kan kopiere linket og dele et filtreret view med en ven, gemme det som bogmærke, eller bruge browserens tilbage-knap som forventet. Hvis siden i stedet havde gemt valgene i hukommelsen, ville de forsvinde, hver gang siden blev opdateret. Samtidig betyder det, at serveren kan læse filtrene med det samme og levere det rigtige indhold med det samme, brugeren åbner linket.

## Authentication

Til brugeroprettelse og login anvender jeg Payloads indbyggede `users`-collection, som håndterer hashing af passwords, sessions og rollebaseret adgangskontrol. Ved at benytte den indbyggede løsning får jeg adgang til velafprøvede sikkerhedsfunktioner uden selv at skulle implementere dem fra bunden.

Valget er bevidst, da autentificering er et sikkerhedskritisk område, hvor fejl i implementeringen kan få alvorlige konsekvenser. Derfor vurderer jeg det som en fordel at benytte et veletableret frameworks standardløsninger frem for at udvikle en egen løsning.

### Clerk som muligt alternativ

Jeg har ikke selv arbejdet med Clerk endnu, men har set flere udviklere omtale det positivt — særligt for de færdige UI-komponenter, sociale logins og den indbyggede håndtering af sessions. På POC-stadiet vurderer jeg dog at Payloads indbyggede auth er tilstrækkeligt, og at det ikke giver mening at trække en ekstern auth-tjeneste ind, før jeg ved mere om, hvilke krav projektet reelt får.

## Drift og platform

Hvor den tekniske stack beskriver, hvilke teknologier applikationen er bygget med, handler dette afsnit om, hvor applikationen kører, samt de eksterne tjenester og den infrastruktur, der understøtter løsningen.

### Domain & DNS

Jeg har købt domænet [see-you-there.dk](https://see-you-there.dk) via [simply.com](https://simply.com). Her har jeg via deres DNS (domain name system) mulighed for at pege på den server med projektet der er hosted hos Vercel og sende emails via Resend.

### Hosting

Applikationen hostes på Vercel, som er den anbefalede hostingplatform til Next.js. Platformen tilbyder blandt andet automatiske preview-deployments for hver pull request, et indbygget globalt CDN, samt et gratis hobby-tier, der er tilstrækkeligt til en prototype af denne størrelse.

Jeg har også overvejet at hoste projektet selv ved hjælp af Coolify på en egen server. Denne løsning ville give større kontrol over driften og potentielt lavere omkostninger på længere sigt, hvis projektet vokser ud over Vercels gratis tier.

På nuværende tidspunkt og stadie vurderer jeg dog, at det er unødvendigt, da fordelene ikke opvejer den ekstra kompleksitet, som kræver indsigt i egen server-opsætning. Selv-hosting ville blandt andet medføre ansvar for drift, sikkerhed, backups, håndtering af SSL-certifikater og m.m. hvilket ligger uden for projektets nuværende scope og ressourcer.

Hvis projektet på et senere tidspunkt får flere brugere og højere driftsomkostninger, og Vercel dermed bliver en reel begrænsning, kan en selv-hostet løsning være relevant at genoverveje og vende tilbage til.

### Storage

Da vi ikke kan skrive lokalt på Vercels server, kan uploads ikke gemmes der. I stedet har jeg valgt at bruge Vercel Blob sammen med Payloads `@payloadcms/storage-vercel-blob`. Dette giver en fuldt managed object storage-løsning, som er tæt integreret med den øvrige hosting-opsætning og leveres direkte via Vercels CDN.

**Fordel:** En væsentlig fordel ved dette valg er den hurtige implementeringstid. Adapteren sættes op med få linjer i `payload.config.ts`, og fordi jeg allerede benytter Vercel til hosting, ligger filerne tæt på Next.js-applikationen. Det sparer mig for at skulle administrere ekstra konti eller konfigurere IAM (Identity and Access Management).

**Ulempe:** Den primære ulempe er dog, at man på Vercels _hobby-tier_ kun får 1 GB gratis Blob-storage. Det er tilstrækkeligt til en Proof of Concept (POC), men det vil hurtigt medføre ekstra omkostninger, hvis platformen vokser og brugerne begynder at uploade billeder til deres begivenheder i større omfang. Bliver det aktuelt, vil det naturlige skifte være at flytte hele driften over på Coolify på egen server (som beskrevet under hosting). Dette vil gøre det muligt at hoste min egen object storage og derved samle driften ét sted, frem for at sprede afhængigheder og omkostninger ud over flere forskellige managed services.

### Storybook-hosting

Designsystemets Storybook-bibliotek hostes gratis på GitHub Pages via et GitHub Actions-workflow, der bygger og udgiver det statiske output automatisk, hver gang der pushes til main. Det betyder, at biblioteket er offentligt tilgængeligt online og nemt kan deles via et link, uden at modtageren behøver at klone og køre projektet lokalt. Den tekniske opsætning er beskrevet i [04_kodeeksempler.md](./04_kodeeksempler.md#3-storybook-som-komponent-bibliotek-og-fremtidig-chromatic).

### E-mail-håndtering

Lige nu bruger jeg kun e-mails i forbindelse med brugeroprettelse og ved glemt password. Først forsøgte jeg at oprette en almindelig Gmail-konto og sende mails via Nodemailer, men Google blokerede hurtigt denne løsning.

Derfor valgte jeg [Resend](https://resend.com/), som også anbefales i Payload-dokumentationen.

Det er en fin løsning for nu, men da Resend har sendekvoter, kan det være relevant at overveje at uddelegere mail-flowet til en auth-platform som Clerk. Da mailbehovet udelukkende dækker brugeroprettelse og password-reset, kan det give bedre mening at lade en samlet løsning håndtere hele flowet.

## Diagram over teknisk arkitektur

```mermaid
flowchart LR
    User([Bruger])
    Editor([Redaktør])
    AdminUI["Payload Admin UI
    /admin"]
    Next["See You There frontend
    /
    /events
    /locations
    /profile"]
    Payload[Payload CMS Local API]
    Mongo[(MongoDB Atlas)]
    Blob[Vercel Blob storage]
    Mail[Resend]

    User <--> Next
    Editor <--> AdminUI
    AdminUI <--> Payload
    Next <--> Payload
    Payload <--> Mongo
    Payload <--> Blob
    Payload --> Mail

    subgraph Vercel
        Next
        AdminUI
        Payload
        Blob
    end
```

Frontend-delen og Payload CMS afvikles i den samme Next.js-applikation på Vercel, hvilket betyder, at hele systemet deployes som én samlet enhed fra ét fælles repository og med ét sæt miljøvariabler. Payload genererer automatisk TypeScript-typer ud fra mine collections, som frontend-koden kan importere direkte. Hvis jeg eksempelvis omdøber et felt i min `events`-collection, fanges dette med det samme af TypeScript-compileren de steder i frontenden, der refererer til det gamle navn. Applikationens data persisteres i MongoDB Atlas.

Systemet har to primære brugerflader: den offentlige frontend, som almindelige brugere møder i browseren, og Payloads Admin UI på `/admin`, hvor redaktører opretter og redigerer indhold. Begge interfaces er en del af samme Next.js-applikation, men de fungerer som to adskilte lag oven på den samme Payload-instans.

Billed-uploads via administrationspanelet går igennem Payload, som videresender filen til Vercel Blob ved hjælp af `@payloadcms/storage-vercel-blob`. Når et billede efterfølgende skal vises på websitet, returnerer Payload blot URL'en til filen i Vercel Blob – selve dataoverførslen (billed-bytes) går derved udenom Payload-instansen, hvilket aflaster applikationen.

## Datamodel: Relationer mellem events og lokationer

```mermaid
flowchart LR
    USERS["USERS
    email · name · bio · age · city · role"]
    LOCATIONS["LOCATIONS
    title · address · region · description"]
    CATEGORIES["CATEGORIES
    title · color"]
    EVENTS["EVENTS
    title · description · startDate · endDate · startTime · endTime · createdBySeeYouThere"]
    EVENT_COMMENTS["EVENT_COMMENTS
    content"]

    LOCATIONS -->|har| EVENTS
    CATEGORIES -->|tagger| LOCATIONS
    CATEGORIES -->|tagger| EVENTS
    USERS -->|opretter / deltager / liker| EVENTS
    EVENTS -->|har| EVENT_COMMENTS
    USERS -->|skriver| EVENT_COMMENTS
```

Datamodellen bygger på, at et `Event` (en begivenhed) altid skal være knyttet til ét `Location` (en lokation). Det giver ikke mening at have en begivenhed uden et sted – derfor er denne sammenkobling påkrævet. Omvendt kan en lokation være vært for mange forskellige begivenheder, så når man kigger på en lokation, kan man se alle de events, der er knyttet til den.

Både events og lokationer kan tagges med flere `Categories` (kategorier) – f.eks. kan en lokation både være "café" og "udendørs", og en koncert kan både være "musik" og "live". Hver lokation har desuden en adresse opdelt i gade, postnummer, by og område, så brugerne kan filtrere indholdet geografisk.

En `User` (bruger) kan optræde i tre forskellige roller omkring en begivenhed: som den, der har oprettet den, som deltager, og som en, der har "liket" den. I diagrammet er disse roller slået sammen til én pil for overskuelighedens skyld, men i koden er de tre separate sammenhænge. Kommentarer til events er bevidst lagt i deres egen samling frem for inde i selve event'et – på den måde kan en begivenhed have rigtig mange kommentarer, uden at selve begivenheden bliver tung at hente.

For at holde diagrammet fokuseret på det vigtigste udelader det `Media`-samlingen (som håndterer billed-uploads) samt Payloads standardfunktioner til at lave almindelige sider og artikler (`Posts`, `Pages` osv.).

## Designsystemets principper og arkitektur

Frontendens designsystem bygger på en række udvalgte principper og værktøjer, der trækker i samme retning og understøtter en konsistent udviklingsproces:

**Figma som moodboard og udgangspunkt – ikke som _Single Source of Truth_:**
Jeg brugte Figma til at samle visuelle stemninger og prøve kort-kompositioner af. Figma-filen er dog bevidst ikke blevet vedligeholdt som projektets autoritative designkilde, da den uundgåeligt ville ende med at komme ud af synkronisering med kildekoden – og det er i sidste ende koden, som brugerne reelt møder og interagerer med.

**Storybook som systemets sandhedskilde:**
Det er i Storybook, komponenterne lever i deres rene form, dokumenteret med tilhørende varianter, props og brugseksempler. Det er dette bibliotek, der definerer, hvordan specifikke komponenter som `SeeYouThereCard`, `Badge` eller `LikeButton` præcist ser ud og opfører sig. Skulle der opstå uoverensstemmelser mellem Figma og Storybook, er det altid Storybook, der er gældende, da det er her, designet er integreret i den faktiske produktionskode.

**Farver og temaer styres ét sted i tre lag:**
Til styling bruger jeg Tailwind v4, som er et værktøj, der gør det hurtigt at skrive konsistent design. Alle farver i projektet er defineret centralt ét sted, så jeg kun skal ændre én værdi, hvis hele platformens farveskema skal justeres. Det er bygget op i tre lag:

1. _Lag 1 – grundfarverne:_ Selve farveværdierne defineres i et moderne farveformat (`oklch`), der gør det lettere at sikre, at to farver opleves med samme lysstyrke. Det er vigtigt for læsbarhed og tilgængelighed.
2. _Lag 2 – mørkt tema:_ Et separat sæt af de samme farver bruges, når brugeren slår mørk tilstand til. Skiftet sker ved at ændre én lille markering øverst i HTML'en – så skifter hele sitet farveskema med det samme.
3. _Lag 3 – kobling til design:_ De grundlæggende farver kobles sammen med de navne, jeg bruger ude i koden (f.eks. `bg-background` og `text-foreground`). På den måde behøver jeg ikke at huske de rå farveværdier, når jeg bygger en knap eller et kort.

Resultatet er, at jeg har én sandhed for farver i hele projektet, og at fremtidige farveskift kun skal laves ét sted.

**Små byggeklodser frem for store, komplekse komponenter:**
I stedet for én stor "kort"-komponent med mange indstillinger har jeg lavet mindre byggeklodser – `SeeYouThereCard`, `SeeYouThereCardHeader`, `SeeYouThereCardBody`, `SeeYouThereCardFooter` osv. – der kan sættes sammen som LEGO. Tilgangen er inspireret af biblioteket _shadcn_. Hver byggeklods bruger automatisk projektets fælles farver, så det samme kort-skelet kan genbruges til både events og lokationer – kun indholdet ændrer sig.

Valget om at ophøje Storybook frem for Figma til den autoritative kilde er en bevidst arkitektonisk beslutning om at lade kode og dokumentation ligge så tæt op ad hinanden som muligt. Storybook-bibliotekets tekniske opsætning uddybes yderligere i filen [04_kodeeksempler.md](./04_kodeeksempler.md#3-storybook-som-komponent-bibliotek-og-fremtidig-chromatic).

## Hvad valgte jeg fra

### Teknologiske fravalg

**WordPress:** Selvom vi blev introduceret til WordPress i skolen, virkede det ikke som den rigtige løsning her. En stor del af konfigurationen i WordPress – herunder temaer, plugins og _custom fields_ – lagres direkte i databasen via administrationspanelet og er dermed ikke synlig i kildekoden eller i Git-historikken. Payload er derimod en _developer-first_-platform, hvor collections, hooks og adgangsregler defineres direkte i TypeScript-filer, som versionsstyres i repositoryet. Det gør projektet langt lettere at overskue, foretage _code reviews_ på og rulle tilbage hvis noget går galt, da alle ændringer ligger som commits.

**Andre headless CMS'er (Sanity og Strapi):** Sanity tilbyder et stærkt redaktørmiljø, men frontend og backend er fuldstændig adskilt på en måde, der ville have krævet mere opsætning. Strapi minder i arkitektur meget om Payload, men jeg fandt Payloads udvikleroplevelse (_developer experience_) og dybe TypeScript-integration mere overbevisende til dette specifikke setup.

**Custom backend (Express) og separat React-frontend:**
Jeg kunne også have bygget alting selv fra bunden – både den del, brugerne ser (frontend), og den del, der kører bag kulisserne (backend). Det ville have givet mig fuld kontrol og frihed til at skrue tingene sammen præcis, som jeg ville. Men det ville samtidig betyde, at jeg selv skulle bygge en lang række basisfunktioner, som ellers kommer færdige med Payload – f.eks. login-system, administrationspanel og kontrol af, at data bliver gemt korrekt. For et projekt af denne størrelse vurderer jeg, at det ville være spild af tid at genopfinde noget, der allerede findes som en velafprøvet løsning.

**Native app eller React Native:** Dette blev fravalgt for udelukkende at kunne fokusere ressourcerne på én samlet kodebase. Skulle behovet for en mobil applikation opstå på sigt, vil en PWA (Progressive Web App) kunne dække mange af de samme behov, uden at jeg skal vedligeholde to separate platforme.

## Hvad skulle måske have været anderledes

### Arkitektoniske overvejelser og potentielle ændringer

**PostgreSQL i stedet for MongoDB:**
Jeg valgte oprindeligt MongoDB ud fra det fleksible skema, men i takt med at datamodellen har udviklet sig, indeholder den flere komplekse, tværgående relationer (eksempelvis mellem `events`, `locations`, `users` og `comments`). En relationel database kunne her have gjort visse forespørgsler enklere. Payload har dog indbygget understøttelse af PostgreSQL, så hvis data-kompleksiteten stiger yderligere, er det muligt at skifte senere.

**PWA fra starten:** Offline-funktionalitet og mobilegenskaber kunne med fordel have været tænkt ind tidligere i processen. Det ville have gjort det muligt at opbygge _service workers_ og caching-strategier som en integreret del af den fundamentale systemarkitektur, frem for som en efterfølgende tilføjelse.
