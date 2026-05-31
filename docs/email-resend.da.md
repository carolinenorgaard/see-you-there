# Email — Resend-adapter

Produktion sender e-mails gennem [Resend](https://resend.com)'s API via `@payloadcms/email-resend`. Dev falder tilbage på en console-adapter når der ikke er nogen API-nøgle, så vi ikke ved et uheld kommer til at sende rigtige mails fra en lokal kørsel.

## Konvention

`src/payload.config.ts` vælger adapter ud fra `RESEND_API_KEY`:

```ts
email: process.env.RESEND_API_KEY
  ? resendAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS!,
      defaultFromName: process.env.EMAIL_FROM_NAME || 'See You There',
      apiKey: process.env.RESEND_API_KEY,
    })
  : consoleEmailAdapter,
```

- **`RESEND_API_KEY` til stede** → rigtige mails via Resend.
- **`RESEND_API_KEY` mangler eller tom** → `consoleEmailAdapter` skriver mailen til server-loggen i stedet.

## Env-vars

| Variabel | Krævet? | Bemærkning |
| --- | --- | --- |
| `RESEND_API_KEY` | Kun i prod | Opret på https://resend.com/api-keys. Tom/manglende ⇒ console-fallback. |
| `EMAIL_FROM_ADDRESS` | Når Resend bruges | Brugt som `defaultFromAddress`. Skal være verificeret på din Resend-domæne. |
| `EMAIL_FROM_NAME` | Nej | Default `"See You There"`. |

Console-adapteren har sine egne hardcodede defaults (`dev@localhost` / `"See You There (dev)"`) — `EMAIL_FROM_*` ignoreres når den er aktiv.

## Console-adapteren

`src/email/consoleAdapter.ts` eksporterer `consoleEmailAdapter`. Den implementerer Payload's `EmailAdapter`-kontrakt og printer hver mail med `to`, `subject` og body (HTML eller text) til stdout. Returnerer en syntetisk `messageId` så Payload's egne hooks ikke fejler.

Brug den manuelt i en test eller et script ved at importere fra `@/email/consoleAdapter`.

## Historik

Indtil `22f7b17` (2026-05-30) brugte projektet `@payloadcms/email-nodemailer` med Gmail SMTP. SMTP-konfigurationen (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) er **ikke længere** i `.env.example` og bliver ignoreret hvis de står i en lokal `.env`. Slet dem.

## Verifikation

Lokal smoke-test uden API-nøgle (forventer at se mailen i terminalen, ikke i en indbakke):

```bash
unset RESEND_API_KEY
npm run dev
# trigge en email-flow (fx password-reset) og kig i terminalen
```

Med API-nøgle: sæt `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` (verificeret), restart dev-serveren, og trigg samme flow.
