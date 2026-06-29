# Architettura Enterprise Core/Shared/Features

Core: Singleton Services, Guardie e Interceptors (Infrastruttura globale)

Layout: Componenti comuni a tutte le pagine (Header, Footer, Sidebar, ecc.)

Features: Componenti specifici per ogni funzionalità dell'applicazione (Login, Registrazione, Gestione Utenti, Gestione Veicoli, Gestione Appuntamenti, ecc.) caricati in LAZY LOADING tramite il routing.

## File di configurazione principale: app.routes.ts
Ha il compito di definire le rotte principali dell'applicazione e di caricare i moduli delle funzionalità in LAZY LOADING, cioè solo quando l'utente naviga verso una determinata funzionalità, il relativo modulo viene caricato in memoria.

## Guardia: auth.guard.ts

Implementa una guardia di autenticazione per le rotte dell'applicazione Angular. La guardia verifica se l'utente è autenticato prima di consentire l'accesso a determinate rotte protette. Se l'utente non è autenticato, viene reindirizzato alla pagina di login e l'URL originale viene passato come parametro di query (returnUrl) per consentire un'esperienza utente fluida.

## Shell di Autenticazione: auth-shell.component.ts

Questo componente rappresenta il contenitore grafico minimale per le pagine di login e registrazione.

## Main Shell: main-shell.component.ts

Questo componente rappresenta il layout strutturale per l'area autenticata dell'applicazione, centralizzando gli elementi comuni della Dashboard (Sidebar, Header, Pulsante di Logout) e riducendo la duplicazione di codice nei componenti di business. Contiene un router-outlet per il rendering dei componenti figli (Dashboard, Veicoli, Appuntamenti) e gestisce il logout dell'utente.

