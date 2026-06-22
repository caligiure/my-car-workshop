# I Repository (Il livello di Accesso ai Dati)

In Spring Boot, i Repository sono interfacce che estendono l'interfaccia `JpaRepository` e forniscono metodi predefiniti per eseguire operazioni CRUD (Create, Read, Update, Delete) sui dati. Questi repository fungono da ponte tra il livello di servizio (applicazione Java) e il database, consentendo di accedere e manipolare i dati in modo semplice e intuitivo.

JpaRepository fornisce già metodi come save(), findById(), findAll(), deleteById()