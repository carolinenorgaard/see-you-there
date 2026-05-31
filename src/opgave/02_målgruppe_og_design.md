# Målgruppe og design

## Primær målgruppe

Den primære målgruppe er unge voksne og voksne i alderen ca. 18-40 år bosat i København og omegn, som ønsker at være mere sociale, men som mangler nogen at dele oplevelser og aktiviteter med. Målgruppen søger derfor nye sociale relationer og fællesskaber gennem fælles oplevelser og aktiviteter.

Målgruppen består typisk af studerende, unge i etableringsfasen, voksne med forskellige baggrunde, personer der for nyligt er flyttet og måske derfor endnu ikke har etableret et socialt netværk, samt personer hvis eksisterende netværk ikke i tilstrækkelig grad dækker deres sociale behov.

Generelt er målgruppen digitalt vant, men kan samtidig opleve digital overbelastning samt manglende overblik over, hvor de kan finde relevante oplevelser, aktiviteter og fællesskaber. Selvom de er åbne over for nye sociale relationer, har de måske ikke et fast netværk at deltage i aktiviteter med, hvilket kan gøre det svært at tage initiativ alene. En del af målgruppen kan derfor i perioder opleve følelsen af ensomhed eller mangel på sociale fællesskaber.

Målgruppen har derfor behov for en samlet, brugervenlig og inspirerende platform, der:

- giver overblik over relevante oplevelser og begivenheder
- gør det nemt at deltage i aktiviteter sammen med andre
- understøtte dannelsen af nye sociale relationer og fællesskaber

## Sekundære brugere

To sekundære brugergrupper forventes at få større betydning i senere udviklingsfaser af platformen.

### Sponsorerede partnere

Caféer, spillesteder, kulturhuse og andre arrangører, der ønsker at få deres begivenheder vist på platformen mod betaling. Denne brugergruppe er ikke en del af den nuværende POC, men datamodellen er allerede forberedt til at understøtte dette gennem feltet `createdBySeeYouThere` i begivenheds-kollektionen, som adskiller officielt indhold fra brugergenereret indhold.

### Redaktører og administratorer hos See you there

Redaktører på platformen modererer og administrerer indhold via Payload CMS' admin-interface. I den nuværende fase fungerer jeg primært selv som administrator, men brugergruppen er stadig relevant, da den stiller krav til både interface, struktur og brugervenlighed.

Jeg har bevidst valgt ikke at udvikle formelle personas eller gennemføre brugertests på POC-stadiet. Dette er en metodisk forenkling, som jeg er bevidst om. Hvis projektet videreudvikles fra proof of concept til en egentlig platform, vil brugerinterviews og brugertests være blandt de første områder, jeg vil prioritere, da flere af projektets antagelser omkring brugernes frustrationer, behov og motivationer primært er baseret på kvalificerede antagelser frem for empirisk indsamlede data.

## Use cases og featureprioritering

For at holde projektets scope fokuseret er udviklingen taget udgangspunkt i tre konkrete brugssituationer, som hver især har været med til at definere centrale features på platformen.

**Jeg vil finde events tæt på mig på en bestemt dag:**
Dette behov førte til udviklingen af filtrering efter område og lokalitet, samt en datovisning. Funktionen gør det hurtigt og overskueligt at finde relevante aktiviteter i nærområdet.

**Jeg vil dele min søgning med en ven:**
For at understøtte deling gemmes filtre og søgekriterier direkte i URL'en, frem for kun i intern React-state. Det betyder at en bruger kan kopiere og dele en specifik filtreret søgning som for eksempel: `/events?categories=jazz&region=koebenhavn`. Modtageren lander dermed på den samme filtrerede visning. Dette er den primære årsag til, at filter-state er håndteret via URL-parametre frem for lokal statehåndtering i frontend-applikationen (se [04_kodeeksempler.md](./04_kodeeksempler.md#4-filterstate-i-urlen-med-nuqs)). Muligheden for at dele individuelle events via `/events/[slug]` er derimod en standardfunktion i Next.js-routing og ikke et selvstændigt designvalg.

**Jeg vil kunne se, hvad jeg har liket eller tilmeldt mig:**
Dette use case førte til udviklingen af `/profile`-siden, hvor brugerens liked og attended begivenheder vises i to separate sektioner. Funktionen giver brugeren et bedre overblik og gør det nemt at vende tilbage til tidligere gemte aktiviteter.

Designsystemet og frontendens værktøjer (Figma, Storybook, Tailwind CSS og shadcn/ui) er beskrevet sammen med resten af den tekniske stack i [03_arkitektur.md](./03_arkitektur.md#designsystem-og-værktøjer).

Projektets metodiske og designmæssige fravalg — herunder manglende brugertests, formelle personas, moderation-design og accessibility-tests — er samlet i [06_refleksion.md](./06_refleksion.md#hvad-jeg-ikke-nåede).
