# My Car Workshop

Officina online per la manutenzione della tua auto

## Inizializzazione del progetto

### 1. Backend: generazione del progetto base Java con Spring Boot

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

Primo avvio: docker compose up --detach

Check status container: docker ps

Pausa: docker compose stop

Riprendi: docker compose start

Reset container ma senza perdere i dati sul volume: docker compose down

Log in tempo reale: docker compose logs -f

### 3. Configurazione Spring Boot (Connessione al DB) e Verifica della Connessione

Il file di configurazione del back-end è situato al percorso backend/src/main/resources/application.properties

Per avviare l'applicazione Spring Boot lanciare: ./mvnw spring-boot:run dall'interno della cartella backend