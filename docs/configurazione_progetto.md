# My Car Workshop

Officina online per la manutenzione della tua auto

1. AVVIA DOCKER: 
docker compose up --detach

2. AVVIA SPRING-BOOT:
./mvnw spring-boot:run 
dall'interno della cartella backend

3. AVVIA ANGULAR:
ng serve
dall'interno della cartella frontend

## Configurazione BACKEND

### 1. Generazione dell'architettura base Java con Spring Boot

Metadati:

- Project: Maven

- Language: Java

- Spring Boot: 4.1.0

- Group: com.mycarworkshop

- Artifact: backend

- Package name: com.mycarworkshop.backend

- Packaging: Jar

- Java: 17

Dipendenze:

- Spring Web: per esporre le API REST che Angular chiamerà e per implementare il Pattern MVC.

- Spring Data JPA: per la persistenza dei dati, l'uso dei Repository e per gestire l'Optimistic Locking.

- Spring Security: per soddisfare la specifica funzionale sull'autenticazione (login/password) e per la futura integrazione dei token JWT.

- MySQL Driver: driver relativo al database relazionale per il salvataggio di utenti, veicoli e appuntamenti.

### 2. Docker e MySQL per il database

Configurazione:

- image: mysql:9

- ports: mappiamo la porta standard 3306 del container sulla porta 3306 del PC

- environment: inietta le variabili d'ambiente per creare automaticamente il database (my_car_workshop_db) e un utente dedicato con relativi permessi all'avvio.

- volumes: crea un volume persistente (mysql_data). Fa in modo che i dati salvati (utenti, veicoli, appuntamenti) non vengano distrutti quando il container viene spento.

PRIMO AVVIO: docker compose up --detach

Check status container: docker ps

Pausa: docker compose stop

Riprendi: docker compose start

Reset container ma senza perdere i dati sul volume: docker compose down

Log in tempo reale: docker compose logs -f

### 3. Configurazione Spring Boot (Connessione al DB) e Verifica della Connessione

Il file di configurazione del back-end è situato al percorso backend/src/main/resources/application.properties

Per avviare l'applicazione Spring Boot lanciare: ./mvnw spring-boot:run dall'interno della cartella backend

### 4. Definizione Modelli (Entity), Repository, Controller e Service
- Modelli (Entity): rappresentano le tabelle del database e sono definiti nel package backend/src/main/java/com/mycarworkshop/backend/model
- Repository: interfacce che estendono JpaRepository e forniscono metodi per accedere ai dati nel database, definiti nel package backend/src/main/java/com/mycarworkshop/backend/repository
- Controller: classi che gestiscono le richieste HTTP e invocano i metodi dei service, definiti nel package backend/src/main/java/com/mycarworkshop/backend/controller
- Service: classi che contengono la logica di business e interagiscono con i repository

### 5. Configurazione CORS per permettere al front-end Angular di chiamare le API REST del back-end Spring Boot

Di base, i browser web implementano una regola di sicurezza chiamata Same-Origin Policy la quale impedisce a un'applicazione web di fare richieste HTTP a un dominio diverso da quello da cui è stata caricata. Per permettere al front-end Angular di chiamare le API REST del back-end Spring Boot, è necessario configurare il CORS (Cross-Origin Resource Sharing) nel back-end.
La configurazione CORS è stata implementata nel file backend/src/main/java/com/mycarworkshop/backend/config/CorsConfig.java

### 6. Configurazione Spring Security per l'autenticazione e l'autorizzazione
La configurazione di Spring Security è stata implementata nel file backend/src/main/java/com/mycarworkshop/backend/config/SecurityConfig.java. 
In questa configurazione, abbiamo definito le regole di accesso alle varie rotte dell'applicazione, specificando quali rotte sono pubbliche e quali richiedono l'autenticazione. Inoltre, abbiamo configurato un filtro personalizzato per gestire l'autenticazione basata su username e password, e abbiamo definito un gestore di accesso negato per gestire i casi in cui un utente non autenticato tenta di accedere a una risorsa protetta.

## Configurazione FRONTEND

### 1. Generazione dell'architettura base Angular

Generazione della struttura del frontend tramite Angular:
ng new frontend --routing --style=scss

Avvio del frontend Angular: ng serve dall'interno della cartella frontend

### 2. Definizione architettura Frontend Core/Shared/Features

File di configurazione principale 'app.routes.ts': ha il compito di definire le rotte principali dell'applicazione e di caricare i moduli delle funzionalità in LAZY LOADING, cioè solo quando l'utente naviga verso una determinata funzionalità, il relativo modulo viene caricato in memoria.

Core: Singleton Services, Guardie e Interceptors (Infrastruttura globale)

Layout: Componenti comuni a tutte le pagine (Header, Footer, Sidebar, ecc.)

Features: Componenti specifici per ogni funzionalità dell'applicazione (Login, Registrazione, Gestione Utenti, Gestione Veicoli, Gestione Appuntamenti, ecc.) caricati in LAZY LOADING tramite il routing.

