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

Designsystemet og frontendens værktøjer (Figma, Storybook, Tailwind, shadcn) er beskrevet sammen med resten af stack'en i [03_arkitektur.md](./03_arkitektur.md#designsystem-og-værktøjer).

De ærlige fravalg på design-domænet (manglende brugertests, formelle personas, moderation-design og a11y-tests) er samlet med projektets øvrige retrospektive fravalg i [07_refleksion.md](./07_refleksion.md#hvad-jeg-ikke-nåede).
