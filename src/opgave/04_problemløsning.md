# Problemløsning

## Brugeroprettelse
En af de første tekniske udfordringer var at håndtere brugeroprettelse og login på en måde, der både er sikker og enkel at vedligeholde. I stedet for at bygge et auth-system fra bunden valgte jeg at bruge Payloads indbyggede `users`-collection, som leverer hashing af passwords, sessions og rolle-baseret adgangskontrol ud af kassen. Det er en bevidst beslutning om at læne sig op ad et veletableret framework's defaults frem for at finde på noget selv på et sikkerhedsfølsomt område, hvor egne fejl kan have store konsekvenser.

Den eneste tilpasning jeg har lavet oven på Payloads default-auth er at begrænse `/logout` til `POST`. Det skyldes en konkret bug jeg opdagede i produktion: et `<Link href="/logout">` blev prefetchet af Next.js i produktion (men ikke i dev) og loggede dermed brugeren ud bare ved at rendere siden. Den ændring er beskrevet i en commit-besked, så den ikke utilsigtet bliver rullet tilbage.

Jeg overvejer stadig på sigt at skifte til **Clerk** som auth-leverandør. Jeg har ikke selv arbejdet med det endnu, men har set flere udviklere omtale det positivt — særligt for de færdige UI-komponenter, sociale logins og den indbyggede håndtering af sessions og MFA. Det er noget, jeg gerne vil undersøge nærmere i fremtiden. På det nuværende POC-stadie vurderer jeg dog, at Payloads indbyggede auth er tilstrækkeligt, og at det ikke giver mening at trække en ekstern auth-tjeneste ind, før jeg ved mere om, hvilke krav projektet reelt får.

## Hosting, storage og mail

### Hosting
Applikationen hostes på **Vercel**, som er den anbefalede platform til Next.js. Det giver automatiske preview-deployments pr. pull request, indbygget CDN og et gratis hobby-tier, der er rigeligt til en prototype.

Jeg har også overvejet at hoste projektet selv via **Coolify** på en egen server. Det ville give fuld kontrol over driften og potentielt lavere omkostninger på sigt, hvis platformen vokser ud af Vercels gratis tier. Men det er unødvendigt på nuværende stadie og ville kræve indsigt i egen serveropsætning (drift, sikkerhed, backups, SSL-certifikater m.m.) — ressourcer projektet ikke har lige nu. Det er noget, der giver mening at vende tilbage til, hvis hostingomkostningerne på Vercel bliver en reel begrænsning.

### Database
Databasen kører på **MongoDB Atlas**, som er en managed MongoDB-hosting med et gratis cluster. Det fjerner driftsarbejdet med at vedligeholde en database selv og giver indbyggede backups og monitoring.

### Storage
Vercels serverless miljø har ikke et persistent filsystem, så uploads kan ikke gemmes lokalt. I stedet bruger jeg **Vercel Blob** sammen med Payloads `@payloadcms/storage-vercel-blob`-adapter. Det giver en fuldt managed object storage, der er tæt integreret med resten af hosting-opsætningen og leveres via Vercels CDN.

**Fordel:** Det var meget hurtigt at sætte op. Adapteren konfigureres med få linjer i `payload.config.ts`, og fordi jeg allerede hoster på Vercel, ligger filerne tæt på Next.js-applikationen og leveres via samme CDN — uden ekstra konto eller IAM-opsætning.

**Ulempe:** På Vercels hobby-tier får man kun 1 GB Blob storage gratis. Det er tilstrækkeligt til en POC, men hvis platformen vokser, og brugerne begynder at uploade billeder til deres begivenheder for alvor, vil det hurtigt blive en omkostning at tage stilling til. Det naturlige skifte vil i så fald være at flytte hele driften over på **Coolify** på egen server (nævnt ovenfor under hosting), så jeg samtidig kan hoste min egen object storage dér — frem for at sprede mig over flere managed services hver med deres egen regning.

### Mail
På nuværende tidspunkt sender jeg transaktionel mail (verifikation af konto, glemt password m.m.) via en **Gmail-konto**, jeg har oprettet specifikt til projektet. Det er ikke den optimale løsning — Gmail har sendekvoter og er ikke beregnet til systemudsendt mail, så pålideligheden vil falde, hvis volumen stiger — men det virker for nu på POC-stadiet.

På sigt er der to retninger, jeg vil overveje:
- Skifte til en dedikeret transaktionel mail-udbyder som **Resend**, hvis Payload fortsat skal stå for auth-flowet.
- Hvis mails udelukkende handler om brugeroprettelse og password-reset, kan det give mere mening at lade en auth-leverandør som **Clerk** håndtere det hele, så jeg helt slipper for at vedligeholde mail-templates og SMTP-konfiguration selv.
