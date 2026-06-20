# Workflow

## Versionsstyring med Git og GitHub

Hele projektet ligger som et Git-repository på GitHub. Selvom jeg er eneste udvikler, har jeg valgt at arbejde med to adskilte branches (parallelle versioner af koden) frem for at lægge ændringer direkte i produktionen. Det giver tre fordele: en ren historik, mulighed for at rulle en hel ændring tilbage i ét hug, og — vigtigst — at Vercel automatisk laver en testudgave af sitet (en _preview_) for hver ændring. Så kan jeg åbne en rigtig URL og se, at alt virker, før det går live.

## Branch-struktur: main og develop

```
main      ← Den live udgave (deployer automatisk til see-you-there.vercel.app)
develop   ← Min arbejdsudgave (får en preview-URL pr. foreslået ændring)
```

**`main`** er den udgave, brugerne ser. Den må kun modtage kode via en godkendt Pull Request — en formel anmodning om at flytte ændringer fra én branch til en anden.

**`develop`** er der, jeg arbejder. Når en feature eller en samling småting er færdig og testet lokalt, åbner jeg en Pull Request fra `develop` mod `main`, kigger ændringerne igennem og flytter (merger) dem ind.

I et team ville `develop` typisk være en fælles branch, hvor flere udviklere lægger deres egne opgavebranches ind, og man ville ofte have et separat _staging_-miljø før produktion. På et soloprojekt giver det ikke ekstra værdi — Vercels preview pr. Pull Request dækker behovet for staging.

## Navngivning af Pull Requests

For de fleste Pull Requests har jeg valgt en simpel, dato-baseret navngivning:

- `26-05-2026` (første Pull Request den 26. maj 2026)
- `26-05-2026.2` (anden samme dag)
- `26-05-2026.3` (tredje samme dag)
- `...`

Når jeg afslutter flere afgrænsede opgaver på samme dag, åbner jeg en Pull Request for hver i stedet for at samle det hele i én stor. Suffixet `.2`, `.3` osv. holder titlerne unikke og sorterer historikken kronologisk.

Titlen siger ikke i sig selv noget om indholdet, men kombineret med beskrivende beskeder på de enkelte commits inde i hver Pull Request kan jeg let finde tilbage til en specifik ændring.

**Undtagelse:** Hvis en Pull Request løser noget særligt eller introducerer en større ændring, får den en beskrivende titel.

Eksempler fra historikken:

- _Add Storybook with stories and GitHub Pages deploy_ – nyt værktøj og en ny deployment-pipeline.
- _Keep users logged in across navigations on Vercel_ – fixede to sammenhængende login-bugs, der kun ramte produktion (beskrevet i [03_arkitektur.md](./03_arkitektur.md#authentication) under _Authentication_).

**Tommelfingerregel:** Løser Pull Request'en én større opgave, får den en sigende titel. Samler den op på små ændringer i løbet af dagen, bruges datoformatet.

## Den typiske arbejdsdag

1. **Hent nyeste kode:** Jeg starter dagen på `develop` med `git pull`, så jeg er opdateret.
2. **Udvikling:** Jeg koder og gemmer ændringer (committer) i små, fokuserede bidder. Kræver en opgave flere commits, holder jeg hver commit til én isoleret ændring.
3. **Push:** Jeg sender ændringerne op til GitHub løbende (`git push origin develop`), så arbejdet er sikret i skyen.
4. **Pull Request:** Når noget er klart, åbner jeg en Pull Request fra `develop` mod `main` — enten via GitHubs webinterface eller kommandoen `gh pr create`. Titlen er enten datoformat eller beskrivende, alt efter omfang.
5. **Test i preview:** Vercel laver automatisk en preview-URL i selve Pull Request'en. Jeg åbner den og tester ændringerne i et miljø, der spejler produktion (samme Node-version, miljøvariabler og database).
6. **Merge:** Hvis preview-miljøet opfører sig som forventet, merger jeg ind i `main`, og Vercel deployer automatisk til produktion.
7. **Oprydning:** `develop` slettes ikke efter merge — den fungerer som en permanent arbejdsbranch gennem hele projektet.

## Hvad der virker, og hvad jeg ville lave anderledes på et team

### Hvorfor modellen fungerer nu

- **Kvalitetssikring:** Hver ændring har et review-trin (mig selv, der gennemgår Pull Request'en), så jeg fanger fejl før produktion.
- **Isolerede testmiljøer:** Hver Pull Request får sin egen preview-deployment. Jeg tester på en rigtig URL under reelle betingelser, ikke kun på `localhost`.
- **Ren historik:** `main` består udelukkende af færdige, testede merges.

### Hvad jeg ville ændre i et team

- **Egne branches pr. opgave:** Udviklingen skulle flyttes fra den fælles `develop` til dedikerede branches navngivet efter opgaven (f.eks. `feature/profile-redesign`). Flere udviklere på samme branch giver hurtigt merge-konflikter.
- **Krav om peer review:** `main` skulle beskyttes, så kode kun kan merges, når mindst én anden udvikler har godkendt den.
- **Automatiserede tjek:** Linting, typechecking og tests skulle køres automatisk på hver Pull Request. I dag kører jeg dem manuelt på min egen maskine via `npm run lint` og `npm run test`.
- **Beskrivende Pull Request-titler:** Datoformatet skulle erstattes af titler, der fortæller, hvad ændringen handler om — afgørende for, at et team hurtigt kan scanne historikken uden at dykke ned i hver enkelt commit.

Datoformatet er et bevidst valg, der passer til soloprojektet i POC-fasen. Men det står øverst på listen over ting, der skal omlægges, hvis projektet vokser og får flere udviklere på.
