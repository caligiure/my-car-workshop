# Architettura Backend - Analisi Tecnica Dettagliata

Questo documento fornisce un'analisi tecnica approfondita dell'architettura backend del progetto **My Car Workshop**. Il backend è stato progettato seguendo i principi dell'architettura a strati (Layered Architecture) utilizzando il framework Spring Boot, garantendo scalabilità, manutenibilità e un elevato livello di sicurezza.

---

## 🛠️ 1. Stack Tecnologico e Dipendenze
Il progetto è costruito sulla JVM ed è gestito tramite **Maven**. Le tecnologie principali includono:

- **Java 17**: Sfrutta le funzionalità moderne del linguaggio, come i Text Blocks e i Record (ove applicabile).
- **Spring Boot 4.x**: Il core framework che gestisce l'Inversion of Control (IoC), l'auto-configurazione e il ciclo di vita dei bean.
- **Spring WebMVC**: Gestisce l'esposizione delle API RESTful, il routing HTTP e la serializzazione/deserializzazione JSON tramite Jackson.
- **Spring Security**: Il motore di sicurezza che protegge l'applicazione, configurato per operare in modalità **Stateless**.
- **Spring Data JPA / Hibernate**: Astrazione per l'accesso ai dati (ORM) che mappa le classi Java (Entity) sulle tabelle del database relazionale.
- **MySQL Connector (mysql-connector-j)**: Driver JDBC per la comunicazione con il database MySQL.
- **JJWT (io.jsonwebtoken v0.11.5)**: Libreria crittografica per la generazione, firma e validazione dei token JWT.

---

## 🔐 2. Livello di Sicurezza (Security Layer)
La sicurezza è gestita nel package `com.mycarworkshop.backend.security` e `config`, ed è progettata attorno al pattern JWT (JSON Web Token).

### `SecurityConfig.java`
Il cuore della configurazione di Spring Security.
- **Session Policy**: Configura `SessionCreationPolicy.STATELESS`, indicando che il server non mantiene alcuna sessione in memoria. Ogni richiesta deve essere autenticata in modo indipendente.
- **Endpoint Authorization**: Definisce la catena di filtri (`SecurityFilterChain`). Endpoint come `/api/auth/**` e le `GET` su `/api/reviews` sono pubbliche (`permitAll()`). Tutte le altre rotte (es. `POST /api/reviews` o `/api/vehicles/**`) richiedono l'autenticazione. Specifiche rotte `/api/admin/**` richiedono il ruolo `ADMIN`.
- **Integrazione CORS**: Abilita e configura il Cross-Origin Resource Sharing tramite `CorsConfig`.

### `JwtAuthenticationFilter.java`
Un filtro custom che estende `OncePerRequestFilter`. Intercetta ogni singola richiesta HTTP prima che arrivi ai controller.
1. Estrae il token JWT dall'header `Authorization: Bearer <token>`.
2. Valida la firma criptografica e la scadenza tramite `JwtUtil`.
3. Estrae l'identità dell'utente (email/username) e invoca il `CustomUserDetailsService`.
4. Popola il `SecurityContextHolder` di Spring con l'utente autenticato, permettendo al resto dell'applicazione di sapere chi sta effettuando l'azione.

### `JwtUtil.java`
Classe utility (Componente) responsabile della crittografia.
- **Firma**: Utilizza l'algoritmo HMAC-SHA256 con una chiave segreta complessa.
- **Payload**: Inietta nei "claims" del token informazioni utili come il ruolo dell'utente (`ROLE_USER`, `ROLE_ADMIN`).
- **Scadenza**: Imposta un Time-To-Live (TTL) per prevenire l'uso indefinito dei token.

### `CustomUserDetailsService.java`
Implementa l'interfaccia standard di Spring Security `UserDetailsService`. Interroga lo `UserRepository` per caricare un utente dal database a partire dalla sua email, mappando i ruoli applicativi nelle `GrantedAuthority` riconosciute da Spring.

---

## 🌐 3. Livello Controller (API REST)
I controller (package `controller`) fungono da entry-point per il traffico HTTP. Sono annotati con `@RestController` e `@RequestMapping`.

