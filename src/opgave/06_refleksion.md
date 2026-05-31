# Refleksion og konklusion

## Evaluering af de indledende krav - lever projektet op til kravene fra 01?

I [01_intro.md](./01_intro.md) opstillede jeg fem overordnede krav til løsningen.
Her er en ærlig status på, hvordan det nuværende Proof of Concept (POC) opfylder disse mål:

- **Sitet skal fungere både på desktop og mobil – opfyldt:**
  Applikationen bygger på et Tailwind-baseret responsivt design, og hele Storybook-komponent-biblioteket er udviklet ud fra en _mobile-first_-tilgang. En mobil-optimeret navigationsmenu (burgermenu) blev implementeret sent i forløbet (`PR 26-05-2026.5`) for at lukke det sidste hul i mobil oplevelsen.

- **Let for brugeren at få overblik over hvad der sker – delvist opfyldt.** Begivenheds-væggen og lokations-siderne indeholder funktionelle filtre og kategori-chips. Systemet mangler dog en geografisk kortvisning, som mere direkte ville understøtte præmissen om at finde events "tæt på mig". Det er noget af det første, der bør implementeres i næste udviklingsfase.

- **Tryg og gennemsigtig – delvist opfyldt:**
  Sikkerhedsarkitekturen på datalaget er fuldt implementeret og håndhæver adgangskontrol via `httpOnly`-cookies, CSRF-beskyttelse samt korrekte `POST`-anmodninger ved logout. Den sociale tryghed såsom at se, hvem der står bag et event og hvem der har deltaget før, er dog stadig på et tidligt stadie. Det er primært et produktarbejde, ikke et teknisk arbejde, men det er værd at være ærlig om.

- **Skal kunne fungere i flere lande på sigt – forberedt, ikke implementeret:** Datamodellen har en selvstændig Regions-collection, som er koblet til lokationer, så geografien er ikke hardcoded til Danmark. Selve sprog-håndteringen og multi-locale-funktionaliteten mangler dog, men Payload understøtter dette out-of-the-box via deres indbyggede localization-funktion, hvilket gør det ligetil at tilføje når behovet opstår.

- **Nemt for kommende udviklere og administratorer at navigere – opfyldt:**
  Hele projektet er TypeScript-typet end-to-end via Payloads auto-genererede typer. Derudover er der en CLAUDE.md-fil, som dokumenterer Payload-konventioner, projektets specifikke kode-konventioner. Denne samlede rapport fungerer allerede som et fyldestgørende onboarding-dokument for nye udviklere på projektet.

## Hvad jeg lærte teknisk

- ### Den største værdi ved et Headless CMS er delte typer
  Efter at have arbejdet med Payload i noget tid opdagede jeg, at den største fordel ikke var administrationspanelet, men muligheden for at dele typer mellem backend og frontend. Jeg kunne importere typer som `Event`, `Location` og `User` direkte i mine React-komponenter. Hvis jeg omdøbte et felt i Payload, blev alle steder i frontenden, der brugte det gamle navn, straks markeret af TypeScript. Det gjorde det lettere og mere sikkert at ændre datamodellen undervejs i projektet, fordi fejl blev opdaget med det samme.

- **Server Components og Local API gør udviklingen enklere**
  Ved at køre Payload og Next.js i samme applikation kunne jeg bruge Payloads Local API direkte i Next.js Server Components. Det betød, at jeg ikke skulle håndtere ting som API-versionering, CORS-konfiguration eller separate type-definitioner mellem frontend og backend. Det gjorde udviklingsprocessen betydeligt enklere. Efterhånden som projektet voksede, blev jeg mere opmærksom på, hvor mange fejl og vedligeholdelsesopgaver denne arkitektur faktisk sparer mig for.

- **Fleksibel adgangskontrol:**
  Jeg blev positivt overrasket over hvor fleksibel adgangskontrollen i Payload er. En access-funktion kan enten give eller afvise adgang med en simpel true/false-værdi eller returnere en specifik forespørgsel (f.eks. en where-forespørgsel), der begrænser, hvilke data brugeren kan se. Det gør det nemmere at opsætte præcise sikkerhedsregler, uden at skulle skrive kompliceret logik. Det er derfor en tilgang, jeg gerne vil arbejde videre med i fremtidige projekter.

## Hvad jeg lærte om processen / Procesmæssige erfaringer

- **Mindre leverancer reducerer fejl:**
  I projektet arbejdede jeg med 5-7 mindre Pull Requests om dagen i stedet for få store. Det gjorde det lettere at gennemgå kodeændringerne og teste hver preview-URL grundigt. Da en fejl i Next.js' `<Link>`-prefetching for eksempel fik brugere til utilsigtet at blive logget ud på Vercel, kunne problemet hurtigt identificeres og løses i en separat Pull Request. Hvis ændringen havde været en del af en stor samlet Pull Request, ville fejlen sandsynligvis have været sværere at opdage.

