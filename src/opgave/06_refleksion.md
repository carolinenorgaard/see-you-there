# Refleksion og konklusion

## Fra proof of concept til rigtigt produkt

Da jeg startede dette afsluttende eksamensprojekt, var målet et proof of concept — noget der skulle vise, at idéen kunne hænge sammen teknisk. Undervejs flyttede ambitionen sig. Jeg endte med at købe et domæne, sætte rigtig e-mail op, og bygge platformen så den faktisk kunne bruges, ikke kun demonstreres. Sitet kører nu på [see-you-there.dk](https://see-you-there.dk), og det ændrer på, hvad denne refleksion handler om: mindre om "hvad mangler", og mere om "hvad har jeg lært af at få det op at stå".

Set i forhold til [de fem krav fra introen](./01_intro.md) er det meste på plads. Sitet virker på mobil og desktop, login og data er sikret, og datamodellen er klar til flere lande, når det bliver aktuelt. To krav er kun delvist landet: et geografisk kort, der ville vise "hvad sker der tæt på mig" mere direkte end filtrene gør, og den sociale tryghed omkring hvem der står bag et event. Det sidste er ikke et teknisk problem, men hører til i en produktfase, jeg ikke er kommet til endnu.

## Hvad jeg tog med mig teknisk

Det jeg især har taget med mig fra det tekniske, er hvor meget der bliver lettere, når frontend og backend ligger i samme applikation, og man tør stole på et frameworks standardløsninger. Delte typer, intet separat API at vedligeholde, login og adgangskontrol der allerede ligger der — det er småting hver for sig, men tilsammen har det betydet, at jeg har turdet lave ændringer i datamodellen undervejs, som jeg ellers ville have udskudt. Det er den slags fordel, der ikke vises i en feature-liste, men som mærkes hver eneste arbejdsdag.

Det jeg er mest stolt af, er filtreringen på events- og lokations-siderne. Når brugeren vælger en kategori eller et område, gemmes valget direkte i webadressen — så et filtreret view kan deles som link, gemmes som bogmærke, og tilbage-knappen virker, som man forventer.

## Hvad jeg tog med mig om processen

Det jeg især har bidt mærke i undervejs, er at selv en kort, uformel brugertest fanger ting, jeg ikke selv ser. Som udvikler ved jeg jo, hvad knapperne gør og hvor de fører hen — det er svært at se sin egen side med friske øjne. En enkelt udefrakommende foran sitet peger på friktioner, som timers selvkritik aldrig ville have fanget. Det er en disciplin, jeg vil prioritere langt tidligere i kommende projekter.

Den anden ting handler om at arbejde alene. Jeg har bygget hele produktet — frontend, backend, datamodel, design og drift — uden faste sparringspartnere. Jeg fandt ud af, at jeg kan det, og det har givet mig en anden tro på, hvad jeg kan føre i mål selv. Men jeg fandt også ud af, hvor stille det bliver, når der ikke er nogen til at sige "har du tænkt på dét?". Næste gang vil jeg vælge at arbejde i en gruppe, hvis jeg kan.

## Hvad der står tilbage

Projektet er endt som et reelt produkt, men det er stadig bygget på bevidste fravalg. Formelle personas og kunderejser er ikke udarbejdet, indholdsmoderation gennem administrationspanelet er ikke afklaret, og tilgængeligheden er ikke målt systematisk. Det skal alt sammen håndteres, før platformen kan åbnes for et bredere publikum.

Næste skridt efter eksamen er en struktureret brugertest, kommentartråde på events, et notifikationssystem og et interaktivt kort, der kan erstatte det geografiske filter.

## Konklusion

Da jeg startede, ville jeg gerne finde ud af, om idéen kunne lade sig gøre. Jeg slutter med at vide, at den kan — og jeg står tilbage med en kodebase, et domæne og en arkitektur, der lever videre, når eksamen er overstået. Det er meget længere, end jeg havde regnet med at komme.

De største udfordringer fremover er ikke længere tekniske. De handler om indhold, datakvalitet, og om at skabe en social oplevelse, der opleves som tryg. Det er det, jeg gerne vil i gang med næste.
