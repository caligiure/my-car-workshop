# Architettura Frontend - Analisi Tecnica Dettagliata

Questo documento fornisce un'analisi ingegneristica dettagliata dell'architettura frontend del progetto **My Car Workshop**. L'applicazione client è costruita utilizzando **Angular 17+** (o versioni successive compatibili) e sfrutta i più recenti paradigmi introdotti dal framework, garantendo un codice reattivo, modulare e orientato alle performance.

---

## 🛠️ 1. Tecnologie e Core Pattern
L'intero frontend abbandona il vecchio approccio basato su `NgModules` per abbracciare un ecosistema più snello e performante:

- **Standalone Components**: Ogni componente, pipe o direttiva dichiara autonomamente le proprie dipendenze (es. `imports: [CommonModule, ReactiveFormsModule]`), rendendo l'albero di rendering più leggero e facilitando il Lazy Loading.
- **Signals API**: La vera rivoluzione nella gestione dello stato. Si usano i Segnali (es. `isLoading = signal<boolean>(false)`) al posto dei pesanti Subject di RxJS per la gestione dello stato locale dei componenti. I Segnali indicano ad Angular esattamente *quale* porzione della view aggiornare (Fine-Grained Reactivity), bypassando la costosa operazione globale di Change Detection (Zone.js).
- **RxJS**: Mantenuto per la gestione dei flussi asincroni complessi, come le chiamate HTTP (`HttpClient`).
- **SCSS**: Preprocessore CSS per l'implementazione del design system, con uso intensivo di variabili, nidificazione e mixin.
- **Glassmorphism**: Il design system scelto per l'interfaccia. L'uso di `backdrop-filter: blur()`, `rgba()` e trasparenze permette agli elementi di "fluttuare" sopra l'immagine di sfondo globale.

---

## 📂 2. Struttura dei Layer

L'architettura del file system (directory `src/app`) è divisa logicamente per separazione delle responsabilità: `core`, `layout` e `features`.

### 🛡️ Layer Core (`/core`)
Il cuore applicativo che fornisce funzionalità globali a tutto il progetto.

#### Servizi (`/services`)
I servizi, provvisti di `@Injectable({ providedIn: 'root' })`, gestiscono la logica di business client-side e il colloquio HTTP.
- **`AuthService`**: Gestisce la persistenza del token JWT nel `sessionStorage` (implementando la *Tab Isolation*: schede del browser indipendenti) e i metodi di login/logout.
- **`ThemeService`**: Gestisce l'abilitazione e disabilitazione della Dark Mode. Aggiunge dinamicamente una classe CSS `.dark-theme` al tag `<body>` e salva la preferenza nel browser, aggiornando un Segnale reattivo globale per informare i componenti.
- **Servizi Dati (`BookingService`, `VehicleService`, `ProfileService` ecc.)**: Incapsulano le chiamate HTTP al backend tramite l'injection dell'`HttpClient`, restituendo Observable mappati sui relativi DTO.

#### Interceptors (`/interceptors`)
- **`AuthInterceptor`**: Intercetta automaticamente ogni richiesta in uscita. Se l'utente è loggato, estrae il JWT dal `sessionStorage` e lo clona negli header HTTP (`Authorization: Bearer <token>`).
- **`ErrorInterceptor`**: Cattura globalmente le risposte di errore dal server. Se il backend risponde con `401 Unauthorized` o `403 Forbidden` (es. token scaduto o contraffatto), disconnette automaticamente l'utente e lo reindirizza alla pagina di login.

#### Guards (`/guards`)
Proteggono le rotte di Angular (Routing) da accessi non autorizzati.
- **`AuthGuard`**: Verifica che l'utente sia loggato prima di lasciarlo accedere a percorsi sotto `/workspace`.
- **`AdminGuard`**: Decodifica il JWT per verificare la presenza della `ROLE_ADMIN` prima di concedere l'accesso a `/admin`.

---

