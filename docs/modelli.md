# Modelli (Entity JPA)

I modelli rappresentano le entità principali del sistema e definiscono la struttura dei dati che verranno memorizzati nel database. Ogni modello corrisponde a una tabella nel database e contiene campi che rappresentano le colonne della tabella, oltre a eventuali relazioni con altri modelli.

I modelli sono implementati come classi Java annotate con le annotazioni di JPA (Java Persistence API) per definire la mappatura tra le classi e le tabelle del database. Le annotazioni più comuni includono:

- `@Entity`: indica che la classe è un entity JPA
- `@Id`: indica il campo che rappresenta la chiave primaria
- `@GeneratedValue`: specifica la strategia di generazione del valore della chiave primaria
- `@Column`: definisce le proprietà della colonna nella tabella del database
- `@ManyToOne`, `@OneToMany`, `@ManyToMany`: definiscono le relazioni tra i modelli

I seguenti modelli rappresentano le entità principali del sistema di prenotazione degli appuntamenti per l'officina:

## User

Modello che rappresenta un utente del sistema, che può essere un cliente o un amministratore. Contiene informazioni come nome, email, password (hashata) e ruolo (cliente o admin).

## Vehicle

Modello che rappresenta un veicolo associato a un utente. Contiene informazioni come marca, modello, anno di produzione e targa. Ogni veicolo è associato a un solo utente, ma un utente può avere più veicoli.

## Appointment

Modello che rappresenta un appuntamento prenotato da un utente per un intervento sul proprio veicolo. Contiene informazioni come data, fascia oraria, tipo di intervento (ispezione, manutenzione ordinaria, riparazione), stato dell'appuntamento (prenotato, completato, cancellato) e una relazione con il veicolo associato.

## DailyAvailability

Modello che rappresenta la disponibilità giornaliera dell'officina. Contiene informazioni come data, numero di slot disponibili e numero di slot prenotati. Questo modello viene utilizzato per verificare la disponibilità prima di confermare una prenotazione e per aggiornare il numero di slot prenotati quando viene creato o cancellato un appuntamento.