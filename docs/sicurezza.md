# Sicurezza con Spring Security e JWT

Spring Security è un framework di sicurezza per applicazioni Java che fornisce funzionalità di autenticazione e autorizzazione. In questo progetto, Spring Security viene utilizzato per proteggere le API REST (richieste HTTP) e garantire che solo gli utenti autenticati possano accedere a determinate risorse.

JWT (JSON Web Token) è uno standard aperto per la trasmissione sicura di informazioni tra le parti come oggetti JSON. In questo progetto, JWT viene utilizzato per autenticare gli utenti e autorizzare l'accesso alle API REST.

## Il workflow di autenticazione

1. Il Login: L'utente invia email e password dal frontend Angular a Spring Boot tramite POST /api/auth/login

2. La Verifica: Spring Security controlla nel database (tramite UserRepository) se la password coincide (decriptando l'hash salvato).

3. Il Rilascio del Token: Se le credenziali sono corrette, Spring genera un JWT (una stringa crittografata indecifrabile e infalsificabile) che contiene l'ID dell'utente e il suo ruolo. Questo token viene inviato ad Angular.

4. Le Chiamate Successive: Da quel momento in poi, Angular allegherà questo JWT nell'header di ogni richiesta (chiamato Authorization: Bearer <token>).

5. Il Filtro: Per ogni chiamata, un nostro filtro personalizzato intercetta il token, ne verifica la firma (per assicurarsi che non sia stato manomesso) e dice a Spring: "Lascialo passare, è l'utente numero 5".

## JWT (JSON Web Token)

### Struttura del Token
Un JWT è composto da tre parti separate da punti (.):
1. Header: Contiene informazioni sul tipo di token e l'algoritmo di firma
2. Payload: Contiene le informazioni (claims) che vogliamo trasmettere, come l'ID dell'utente e il suo ruolo
3. Signature: È la firma digitale

### Validità del Token
Il token ha una data di scadenza (expiration date) che viene impostata al momento della sua creazione. Dopo la scadenza, il token non è più valido e l'utente dovrà effettuare nuovamente il login per ottenere un nuovo token.

### Creazione del Token
Il token viene creato nel backend Spring Boot utilizzando la classe `JwtUtil`. Quando l'utente effettua il login con successo, il backend genera un token JWT che include l'ID dell'utente e il suo ruolo, e lo invia al frontend Angular.

## Spring Security
