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

Designet og datamodellen er trukket ud af et par konkrete use cases. Hver use case har en direkte teknisk konsekvens, hvilket har holdt scope stramt:

- **"Find events tæt på mig i denne uge"** drev kravet om geografisk filtrering (region, lokation) og dato-filtrering. Det er igen grunden til at filterstate ligger i URL'en og ikke i React-state — se kodeeksempel om nuqs i [05_kodeeksempler.md](./05_kodeeksempler.md#4-filterstate-i-urlen-med-nuqs).
- **"Send et event til en ven"** drev kravet om at hver filtreret visning skal have sin egen URL. Et delt link skal lande modtageren på præcis det samme indhold som afsenderen så.
- **"Se hvad jeg har liket eller tilmeldt mig"** drev `/profile`-siden og de to felter `likes` og `attendees` på event-collectionen. Det er også grunden til at like/RSVP er to selvstændige relationer i stedet for én samlet "engagement"-relation — de svarer til forskellige intentioner og skal kunne vises hver for sig.

## Designsystem og værktøjer

Designet bygger på en lille håndfuld principper og værktøjer, der trækker i samme retning:

- **Figma som mood board og udgangspunkt** — ikke som single source of truth. Jeg brugte Figma til at samle stemninger, prøve kort-kompositioner af og fastsætte enkelte konkrete værdier (kortets `aspect-[528/325]`-ratio i `SeeYouThereCard` er trukket direkte fra et Figma-mock og lagt ind som en Tailwind-utility). Men Figma-filen er bevidst ikke holdt vedlige som projektets autoritative designkilde, fordi den uundgåeligt ville komme ud af sync med koden — og det er koden brugerne reelt møder.
- **Storybook som single source of truth for designsystemet**. Det er her komponenterne lever i deres "rene" form, dokumenteret med varianter, props og brugseksempler, og det er det biblioteket fortæller sandheden om hvordan en `SeeYouThereCard`, en `Badge` eller en `LikeButton` ser ud og opfører sig. Hvis Figma og Storybook nogensinde er uenige, er det Storybook der vinder — fordi det er der, designet faktisk bliver brugt i produktionskoden.
- **Tailwind v4** med design tokens defineret som CSS-variabler. Det betyder at hvis jeg ændrer en farve i ét sted, opdateres den overalt — uden at jeg skal lave find-and-replace i komponenterne.
- **shadcn-stil compound components** som mønster: i stedet for store komponenter med mange props, eksponerer jeg små byggesten (Card, CardHeader, CardFooter, CardBody osv.) som callsiten composer som den vil. Det matcher det visuelle designsprog, der i sig selv er compositional — samme kort-skelet bruges til både events og locations, men indholdet inde i hver slot er forskelligt.

Valget om at gøre Storybook (og ikke Figma) til den autoritative kilde er en bevidst beslutning om at lade kode og dokumentation ligge så tæt på hinanden som muligt. Storybook-biblioteket er beskrevet nærmere i [05_kodeeksempler.md](./05_kodeeksempler.md#3-storybook-som-komponent-bibliotek-og-fremtidig-chromatic).

## Tilgængelighed som designvalg

Tilgængelighed er bagt ind i selve designsystemet snarere end at være tilføjet bagefter:

- Kontraster overholder WCAG AA — den mørke gradient i bunden af alle `SeeYouThereCard`-instanser sikrer at hvid tekst altid har tilstrækkelig kontrast mod billedet.
- Hele kortet er klikbart via `next/link`, men fokus-ringen vises kun ved tastatur-navigation (`focus-visible`), så musbrugere ikke generes af en ramme om hvert kort.
- Interaktive elementer har `aria-pressed`/`aria-label` hvor det er nødvendigt — eksempler i Like/RSVP-knapperne, beskrevet i [05_kodeeksempler.md](./05_kodeeksempler.md#1-like--og-deltag-knappen--én-fælles-toggle-fabrik).

Det er en bevidst forenkling at jeg ikke har lavet en formel a11y-audit (Lighthouse, axe-core) endnu. Det vil være naturligt at gøre, før produktet rammer rigtige brugere.

## Hvad jeg ikke nåede

For at være ærlig om hvor designet stadig er tyndt:

- **Ingen brugertests**: alle antagelser om brugeren er informerede gæt frem for målte indsigter.
- **Ingen formelle personas eller customer journeys**: jeg har én bruger i hovedet, ikke et team-validerede artefakter.
- **Begrænset indholdsmoderation-design**: hvordan ser admin-UI'et ud når det er en redaktør der ikke er udvikler, der skal moderere et upassende kommentar? Ikke afklaret.

Det er bevidste fravalg på POC-stadiet, men de tre står øverst på listen hvis projektet bevæger sig mod lancering.
