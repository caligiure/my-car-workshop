# I Controller REST (Il livello di Presentazione/API)

In Spring Boot, i Controller REST sono classi annotate con `@RestController` che gestiscono le richieste HTTP e forniscono risposte in formato JSON o XML. 
Questi controller fungono da interfaccia tra il client (ad esempio, un'applicazione frontend) e il livello di servizio, consentendo di esporre le funzionalità dell'applicazione attraverso API RESTful. 
I controller REST definiscono endpoint che possono essere chiamati dai client per eseguire operazioni come la creazione, la lettura, l'aggiornamento e la cancellazione dei dati.

## BookingController

Il `BookingController` è un controller REST che gestisce le operazioni relative alla prenotazione degli appuntamenti.
Il suo compito è rigidamente definito:

- Ascolta le richieste HTTP (GET, POST, PUT, DELETE) in arrivo su specifici URL (es. /api/bookings).
- Estrae i dati dalla richiesta (es. il JSON inviato da Angular).
- Chiama il Service (BookingService) per far eseguire la logica di business.
- Risponde ad Angular con un codice HTTP appropriato (es. 200 OK se tutto è andato bene, o 409 Conflict se c'è stata la Race Condition).