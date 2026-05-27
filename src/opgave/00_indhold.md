# Indhold

Eksamensoplæg for **See You There** — opdelt i syv dele.

## [1. Intro](./01_intro.md)
Projektets vision, krav til løsningen, og overvejelser om webapp vs. native vs. PWA.
- [Krav til løsning](./01_intro.md#krav-til-løsning)
- [Overvejelser](./01_intro.md#overvejelser)

## [2. Målgruppe og design](./02_målgruppe_og_design.md)
Hvem platformen er bygget til, og hvilke use cases der drev featurevalg.
- [Primær målgruppe](./02_målgruppe_og_design.md#primær-målgruppe)
- [Sekundære brugere](./02_målgruppe_og_design.md#sekundære-brugere)
- [Use cases der drev featurevalg](./02_målgruppe_og_design.md#use-cases-der-drev-featurevalg)

## [3. Arkitektur](./03_arkitektur.md)
Den tekniske stack (Payload, Next.js, MongoDB), diagrammer over system- og datamodel, designsystemet på frontenden, og hvad jeg har valgt fra.
- [Nuværende stack](./03_arkitektur.md#nuværende-stack)
- [Designsystem og værktøjer](./03_arkitektur.md#designsystem-og-værktøjer)
- [Hvad valgte jeg fra](./03_arkitektur.md#hvad-valgte-jeg-fra)
- [Hvad skulle måske have været anderledes](./03_arkitektur.md#hvad-skulle-måske-have-været-anderledes)

## [4. Problemløsning](./04_problemløsning.md)
Konkrete tekniske problemer jeg har løst undervejs — auth, hosting, storage og mail.
- [Brugeroprettelse](./04_problemløsning.md#brugeroprettelse)
- [Hosting, storage og mail](./04_problemløsning.md#hosting-storage-og-mail)

## [5. Kodeeksempler](./05_kodeeksempler.md)
Seks udvalgte kodeeksempler der hver demonstrerer et princip — DRY, komposition, sikkerhed, delbarhed.
- [1. Like- og deltag-knappen — én fælles toggle-fabrik](./05_kodeeksempler.md#1-like--og-deltag-knappen--én-fælles-toggle-fabrik)
- [2. SeeYouThereCard — compound component i shadcn-stil](./05_kodeeksempler.md#2-seeyouthercard--compound-component-i-shadcn-stil)
- [3. Storybook som komponent-bibliotek (og fremtidig Chromatic)](./05_kodeeksempler.md#3-storybook-som-komponent-bibliotek-og-fremtidig-chromatic)
- [4. Filterstate i URL'en med nuqs](./05_kodeeksempler.md#4-filterstate-i-urlen-med-nuqs)
- [5. Validering af events med et `beforeValidate`-hook](./05_kodeeksempler.md#5-validering-af-events-med-et-beforevalidate-hook)
- [6. Access control / RBAC på collection-niveau](./05_kodeeksempler.md#6-access-control--rbac-på-collection-niveau)

## [6. Workflow](./06_workflow.md)
Hvordan jeg bruger Git og GitHub i projektet — branch-strategi, PR-navngivning, og hvad jeg ville ændre på et team.
- [Versionsstyring med Git og GitHub](./06_workflow.md#versionsstyring-med-git-og-github)
- [Branch-struktur — main + develop](./06_workflow.md#branch-struktur--main--develop)
- [Navngivning af pull requests](./06_workflow.md#navngivning-af-pull-requests)
- [Den typiske arbejdsdag](./06_workflow.md#den-typiske-arbejdsdag)
- [Hvad der virker, og hvad jeg ville lave anderledes på et team](./06_workflow.md#hvad-der-virker-og-hvad-jeg-ville-lave-anderledes-på-et-team)

## [7. Refleksion og konklusion](./07_refleksion.md)
Tjek af krav fra intro mod den færdige løsning, læring fra teknisk arbejde og proces, samt næste skridt.
- [Lever projektet op til kravene fra 01?](./07_refleksion.md#lever-projektet-op-til-kravene-fra-01)
- [Hvad jeg lærte teknisk](./07_refleksion.md#hvad-jeg-lærte-teknisk)
- [Hvad jeg lærte om processen](./07_refleksion.md#hvad-jeg-lærte-om-processen)
- [Hvad jeg ikke nåede](./07_refleksion.md#hvad-jeg-ikke-nåede)
- [Hvad jeg ville lave anderledes hvis jeg startede forfra](./07_refleksion.md#hvad-jeg-ville-lave-anderledes-hvis-jeg-startede-forfra)
- [Næste skridt](./07_refleksion.md#næste-skridt)
- [Konklusion](./07_refleksion.md#konklusion)