### 🖼️ Layer Layout (`/layout`)
Contiene i "gusci" (Shell) strutturali. Utilizzando il tag `<router-outlet>`, fanno da cornice alle singole pagine figlie.
- **`AuthShell`**: Guscio per l'area pubblica (Login e Registrazione). Integra l'immagine di sfondo globale ad alta risoluzione e ospita la Topbar superiore con il selettore del tema.
- **`MainShell`**: Guscio strutturale per l'area di lavoro privata. Implementa il pattern a due colonne:
  - *Sidebar* (Menu laterale): Pannello "Glass" traslucido che offre la navigazione verso le varie feature. Include logica reattiva per distinguere e colorare dinamicamente (`ActiveRoute`) le voci utente dalle voci di Amministrazione.
  - *Topbar* & *Workspace*: L'area di contenuto dinamica provvista di tasto di logout e commutatore di tema.

---

### 🚀 Layer Features (`/features`)
I componenti architetturali (Smart Components) che implementano la logica visiva. Spesso sono progettati con un approccio *Container/Presenter*.

#### Area Pubblica & Auth
- **`HomeComponent`**: Landing page pubblica con Hero Section ed esposizione delle ultime recensioni. Applica logica reattiva: se l'utente è loggato il tasto "Accedi" diventa "Vai all'Area Personale".
- **`LoginComponent` & `RegisterComponent`**: Implementano i form reattivi complessi (`ReactiveFormsModule`) con validatori incrociati (es. verifica che le due password coincidano in fase di registrazione). Usano i Segnali (`isLoading`) per disabilitare i bottoni e mostrare spinner in attesa del backend, prevenendo doppi click (Debouncing).

#### Area Personale Utente
- **`DashboardComponent`**: Pannello di controllo con statistiche riassuntive e una Card speciale dedicata alla creazione rapida di recensioni (con form agganciato al `ReviewService`).
- **`VehiclesComponent`**: Gestione dell'anagrafica auto. Carica in modo asincrono la lista in formato griglia o fornisce un *Empty State* (schermata di invito all'azione) se l'utente non ha registrato veicoli.
- **`AppointmentsComponent`**: Gestisce lo storico appuntamenti tramite tabella e il modulo di prenotazione, implementato concettualmente come un wizard interattivo per la scelta del veicolo, dell'orario e del tipo di intervento.
- **`ProfileComponent`**: Vista per la gestione e la disattivazione (Danger Zone) dell'account, informando l'utente sulla natura distruttiva dell'operazione.

#### Area Amministratore
- **`AdminDashboardComponent`**: Modulo riservato (`/admin/dashboard`). Carica dal `AdminService` tutti gli appuntamenti globale dell'officina. Fornisce l'interfaccia interattiva all'officina per approvare (`Approve`) o cancellare/declinare appuntamenti, modificando in tempo reale lo stato visivo (`status-badge`) all'interno dell'interfaccia.

---

## 🎨 Sistema di Design & Styling (Glassmorphism & Theming)
La UI applica un potente file `styles.scss` globale accompagnato dagli stili inline dei singoli Standalone Components.

- **Background Globale Fisso**: Un'immagine copre per intero il viewport (`background-attachment: fixed`), fornendo un effetto parallasse di base.
- **Effetto Vetro (Blur)**: Nessun container utilizza colori a tinta unita opachi. Tutti i div di livello superiore e le card utilizzano combinazioni di `rgba(..., 0.85)` e `backdrop-filter: blur(10px)`. Questo mix permette ai contenuti di emergere limpidamente garantendo un effetto premium molto ricercato.
- **Gestione dei Contrasti e Tipografia**: I testi scuri per i form e i testi bianchi ombreggiati (`text-shadow`) per i titoli e la sidebar garantiscono il superamento dei test di accessibilità visiva nonostante la variabilità cromatica dello sfondo sottostante.
- **Theming Dinamico (Dark Mode)**: Il file `styles.scss` intercetta la presenza della classe `.dark-theme` nel `<body>` per applicare *overrides*. Nella modalità scura, le trasparenze bianche (`Light Glass`) si trasformano dinamicamente in trasparenze nere (`Dark Glass`), scurendo l'interfaccia ma preservando la vista dell'immagine di sfondo.
