# Workflow

## Versionsstyring med Git og GitHub

Hele projektet er versionsstyret i et Git-repository hostet på GitHub. Selvom det er et soloprojekt på et Proof of Concept-stadie (POC), har jeg valgt at arbejde ud fra en lille disciplineret branching-model frem for at committe direkte til produktionsbranchen. Dette valg giver tre konkrete gevinster: en ren og gennemskuelig historik, mulighed for at rulle ændringer tilbage pr. pull request frem for pr. enkelt commit, og vigtigst af alt, at Vercel automatisk genererer en _preview-deployment_ for hver pull request. Det gør det muligt at teste ændringer på en rigtig live URL, før de merges ind i produktionen.

## Branch-struktur: main og develop

```
main      ← Produktionsbranch (deployer automatisk til see-you-there.vercel.app)
develop   ← Udviklingsbranch (udløser automatisk en preview-URL pr. åben PR)
```

**`main`:** Fungerer som min produktions-branch. Den må kun modtage kode via en godkendt Pull Request. Hver merge til `main` udløser automatisk en ny deployment til den endelige produktions-URL på Vercel.

**`develop`:** Fungerer som min primære arbejds-branch. Når en funktion eller en samling af mindre rettelser er klar og testet lokalt, åbner jeg en PR fra `develop` mod `main`, gennemgår kodedifferencen (diffen) i GitHubs interface og gennemfører merget.

På et udviklingsteam ville `develop` typisk være en langlivet branch, hvor flere udviklere løbende merger deres egne isolerede _feature-branches_ ind, ligesom man ofte ville have et separat _staging_-miljø placeret mellem `develop` og `main`. Da dette er et soloprojekt, skaber en yderligere opsplitning dog ikke merværdi. Vercels per-PR preview-funktionalitet erstatter her fuldt ud behovet for et dedikeret staging-miljø.

## Navngivning af Pull Requests

Jeg har bevidst valgt en let-genkendelig, dato-baseret navngivning for størstedelen af mine Pull Requests (PR'er):

- `26-05-2026` (Første PR den 26. maj 2026)
- `26-05-2026.2` (Anden PR samme dag)
- `26-05-2026.3` (Tredje PR samme dag)
- `...`
- `26-05-2026.7` (Syvende PR samme dag)

Når jeg færdiggør flere afgrænsede opgaver på samme dag (eksempelvis en refaktorering, en ny feature eller et mindre kode-fix), åbner jeg en separat PR for hver opgave i stedet for at samle alt i én stor leverance. Suffixet `.2`, `.3` osv. sikrer unikke titler og sorterer automatisk historikken kronologisk i GitHubs PR-liste.

Selvom denne pragmatiske navngivning ikke umiddelbart afslører indholdet i selve titlen, er den fuldt ud tilstrækkelig, når den kombineres med brugen af _Conventional Commits_ på de underliggende commits. Det gør det nemt for mig at spore specifikke ændringer tilbage i historikken.

**Undtagelse:** når en PR løser noget særligt eller introducere en større ændring, får den i stedet en beskrivende titel.

Eksempler fra projektets historik:

- _Add Storybook with stories and GitHub Pages deploy_ – Introducerede et helt nyt værktøj og en deployment-pipeline.
- _Keep users logged in across navigations on Vercel_ – fixede to sammenhængende auth-bugs, der kun ramte produktionsmiljøet
  (beskrevet i [03_arkitektur.md](./03_arkitektur.md#authentication) under _Authentication_).

**Tommelfingerreglen har således været:** Hvis en PR isoleret set løser én større opgave, tildeles den en sigende titel. Hvis den samler op på løbende, mindre justeringer i løbet af arbejdsdagen, anvendes datoformatet.

## Den typiske arbejdsdag

1. **Pull:** Starter dagen med at udføre `git pull` på `develop`-branchen for at sikre, at jeg har den nyeste kode.
2. **Udvikling:** Ændringer og nye funktioner kodes og committes i små, logiske intervaller. Hvis en ændring i funktionaliteten kræver flere commits, holder jeg dem atomiske – én isoleret ændring pr. commit.
3. **Push:** Koden skubbes løbende til GitHub med `git push origin develop` for at sikre backup og versionsstyring i skyen - så ændringerne er sikret på GitHub.
4. **Oprettelse af Pull Request (PR):** PR åbner en pull request fra `develop` mod `main` enten via GitHubs webinterface eller CLI-værktøjet (`gh pr create`). PR-titlen får dato-format (eller en beskrivende titel, hvis der er tale om en større arkitektonisk ændring).
5. **Test i preview-miljø:** Vercel genererer automatisk en unik preview-URL direkte i Pull Requesten. Jeg åbner denne URL for at teste ændringerne i et isoleret cloud-miljø, der spejler produktionsmiljøet med hensyn til (Node-version, miljøvariabler og database).
6. **Merge:** Hvis preview-miljøet opfører sig som forventet, merger jeg koden ind i `main`. Vercel deployer automatisk til produktionsmiljøet.
7. **Oprydning (Cleanup):** GitHub er konfigureret til ikke automatisk at slette `develop`-branchen efter et merge, da den fungerer som en permanent og gennemgående udviklings-branch igennem hele projektforløbet.

## Hvad der virker, og hvad jeg ville lave anderledes på et team

### Hvorfor modellen fungerer i den nuværende fase

- **Kvalitetssikring:** Hver kode-ændring har et review-trin (selvevaluering via PR-diffen), så jeg fanger fejl inden produktion.
- **Isolerede testmiljøer:** Hver PR får sin egen preview-deployment, så jeg sikrer, at applikationen testes på en live server (rigtig URL), under reelle betingelser frem for udelukkende på `localhost`.
- **Ren historik:** Historikken på `main`-branchen bevares overskuelig, da den udelukkende består af afsluttede og testede merge-commits.

### Hvad jeg ville ændre i et team-setup

Hvis projektet skulle skaleres til et team-setup, ville følgende ændringer være nødvendige:

- **Isolerede feature-branches:** Udviklingen skulle flyttes væk fra den fælles `develop`-branch til dedikerede branches navngivet efter den specifikke opgave (f.eks. `feature/profile-redesign` eller `fix/event-validation`). At lade flere udviklere arbejde direkte på samme langlivede branch vil føre til hyppige merge-konflikter.
- **Branch Protection og Peer Reviews:** Der skulle implementeres required reviews og branch protection på `main`, så kode udelukkende kan merges efter godkendelse fra mindst én anden udvikler.
- **Automatiseret CI-pipeline:** Continuous Integration (CI) bør integreres som en obligatorisk kontrolmekanisme på alle PR'er. CI-pipelines skal automatisk afvikle linting, typechecking og enhedstest (`npm run lint`, `npm run test`). Lige nu køres disse udelukkende manuelt på den lokale maskine via "npm run lint" som jeg har kørt lokalt, men det er en disciplin der bør være automatiseret.
- **Beskrivende PR-titler i stedet for datoformat:** Dato-baserede navngivningsformat skulle erstattes af beskrivende titler. Dette er afgørende for, at et samlet team hurtigt kan scanne PR-historikken og afkode, hvad hver enkelt ændring bidrager med, uden at skulle dykke ned i de enkelte commits.

Det nuværende datoformat er en bevidst branch-struktur, der passer til et solo-projekt i POC-fasen. Det står dog øverst på listen over processer, der skal omlægges, hvis platformen vokser eller udvides med flere udviklere på projektet.
