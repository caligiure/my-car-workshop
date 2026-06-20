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