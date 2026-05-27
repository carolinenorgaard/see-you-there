# Målgruppe og design

## Primær målgruppe

Den primære bruger jeg har designet See You There til, er en **kulturelt nysgerrig person i alderen 20–35 år, bosat i en større dansk by**. Hun er vant til at finde ting at lave gennem Instagram-stories, Facebook-events og venner, men oplever to gennemgående frustrationer: indholdet er låst inde bag algoritmer hun ikke kan styre, og der findes ikke ét sted hun kan få et samlet overblik over hvad der sker på de fysiske steder hun i forvejen bruger — caféen om hjørnet, spillestedet hun holder af, eller parken hun løber i.

Hun har en smartphone som primært enhed og en bærbar som sekundær, så sitet skal fungere lige godt på begge dele. Hun er ikke selv en aktiv content creator — i hvert fald ikke i starten — men hun vil gerne kunne dele en konkret begivenhed med en ven via et link, og hun vil gerne kunne se hvilke events hun har sagt ja til, uden at skulle scrolle tilbage gennem en chat.

## Sekundære brugere

To grupper står i baggrunden af designet og kommer ind på sigt:

- **Sponsorerede partnere** (caféer, spillesteder, kulturhuse) der gerne vil have deres events vist på platformen mod betaling. De er ikke i POC'en, men datamodellen er klargjort til at understøtte dem via `createdBySeeYouThere`-flaget på event-collectionen (officielt indhold vs. brugergenereret).
- **Redaktører på See You There** der modererer indhold via Payloads admin-UI. De er en del af nuværende stadie — det er primært mig selv som admin lige nu — men de definerer kravene til admin-UI'ets brugbarhed.

Jeg har bevidst ikke lavet formelle personas eller brugertests på POC-stadiet. Det er en forenkling jeg er klar over: hvis projektet bevæger sig fra POC til lancering, er reelle brugerinterviews det første jeg ville investere tid i, fordi mange af mine antagelser om frustrationer og motivation er informerede gæt frem for målte indsigter.

## Use cases der drev featurevalg

For at holde scope stramt har jeg taget udgangspunkt i tre konkrete brugersituationer. Hver situation har ført til en bestemt feature i sitet:

- **"Jeg vil finde events tæt på mig på en bestemt dag"** → filtre for region, lokation samt en dato-rail med de næste 14 dage på `/events`-siden.
- **"Jeg vil dele min søgning med en ven"** → også filtre og søgekriterier ligger i URL'en, ikke kun selve event-siden. Det betyder at en bruger kan kopiere `/events?categories=jazz&region=koebenhavn` og sende det videre, så modtageren lander på præcis den samme filtrerede visning. Det er den primære grund til at filterstate håndteres via URL'en frem for intern React-state (se [05_kodeeksempler.md](./05_kodeeksempler.md#4-filterstate-i-urlen-med-nuqs)). At et enkelt event også kan sendes direkte via sin `/events/[slug]`-URL er derimod bare standard Next.js-routing og ikke et særskilt designvalg.
- **"Jeg vil kunne se hvad jeg har liket eller tilmeldt mig"** → `/profile`-siden viser brugerens liked og attended events i to sektioner under hinanden.

## Designsystem og værktøjer

Designet bygger på en lille håndfuld principper og værktøjer, der trækker i samme retning:

- **Figma som mood board og udgangspunkt** — ikke som single source of truth. Jeg brugte Figma til at samle stemninger og prøve kort-kompositioner af. Men Figma-filen er bevidst ikke holdt vedlige som projektets autoritative designkilde, fordi den uundgåeligt ville komme ud af sync med koden — og det er koden brugerne reelt møder.
- **Storybook som single source of truth for designsystemet**. Det er her komponenterne lever i deres "rene" form, dokumenteret med varianter, props og brugseksempler, og det er det biblioteket fortæller sandheden om hvordan en `SeeYouThereCard`, en `Badge` eller en `LikeButton` ser ud og opfører sig. Hvis Figma og Storybook nogensinde er uenige, er det Storybook der vinder — fordi det er der, designet faktisk bliver brugt i produktionskoden.
- **Tailwind v4 med CSS-variabler i tre lag** som tokens-pipeline. Lag 1 er rå farveværdier i `:root` (defineret i `oklch`, som er den moderne, perceptuelt ensartede farverum, der gør det lettere at holde kontrast og lysstyrke konsistente). Lag 2 er et `[data-theme='dark']`-blok der overskriver de samme variabler med deres mørke-mode-værdier — temaskift kræver kun at ændre én attribut på `<html>`. Lag 3 er en `@theme inline`-blok der mapper `--background` → `--color-background` osv., så Tailwind-klasser som `bg-background` og `text-foreground` peger på de samme variabler. Det betyder at jeg har én kanonisk farve-definition i hele projektet, og at et farveskift kun skal laves ét sted.
- **shadcn-stil compound components** som mønster: i stedet for store komponenter med mange props, eksponerer jeg små byggesten (Card, CardHeader, CardFooter, CardBody osv.) som callsiten composer som den vil. shadcn-primitives forbruger præcis de samme CSS-variabler beskrevet ovenfor (`bg-background`, `border-border`, `text-muted-foreground` osv.), så når jeg drop'er en `Badge` eller en `Card` ind i en story eller en side, falder de automatisk på plads i forhold til resten af paletten. Det matcher også det visuelle designsprog, der i sig selv er compositional — samme kort-skelet bruges til både events og locations, men indholdet inde i hver slot er forskelligt.

Valget om at gøre Storybook (og ikke Figma) til den autoritative kilde er en bevidst beslutning om at lade kode og dokumentation ligge så tæt på hinanden som muligt. Storybook-biblioteket er beskrevet nærmere i [05_kodeeksempler.md](./05_kodeeksempler.md#3-storybook-som-komponent-bibliotek-og-fremtidig-chromatic).

## Hvad jeg ikke nåede

For at være ærlig om hvor designet stadig er tyndt:

- **Ingen brugertests**: alle antagelser om brugeren er informerede gæt frem for målte indsigter.
- **Ingen formelle personas eller customer journeys**: jeg har én bruger i hovedet, ikke et team-validerede artefakter.
- **Begrænset indholdsmoderation-design**: hvordan ser admin-UI'et ud når det er en redaktør der ikke er udvikler, der skal moderere et upassende kommentar? Ikke afklaret.
- **Ingen systematisk tilgængeligheds-test**: jeg er bevidst om vigtigheden, men har ikke kørt formelle audits (Lighthouse, axe-core) eller skærmlæser-tests og kan derfor ikke dokumentere at sitet overholder WCAG.

Det er bevidste fravalg på POC-stadiet, men de fire står øverst på listen hvis projektet bevæger sig mod lancering.
