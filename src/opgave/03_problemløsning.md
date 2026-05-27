# Problemløsning

## Brugeroprettelse
En af de første tekniske udfordringer var at håndtere brugeroprettelse og login på en måde, der både er sikker og enkel at vedligeholde. I stedet for at bygge et auth-system fra bunden valgte jeg at bruge Payloads indbyggede `users`-collection, som leverer hashing af passwords, sessions og rolle-baseret adgangskontrol ud af kassen.

Konkrete beslutninger undervejs:
- **Cookie-baseret session frem for token i localStorage**, fordi `httpOnly`-cookies ikke kan tilgås fra JavaScript og dermed begrænser angrebsfladen for XSS.
- **`/logout` er begrænset til POST**, så et prefetch af et `<Link href="/logout">` ikke utilsigtet kan logge brugeren ud.
- **Brug af Payloads `payload.auth`** i stedet for at lave et internt fetch til `/api/users/me` — det undgår unødvendige HTTP-kald og potentielle problemer med cookie-videresendelse i server components.
- **CSRF-konfiguration** der tillader Vercels preview-URL'er, så test af pull requests fungerer uden at åbne for vilkårlige origins i produktion.

Jeg overvejer stadig på sigt at skifte til **Clerk** som auth-leverandør. Jeg har ikke selv arbejdet med det endnu, men har set flere udviklere omtale det positivt — særligt for de færdige UI-komponenter, sociale logins og den indbyggede håndtering af sessions og MFA. Det er noget, jeg gerne vil undersøge nærmere i fremtiden. På det nuværende POC-stadie vurderer jeg dog, at Payloads indbyggede auth er tilstrækkeligt, og at det ikke giver mening at trække en ekstern auth-tjeneste ind, før jeg ved mere om, hvilke krav projektet reelt får.

## Hosting, storage og mail

### Hosting
Applikationen hostes på **Vercel**, som er den anbefalede platform til Next.js. Det giver automatiske preview-deployments pr. pull request, indbygget CDN og et gratis hobby-tier, der er rigeligt til en prototype.

Jeg har også overvejet at hoste projektet selv via **Coolify** på en egen server. Det ville give fuld kontrol over driften og potentielt lavere omkostninger på sigt, hvis platformen vokser ud af Vercels gratis tier. Men det er unødvendigt på nuværende stadie og ville kræve indsigt i egen serveropsætning (drift, sikkerhed, backups, SSL-certifikater m.m.) — ressourcer projektet ikke har lige nu. Det er noget, der giver mening at vende tilbage til, hvis hostingomkostningerne på Vercel bliver en reel begrænsning.

### Database
Databasen kører på **MongoDB Atlas**, som er en managed MongoDB-hosting med et gratis cluster. Det fjerner driftsarbejdet med at vedligeholde en database selv og giver indbyggede backups og monitoring.

### Storage
Vercels serverless miljø har ikke et persistent filsystem, så uploads kan ikke gemmes lokalt. I stedet bruger jeg **Vercel Blob** sammen med Payloads `@payloadcms/storage-vercel-blob`-adapter. Det giver en fuldt managed object storage, der er tæt integreret med resten af hosting-opsætningen og leveres via Vercels CDN.

**Fordel:** Det var meget hurtigt at sætte op. Adapteren konfigureres med få linjer i `payload.config.ts`, og fordi jeg allerede hoster på Vercel, var der ingen ekstra konto, IAM-opsætning eller bucket-policy at forholde sig til, som man ville have med fx AWS S3.

**Ulempe:** På Vercels hobby-tier får man kun 1 GB Blob storage gratis. Det er tilstrækkeligt til en POC, men hvis platformen vokser, og brugerne begynder at uploade billeder til deres begivenheder for alvor, vil det hurtigt blive en omkostning at tage stilling til — enten ved at opgradere planen eller ved at skifte til en billigere S3-kompatibel udbyder som Cloudflare R2.

### Mail
På nuværende tidspunkt sender jeg transaktionel mail (verifikation af konto, glemt password m.m.) via en **Gmail-konto**, jeg har oprettet specifikt til projektet. Det er ikke den optimale løsning — Gmail har sendekvoter og er ikke beregnet til systemudsendt mail, så pålideligheden vil falde, hvis volumen stiger — men det virker for nu på POC-stadiet.

På sigt er der to retninger, jeg vil overveje:
- Skifte til en dedikeret transaktionel mail-udbyder som **Resend**, hvis Payload fortsat skal stå for auth-flowet.
- Hvis mails udelukkende handler om brugeroprettelse og password-reset, kan det give mere mening at lade en auth-leverandør som **Clerk** håndtere det hele, så jeg helt slipper for at vedligeholde mail-templates og SMTP-konfiguration selv.
