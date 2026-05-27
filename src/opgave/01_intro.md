# Intro

**See you there** (arbejdstitel) er en digital platform, der skal samle mennesker omkring fysiske steder ved at lade brugere oprette og dele begivenheder. Brugerne kan interagere med hinanden ved at deltage, kommentere og like hinandens begivenheder. Visionen er et selvkørende økosystem, hvor det er brugerne selv, der skaber det relevante indhold, og hvor sponsorerede events fra virksomheder på sigt kan supplere det organiske indhold.

## Krav til løsning
- Sitet skal fungere både på desktop og mobil
- Det skal være let for brugeren at få overblik over, hvad der sker på deres favoritsteder
- Platformen skal opleves tryg og gennemsigtig — både hvad angår data, moderation og hvem der står bag et event
- Sitet skal på sigt kunne fungere i flere lande, men jeg starter i Danmark, da det er her, jeg har kendskab til kultur og steder
- Det skal være nemt for kommende udviklere og administratorer at navigere i systemet og vedligeholde det

## Overvejelser
Jeg har overvejet, om løsningen skulle have været en native app i stedet for en webapplikation. Valget om at bygge den som web giver mig mulighed for hurtigere at afprøve idéer og nå både mobil- og desktop-brugere uden at skulle vedligeholde to separate kodebaser.

En relevant mellemvej er en **PWA (Progressive Web App)**, som via service workers kan tilbyde nogle af de samme fordele som en native app — fx offline-funktionalitet og mulighed for at blive installeret på hjemskærmen. Det kunne være særligt nyttigt i denne use case, hvor brugeren fx kan have brug for at se en gemt begivenhed offline for at finde adresse eller andre praktiske oplysninger, når der ikke er stabil forbindelse.