- **Dokumentation som et refleksionsværktøj:**
  Jeg begyndte at skrive denne rapport tidligt i projektet og opdaterede den løbende under udviklingen. Ved at beskrive mine arkitektoniske valg, mens de stadig var friske i hukommelsen, blev jeg tvunget til at reflektere over og begrunde mine beslutninger. Det hjalp mig flere gange med at opdage svagheder i mine overvejelser og justere min tilgang, før de udviklede sig til større problemer.

## Hvad jeg ikke nåede

For at give et realistisk billede af projektets nuværende status er der nogle områder, som bevidst er blevet nedprioriteret i denne proof of concept (POC)-fase, men som bør prioriteres før en egentlig lancering:

- **Manglende brugertests:** Der er ikke gennemført brugertests. Vurderinger af brugerrejsen og grænsefladen bygger derfor på antagelser og egne vurderinger frem for test med faktiske brugere.

- **Ingen formelle personas eller kunderejser:** Målgruppen er defineret ud fra en generel forståelse af brugernes behov, men der er ikke udarbejdet eller valideret formelle personas eller kunderejser.

- **Indholdsmoderation er ikke afklaret:** Det er endnu ikke besluttet, hvordan ikke-tekniske redaktører skal kunne moderere eller fjerne upassende indhold og kommentarer gennem administrationspanelet.

- **Ingen systematisk tilgængelighedstest:** Der er ikke gennemført formelle tilgængelighedstests med værktøjer som (Lighthouse eller axe-core). Derfor kan det endnu ikke dokumenteres, om løsningen lever op til WCAG-retningslinjerne.

## Hvad jeg ville lave anderledes hvis jeg startede forfra

- **Arbejdet i en gruppe:** I stedet for at stå alene med det hele. Det havde givet mulighed for sparring, fordeling af opgaver og at få øje på blinde vinkler tidligere i processen.

- **Et mere struktureret Figma-design med brugerrejser fra start:** Jeg sprang relativt hurtigt til kode. Et mere gennemarbejdet design i Figma med klare brugerrejser havde gjort beslutningerne under udviklingen nemmere og hurtigere.

## Næste skridt - Fremtidige udviklingstrin

De næste skridt for platformen efter eksamen er:

- **Brugertests:** Jeg vil teste platformen med 3–5 personer fra målgruppen for at be- eller afkræfte antagelserne i [02_målgruppe_og_design.md](./02_målgruppe_og_design.md).

- **Kommentarfunktion:** Jeg vil implementere kommentartråde på begivenheder. Datamodellen er allerede forberedt via `EventComments`-collectionen.

- **Notifikationssystem:** Jeg vil lave et system, så brugere får besked ved ændringer eller aflysninger af begivenheder. Det kræver, at e-mail-løsningen flyttes fra Gmail til en dedikeret udbyder som Resend eller en samlet løsning som Clerk.

- **Interaktivt kort:** Jeg vil implementere en kortvisning, så det nuværende geografiske filter bliver erstattet af et visuelt kort.

## Konklusion

Dette proof of concept viser, at den valgte arkitektur kan understøtte en funktionel platform med en kompakt kodebase. Hele systemet – frontend, administrationspanel, datalag og autentificering – kører i én Next.js-applikation, som kan hostes gratis på Vercels gratis plan. Koden er så overskuelig, at en ny udvikler vil kunne sætte sig ind i den på kort tid.

De største udfordringer fremadrettet er ikke tekniske, men handler om produktet: hvordan platformen får nok indhold, hvordan datakvalitet sikres, når brugere selv opretter events, og hvordan man skaber en tryg social oplevelse.

## Brugertest af selve sitet

### Signes observationer

**Forsiden:**
Forsiden ser overordnet rigtig fin ud. På knappen står der "Opret gratis profil", men når man klikker på den, kommer man til login-siden, hvor man skal scrolle ned for at finde "Opret ny konto". Det fungerer fint, og jeg fik også en mail efterfølgende.

Jeg vil dog foreslå, at knappen i stedet bare hedder "Log ind". Hvis det er første gang, man bruger siden, vil man naturligt lede efter en mulighed for at oprette en profil, men ellers vil de fleste brugere primært have brug for at logge ind ved næste besøg.

Når man er logget ind, er jeg lidt i tvivl om, hvor man forventes at lande. Jeg tænker, at det måske ville give mere mening at blive sendt til events-siden, hvor man kan udforske begivenheder, i stedet for ens profilside.
"Udforsk events" giver dog god mening som funktion, hvis det er tiltænkt brugere, der endnu ikke er sikre på, om de vil være medlem.

Knappen længere nede fungerer rigtig godt, men teksten kan godt virke lidt forvirrende. Her ville jeg også overveje at ændre den til "Log ind" eller en mere enkel formulering.

**Begivenhedssiden:**
Begivenhedssiden giver et godt overblik og er meget overskuelig. Designet er flot og let at navigere i.

**Se lokationer:**
Siden fungerer fint og er overskuelig.

**Profilside:**
Profil siden er også meget overskuelig og nem at forstå.

**Opret event:**
Siden giver god mening og er intuitiv opbygget.
