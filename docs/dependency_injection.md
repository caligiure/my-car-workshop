# Cos'è la Dependency Injection (DI)?

La **Dependency Injection (Iniezione delle Dipendenze)** è un pattern di progettazione (design pattern) fondamentale nell'ingegneria del software moderna, utilizzato in particolar modo nella programmazione orientata agli oggetti (OOP). 

In parole semplici: **Invece di far sì che un oggetto crei da solo le proprie dipendenze (altri oggetti di cui ha bisogno per funzionare), queste dipendenze gli vengono fornite (iniettate) dall'esterno.**

---

## Come Funziona: L'Inversione del Controllo (IoC)

La DI è l'implementazione pratica del principio di **Inversione del Controllo (Inversion of Control - IoC)**. 
Normalmente, una classe "controlla" la creazione dei suoi strumenti. Ad esempio, se un `BookingController` ha bisogno di un `BookingService`, potrebbe fare un `new BookingService()`. 
Con la DI, invertiamo il controllo: la classe dice semplicemente *"Ho bisogno di un BookingService"*, e un **Container esterno** (es. Spring Boot o Angular) si occuperà di crearlo e passarglielo.

---

## Esempio Pratico: Senza DI vs Con DI

Immagina di costruire un'auto.

### ❌ Senza Dependency Injection (Forte Accoppiamento)
L'auto deve costruirsi il proprio motore.
```java
public class Auto {
    private Motore motore;

    public Auto() {
        // L'auto è costretta a creare una specifica istanza di MotoreBenzina.
        // Se domani volessimo un MotoreElettrico, dovremmo modificare il codice della classe Auto!
        this.motore = new MotoreBenzina(); 
    }
}
```

### ✅ Con Dependency Injection (Basso Accoppiamento)
L'auto riceve il motore dall'esterno (es. dalla fabbrica).
```java
public class Auto {
    private Motore motore;

    // La dipendenza viene "iniettata" tramite il costruttore
    public Auto(Motore motore) {
        this.motore = motore;
    }
}
```
In questo modo, la classe `Auto` non sa nulla di *come* è fatto il motore, le basta che rispetti l'interfaccia `Motore`. Possiamo iniettare un `MotoreBenzina` o un `MotoreElettrico` senza mai toccare il codice della classe `Auto`.

---

## Perché si usa?

1. **Decoupling (Basso Accoppiamento)**: Le classi non sono fortemente legate tra loro. Una classe non deve conoscere i dettagli implementativi delle sue dipendenze.
2. **Testabilità**: È il motivo numero uno per cui si usa la DI. Quando scrivi test automatizzati (Unit Test), non vuoi testare il database reale. Con la DI, puoi iniettare un "Finto Database" (Mock) nella tua classe per testarla in isolamento.
3. **Manutenibilità**: Il codice è più pulito, modulare e facile da modificare.
4. **Gestione del Ciclo di Vita**: Nei framework moderni, i Container IoC (come Spring o Angular) gestiscono se un oggetto deve essere creato una volta sola per tutta l'app (Singleton) o ricreato ad ogni richiesta.

---

## Vantaggi e Svantaggi

| ✅ Vantaggi | ❌ Svantaggi |
| :--- | :--- |
| **Testabilità estrema**: Facilita l'uso di Mock nei test. | **Curva di apprendimento**: Capire i Container IoC può essere difficile all'inizio. |
| **Separation of Concerns**: Le classi si concentrano solo sulla propria logica, non sulla creazione di altri oggetti. | **Difficoltà di tracciamento**: Poiché le dipendenze sono fornite dal framework "magicamente", a volte è difficile capire da dove provenga un'istanza solo leggendo il codice. |
| **Flessibilità**: Permette di scambiare implementazioni (es. da MySQL a PostgreSQL) cambiando solo una riga di configurazione. | **Overhead**: L'uso di un framework IoC aggiunge un piccolo costo computazionale in fase di avvio (startup) per la creazione dell'albero delle dipendenze. |

---

## Implementazioni Tipiche nel tuo Progetto

Nel progetto **My Car Workshop** hai utilizzato la DI in modo estensivo, sia nel Backend che nel Frontend!

### 1. Spring Boot (Java Backend)
Spring Boot è un gigantesco **Container IoC**. Quando avvii l'app, Spring scansiona il codice, trova classi con annotazioni specifiche (`@Service`, `@RestController`, `@Repository`), ne crea un'istanza (chiamata **Bean**) e le inietta dove serve.

**Esempio di DI tramite Costruttore in Spring:**
```java
@RestController
public class BookingController {
    
    // Spring inietta automaticamente questa dipendenza
    private final BookingService bookingService;

    @Autowired // Spesso omesso nelle versioni recenti se c'è un solo costruttore
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
}
```

### 2. Angular (TypeScript Frontend)
Angular ha un proprio motore di Dependency Injection. Usa l'annotazione `@Injectable()` per segnalare che una classe può essere iniettata in altre.

**Esempio di DI moderna in Angular 17+ (tramite `inject()`):**
```typescript
@Injectable({
  providedIn: 'root' // Indica che questa istanza è globale (Singleton)
})
export class AuthService { ... }

@Component({...})
export class DashboardComponent {
  // Iniezione della dipendenza tramite la funzione inject()
  private authService = inject(AuthService); 
}
```

## Riassunto
La Dependency Injection è il meccanismo attraverso il quale le macchine (le tue classi) non si costruiscono i pezzi di ricambio da sole, ma se li fanno consegnare pronti all'uso da un magazziniere esterno (il framework). Questo rende le tue macchine facili da aggiornare, riparare e testare.
