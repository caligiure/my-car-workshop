# I Controller REST (Il livello di Presentazione/API)

In Spring Boot, i Controller REST sono classi annotate con `@RestController` che gestiscono le richieste HTTP e forniscono risposte in formato JSON o XML. 
Questi controller fungono da interfaccia tra il client (ad esempio, un'applicazione frontend) e il livello di servizio, consentendo di esporre le funzionalità dell'applicazione attraverso API RESTful. 
I controller REST definiscono endpoint che possono essere chiamati dai client per eseguire operazioni come la creazione, la lettura, l'aggiornamento e la cancellazione dei dati.

NOTA: I Controller REST non devono contenere logica di business. La logica di business deve essere implementata nei Service, mentre i Controller REST si limitano a gestire le richieste e le risposte HTTP.

Il loro compito è rigidamente definito:

- Ascolta le richieste HTTP (GET, POST, PUT, DELETE) in arrivo su specifici URL (es. /api/bookings).
- Estrae i dati dalla richiesta (es. il JSON inviato da Angular).
- Chiama il Service (es. BookingService) per far eseguire la logica di business.
- Risponde ad Angular con un codice HTTP appropriato (es. 200 OK se tutto è andato bene, o 409 Conflict se c'è stata la Race Condition).

Annotazioni principali utilizzate nei Controller REST:
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: mappano i metodi del controller alle richieste HTTP corrispondenti

## BookingController

`BookingController` gestisce le operazioni relative alla prenotazione degli appuntamenti.

Espone il seguente endpoint:
`POST /api/bookings`: per creare una prenotazione.
Riceve un oggetto JSON con i dettagli della prenotazione e chiama il metodo `createStandardAppointment` del `BookingService`.

## UserController

`UserController` è un controller REST che gestisce le operazioni relative agli utenti.
Espone il seguente endpoint:
`POST /api/users/register`: per registrare un nuovo utente.




# I Service (Il livello di Business Logic)

I Service sono classi che contengono la logica di business dell'applicazione. Sono responsabili della gestione delle operazioni di business e della comunicazione con il livello di persistenza (Repository). I Controller REST chiamano i Service per eseguire le operazioni richieste dai client.

## BookingService

Il `BookingService` è un service che gestisce la logica di business relativa alle prenotazioni degli appuntamenti.
Espone il metodo createAppointment che viene chiamato dal controller REST per eseguire l'operazione di creazione di una prenotazione, verificando la disponibilità e gestendo le eventuali condizioni di concorrenza.



# I DTO (Data Transfer Object)

I DTO sono oggetti utilizzati per trasferire dati tra il client e il server. 
I dati vengono JSON vengono serializzati e deserializzati per essere inviati e ricevuti dalle API REST.

`BookingRequestDTO`: viene utilizzato per rappresentare i dati necessari per creare una nuova prenotazione.

`UserRegistrationDTO`: viene utilizzato per rappresentare i dati necessari per registrare un nuovo utente.



# I Repository (Il livello di Accesso ai Dati)

In Spring, i Repository sono interfacce che estendono l'interfaccia `JpaRepository` e forniscono metodi predefiniti per eseguire operazioni CRUD (Create, Read, Update, Delete) sul database senza dover scrivere query SQL manualmente.

Questi repository fungono da ponte tra il livello di servizio (applicazione Java) e il database, consentendo di accedere e manipolare i dati in modo semplice e intuitivo.

JpaRepository fornisce metodi come save(), findById(), findAll(), deleteById()

Ogni repository è associato a un'entità specifica (ad esempio, `VehicleRepository` per l'entità `Vehicle`) e consente di eseguire operazioni su di essa.