# Intro

**See you there** (arbejdstitel) er en digital platform, der skal samle mennesker omkring fysiske steder ved at lade brugere oprette og dele begivenheder. Brugerne kan interagere med hinanden ved at deltage, kommentere og like hinandens begivenheder. Visionen er et selvkørende økosystem, hvor det er brugerne selv, der skaber det relevante indhold, og hvor sponsorerede events fra virksomheder på sigt kan supplere det organiske indhold.

## Hvem står bag

Projektet er udviklet af mig, Caroline Norgaard Elmer, som eneste udvikler. Min styrke ligger i koden, og jeg har bevidst prioriteret **arkitektur og fundament** højest — så projektet står med en solid teknisk base, hvor nye udviklere senere kan komme til uden at skulle rive ned først.

Den prioritering har naturligvis en pris. Med kun én person på opgaven har jeg ikke haft tid til at give alle dele af projektet samme dybde — særligt **brugertest** og en mere fyldestgørende **Figma-designfase** er områder, der er nedprioriteret til fordel for at få den tekniske kerne på plads. Det er bevidste fravalg, ikke forglemmelser, og noget jeg vender tilbage til løbende i de følgende afsnit.

Projektet er **open source** og ligger frit tilgængeligt på GitHub. Ligesom platformen i sig selv handler om at samle mennesker omkring fælles oplevelser, er håbet at også koden kan blive et lille fællesskab — hvor andre udviklere kan kigge med, foreslå forbedringer eller bidrage med nye funktioner. Den åbenhed er også en del af grunden til, at jeg har prioriteret arkitektur og dokumentation så højt: jo lettere det er for en udefrakommende at forstå projektet, desto større er chancen for at de rent faktisk gider bidrage.

## Krav til løsning

- Sitet skal fungere på både desktop og mobil.
- Det skal være let for brugeren at få overblik over aktiviteter, så de nemt kan filtrere dem ud fra område og præferencer. Derudover skal det være tydeligt, hvilke lokationer der allerede er oprettet begivenheder på.
- Platformen skal opleves som tryg og gennemsigtig i forhold til datahåndtering, moderation samt information om, hvem der står bag de enkelte events og hvilke brugere der har tilmeldt sig.
- På sigt er det hensigten, at platformen skal kunne fungere i flere lande, men udviklingen starter i Danmark, da det er her, jeg har størst kendskab til kultur og lokale steder.
- Det skal være nemt for kommende udviklere og administratorer at navigere i systemet og vedligeholde det.

## Overvejelser

Jeg har overvejet, om løsningen skulle have været en native app i stedet for en webapplikation. Valget om at udvikle den som webapplikation giver mulighed for hurtigere at afprøve idéer samt nå både mobil og desktop-brugere uden at skulle vedligeholde to separate kodebaser.

En relevant mellemvej er en **PWA (Progressive Web App)**, som via service workers kan tilbyde nogle af de samme fordele som en native app, for eksempel offline-funktionalitet og mulighed for at blive installeret på hjemmeskærmen. Dette kunne være særligt nyttigt i denne use case, hvor brugeren for eksempel kan have behov for at tilgå gemte begivenheder offline for at finde adresser eller andre praktiske oplysninger ved manglende internetforbindelse.
