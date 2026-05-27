# Workflow

## Versionsstyring med Git og GitHub

Hele projektet ligger i et Git-repository hostet på GitHub. Selvom det er et solo-projekt på POC-stadiet, har jeg valgt at bruge en lille, disciplineret branching-model frem for at committe direkte til `main`. Det giver tre konkrete gevinster: en ren historik, mulighed for at rulle ændringer tilbage pr. PR i stedet for pr. commit, og — vigtigst — at Vercel automatisk genererer en preview-deployment for hver pull request, så jeg kan teste ændringer på et rigtigt URL inden de rammer produktion.

## Branch-struktur — main + develop

```
main      ← production (deployes automatisk til see-you-there.vercel.app)
develop   ← feature-branch (deployes automatisk til en preview-URL pr. PR)
```

- **`main`** er min produktionsbranch. Den må kun modtage kode via merget pull request. Hver merge til `main` udløser en deployment til produktions-URL'en på Vercel.
- **`develop`** er der hvor jeg arbejder. Når en ændring (eller en samling af ændringer) er klar, åbner jeg en PR fra `develop` mod `main`, gennemgår diffen, og merger.

På et team ville `develop` typisk være en langlivet branch hvor flere udviklere kører deres egne feature-branches ind, og hvor man måske også havde en separat `staging` mellem `develop` og `main`. På et solo-projekt giver det ikke værdi at lave det skel — jeg er den eneste der laver PR'er, og Vercels per-PR preview erstatter behovet for et separat staging-miljø.

## Navngivning af pull requests

Jeg har bevidst valgt en let-genkendelig, **dato-baseret navngivning** for de fleste PR'er:

```
26-05-2026        ← første PR den 26. maj 2026
26-05-2026.2      ← anden PR samme dag
26-05-2026.3      ← tredje PR samme dag
...
26-05-2026.7      ← syvende PR samme dag
```

Når jeg får lavet flere afgrænsede stykker arbejde på samme dag (refactor, ny feature, lille bugfix), åbner jeg en PR pr. stykke i stedet for at samle det hele i én stor PR. Suffixet `.2`, `.3` osv. holder titlerne unikke og sorter naturligt kronologisk i GitHub's PR-liste. Det er en meget pragmatisk navngivning — den fortæller ikke hvad PR'en indeholder, kun *hvornår* den blev lavet — men koblet med Conventional Commits inde i selve PR'en (se nedenfor) er det nok til at jeg kan finde tilbage til en given ændring.

**Undtagelse**: når en PR løser noget særligt eller introducerer en større feature, får den en beskrivende titel i stedet. Eksempler fra historikken:

- `Add Storybook with stories and GitHub Pages deploy` — introducerede et helt nyt værktøj og en deployment-pipeline.
- `keep users logged in across navigations on Vercel` — fixede to sammenhængende auth-bugs der kun ramte produktion (beskrevet i `03_problemløsning.md`).

Tommelfingerreglen er: hvis PR'en gør én ting og kan beskrives i én sætning, fortjener den en rigtig titel. Hvis den samler "dagens arbejde" på tværs af flere små ting, får den dato-formatet.

## Den typiske arbejdsdag

1. **Pull**: starter dagen med `git pull` på `develop` så jeg har den nyeste kode.
2. **Arbejd**: laver ændringer og committer i små logiske steps. Hvis en ændring kræver flere commits, holder jeg dem atomiske — én ting pr. commit.
3. **Push**: `git push origin develop` så ændringerne er sikret på GitHub.
4. **PR**: åbner en pull request fra `develop` mod `main` via GitHub-UI eller `gh pr create`. Titlen får dato-format (eller en beskrivende titel hvis det er en større ting).
5. **Preview-test**: Vercel poster automatisk et preview-URL i PR'en. Jeg åbner det og tester ændringen i et miljø der spejler produktion (samme Node-version, samme env vars, samme database).
6. **Merge**: hvis preview ser ud som forventet, merger jeg PR'en til `main`. Vercel deployer automatisk til produktion.
7. **Cleanup**: GitHub er konfigureret til ikke automatisk at slette `develop`-branchen efter merge — den lever videre som min vedvarende feature-branch.

## Hvad der virker, og hvad jeg ville lave anderledes på et team

**Det virker fordi**:
- Hver ændring har et review-trin (selv hvis det er mig selv der reviewer), så jeg fanger fejl inden produktion.
- Hver PR får sin egen preview-deployment, så jeg tester på et rigtigt URL i stedet for kun på `localhost`.
- Historikken på `main` er en serie af merge-commits der hver svarer til en testet, deployet ændring.

**Hvad jeg ville ændre i et team-setup**:
- **Korte, beskrivende branch-navne pr. feature** (`feature/profile-redesign`, `fix/event-validation`) i stedet for at hænge alt på `develop`. Med flere udviklere er en enkelt langlivet branch en flaskehals.
- **Required reviews** og branch protection på `main`, så ingen kan merge uden mindst én anden persons godkendelse.
- **CI-pipeline** der kører lint, typecheck og tests på hver PR. Lige nu er der ingen automatisk gate — jeg har kørt `pnpm lint` og `pnpm test` lokalt, men det er en disciplin der bør være automatiseret.
- **Beskrivende PR-titler** i stedet for dato-format, så det er muligt at scanne PR-listen og se hvad hver ændring gjorde, uden at skulle åbne den enkelte PR.

Dato-formatet er en bevidst forenkling der passer til et solo-projekt i POC-fasen. Hvis platformen vokser, eller hvis andre udviklere kommer ind på projektet, er det første jeg ville lægge om.