- **`AuthController`**: Gestisce `/api/auth/login` e `/api/auth/register`. Riceve DTO (Data Transfer Objects), demanda la logica al servizio e restituisce `AuthResponseDTO` contenente il token JWT.
- **`UserController`**: Esporta endpoint protetti per visualizzare e aggiornare le informazioni del profilo dell'utente loggato.
- **`VehicleController`**: Espone le operazioni CRUD (Create, Read, Update, Delete) per i veicoli associati a un utente. Utilizza l'utente autenticato nel contesto di sicurezza per garantire che nessuno possa accedere ai veicoli altrui (Isolamento dei dati).
- **`BookingController`**: Controller per le operazioni legate alle prenotazioni (storico, creazione nuovi appuntamenti).
- **`ReviewController`**: Permette il fetch pubblico delle recensioni (per la Home Page) e la creazione autenticata (per la Dashboard).
- **`AdminController`**: Raggruppa endpoint privilegiati per il personale dell'officina (es. gestione e approvazione/rifiuto di appuntamenti globali).

---

## 🧠 4. Livello di Business (Service Layer)
Il package `service` contiene la vera "Intelligenza Applicativa" ed è pesantemente annotato con `@Service` e `@Transactional`.

- **`BookingService`**: È il servizio più complesso.
  - *Gestione Concorrenza*: Deve gestire la "race condition" in cui più utenti provano a prenotare nello stesso momento.
  - *Capacity Planning*: Gestisce l'entità `DailyAvailability`, verificando che la capienza massima (N auto) per una data non venga superata prima di confermare una prenotazione.
- **`VehicleService`**: Applica regole di business sui veicoli (es. validazione della targa o divieto di eliminare un veicolo se ha appuntamenti attivi/pendenti).
- **`UserService`**: Si occupa della registrazione sicura, applicando l'hashing della password tramite `BCryptPasswordEncoder` prima del salvataggio nel database.
- **`ReviewService`**: Gestisce l'aggiunta di recensioni, legandole automaticamente all'utente loggato.

---

## 💾 5. Livello Dati (Repository & Model)
Il livello di persistenza è strutturato tramite il pattern Repository di Spring Data JPA.

### Modello Dati (Entities)
Le classi nel package `model` sono annotate con `@Entity`. Mappano direttamente le tabelle relazionali.
- **`User`**: Rappresenta il cliente o l'admin (ruolo Enum).
- **`Vehicle`**: Contiene marca, modello, targa. È in relazione `ManyToOne` con `User`.
- **`Appointment`**: La prenotazione vera e propria. Collegata a `Vehicle` e `User`. Ha uno stato gestito da Enum (es. RICHIESTO, CONFERMATO, COMPLETATO).
- **`Review`**: Contiene il testo e il rating (stelle).
- **`DailyAvailability`**: Entità cruciale per tracciare quanti slot (capacità) sono liberi in un determinato giorno.

### Pattern DTO (Data Transfer Object)
Il package `dto` è essenziale per la sicurezza e la pulizia architetturale.
Le Entità del database **non vengono mai esposte direttamente verso l'esterno**. Al loro posto vengono usati i DTO (es. `BookingRequestDTO`, `UserProfileDTO`). Questo previene vulnerabilità come la "Mass Assignment" e l'esposizione accidentale di dati sensibili (come la password criptata dell'utente).

### Repository
Interfacce nel package `repository` che estendono `JpaRepository`.
Spring genera automaticamente l'implementazione SQL in fase di runtime. Permettono il salvataggio, l'eliminazione e l'esecuzione di "Derived Queries" (es. `findByEmail(String email)` nello `UserRepository` o `findByUserId(Long id)` nel `VehicleRepository`).

---

## 🔄 Flusso Esecutivo (Esempio: Creazione Appuntamento)
Per comprendere come i layer interagiscono, ecco cosa accade quando l'utente prenota un appuntamento:

1. Il Frontend Angular invia un JSON (`BookingRequestDTO`) tramite una `POST` a `/api/bookings`.
2. Il filtro `JwtAuthenticationFilter` intercetta la richiesta, valida il token e identifica l'utente `Mario`.
3. Il `BookingController` riceve il DTO e lo passa al `BookingService`.
4. Il `BookingService` inizia una transazione (`@Transactional`):
   - Usa il `VehicleRepository` per assicurarsi che il veicolo appartenga a `Mario`.
   - Consulta il `DailyAvailabilityRepository` per verificare che ci sia posto libero nell'officina in quella data.
   - Crea un oggetto `Appointment` e lo salva tramite `AppointmentRepository`.
   - Aggiorna (scala di -1) la disponibilità giornaliera e la salva nel DB.
5. Se tutto va a buon fine, la transazione fa *commit* sul database MySQL.
6. Il controller restituisce un `BookingResponseDTO` con stato `201 Created` e il frontend aggiorna la UI.
