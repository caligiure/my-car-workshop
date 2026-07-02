<div align="center">
  <h1>🚗 My Car Workshop - Officina Online</h1>
  <p>
    <strong>Una moderna piattaforma Full-Stack per la gestione smart della tua autofficina</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Frontend-Angular_17+-dd0031?style=flat-square&logo=angular" alt="Angular" />
    <img src="https://img.shields.io/badge/Backend-Spring_Boot_3-6db33f?style=flat-square&logo=spring" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Security-JWT_Auth-black?style=flat-square&logo=jsonwebtokens" alt="JWT" />
    <img src="https://img.shields.io/badge/Design-Glassmorphism-blueviolet?style=flat-square" alt="Glassmorphism" />
  </p>
</div>

<br />

## 📖 Panoramica del Progetto

**My Car Workshop** è un'applicazione web enterprise-grade sviluppata per digitalizzare l'esperienza clienti delle moderne autofficine. Il sistema permette agli utenti di registrarsi, registrare i propri veicoli, prenotare interventi di manutenzione e lasciare recensioni, fornendo al contempo all'amministratore un hub centralizzato per la gestione del lavoro quotidiano.

L'interfaccia utente è stata progettata seguendo i più moderni pattern UI/UX, adottando uno stile **Premium Glassmorphism** (Effetto Vetro) con supporto nativo per la **Dark Mode**.

## ✨ Funzionalità Principali

### 🔒 Sicurezza & Autenticazione (Stateless JWT)
- **Token-Based Auth**: Sicurezza garantita da JSON Web Tokens gestiti in modo stateless dal backend Spring Boot.
- **Tab Isolation**: I token sono memorizzati in `sessionStorage`, garantendo un isolamento perfetto. È possibile loggarsi con account diversi su schede del browser differenti (es. Admin su una scheda, User sull'altra) senza conflitti.
- **RBAC (Role-Based Access Control)**: Separazione rigorosa tra privilegi Amministratore (Admin) e Cliente (User).

### 🖥️ Frontend (Angular 17+)
- **Architettura Standalone**: Utilizzo intensivo di Standalone Components e della nuova `Signals API` per un rendering reattivo ad alte prestazioni.
- **Premium UI**: Design "Glassmorphism" su tutte le viste. Pannelli semi-trasparenti sfocati (`backdrop-filter`) che fluttuano elegantemente sopra un'immagine di sfondo globale ad alta risoluzione.
- **Temi Dinamici**: Switch istantaneo Light/Dark Mode. Gli stili in Dark Mode mantengono intatto l'effetto vetro oscurando i pannelli e ricalibrando le ombre dei testi.

### ⚙️ Backend (Spring Boot & MySQL)
- **RESTful API**: Architettura pulita e scalabile che espone endpoint per autenticazione, gestione veicoli, prenotazioni e recensioni.
- **Gestione Prenotazioni Avanzata**: Logiche di controllo disponibilità per garantire il rispetto della capacità massima giornaliera dell'officina.
- **JPA & Hibernate**: Livello di persistenza dei dati robusto, mappato su un database relazionale MySQL containerizzato.

## 🛠️ Stack Tecnologico

| Layer | Tecnologie |
| :--- | :--- |
| **Frontend** | Angular 17+, TypeScript, RxJS, Signals, SCSS, HTML5 |
| **Backend** | Java, Spring Boot 3, Spring Security, Spring Web, Spring Data JPA |
| **Database** | MySQL (gestito via Docker Compose) |
| **Infrastruttura**| Docker, Maven, Node.js/npm |

## 🚀 Guida all'Avvio (Sviluppo Locale)

### Prerequisiti
- [Java JDK 17+](https://adoptium.net/)
- [Node.js](https://nodejs.org/) (v18 o superiore)
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Inizializzazione Database
Il progetto include un `docker-compose.yml` preconfigurato per lanciare istantaneamente un server MySQL con le credenziali corrette:
```bash
docker-compose up -d
```

### 2. Avvio del Backend (Spring Boot)
Apri un terminale, naviga nella cartella `backend` e lancia l'applicazione:
```bash
cd backend
./mvnw spring-boot:run
```
*(Il server si avvierà sulla porta `8080`)*

### 3. Avvio del Frontend (Angular)
Apri un secondo terminale, naviga nella cartella `frontend`, installa le dipendenze e avvia il server di sviluppo:
```bash
cd frontend
npm install
npm run start
```
*(Il client si avvierà sulla porta `4200`)*

> [!TIP]
> **Avvio Rapido**: Nella root del progetto sono presenti degli script di utilità (`start-dev.sh` per Linux/Mac e `start-dev.bat` per Windows) per automatizzare l'avvio simultaneo di tutti i servizi.

## 📁 Struttura del Progetto

```text
my-car-workshop/
├── backend/                  # Codice sorgente Java Spring Boot
│   ├── src/main/java/        # Controllers, Services, Repositories, Security
│   └── src/main/resources/   # application.properties (Configurazione DB/JWT)
├── frontend/                 # Codice sorgente Angular
│   ├── src/app/core/         # Servizi (Auth, API), Guardie, Interceptor
│   ├── src/app/features/     # Componenti di business (Dashboard, Auth, Veicoli)
│   ├── src/app/layout/       # Shell strutturali (Main, Auth)
│   └── public/images/        # Asset grafici (background, icone)
├── docker-compose.yml        # Configurazione container MySQL
├── start-dev.sh              # Script di avvio rapido (Unix)
└── README.md                 # Questa documentazione
```

## 🔐 Architettura di Rete e Flusso Dati
1. Il client (Angular) invia richieste HTTP alle API esposte (`http://localhost:8080/api/...`).
2. Le richieste protette sono intercettate da un `HttpInterceptor` Angular che inietta il token JWT nell'header `Authorization`.
3. Spring Security filtra la richiesta: se il token è valido e l'utente ha i ruoli richiesti (`hasRole()`), l'accesso al controller è garantito.
4. Il backend interagisce con MySQL tramite Spring Data JPA e restituisce un DTO (Data Transfer Object) in formato JSON.

---
*Progettato e sviluppato con ♥ per rivoluzionare la gestione delle autofficine.*
