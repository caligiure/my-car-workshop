package com.mycarworkshop.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe di configurazione globale per abilitare il Cross-Origin Resource
 * Sharing (CORS).
 * Questa classe dice a Spring Boot di fidarsi delle richieste in arrivo dal
 * frontend Angular.
 * Viene letta da Spring Boot all'avvio dell'applicazione grazie
 * all'annotazione @Configuration.
 * 
 * Implementa l'interfaccia WebMvcConfigurer, un metodo che permette di
 * configurare il comportamento di Spring MVC (tra cui il CORS).
 * MVC sta per Model View Controller, l'architettura che separa la logica
 * dell'applicazione (Model),
 * l'interfaccia utente (View) e il controllore (Controller).
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Applichiamo la regola a tutti gli endpoint che iniziano con /api/
        registry.addMapping("/api/**")
                // ORIGINI CONSENTITE: Inseriamo l'URL esatto in cui gira Angular in fase di
                // sviluppo
                .allowedOrigins("http://localhost:4200")
                // METODI CONSENTITI: Elenchiamo i metodi HTTP che Angular è autorizzato a usare
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // HEADERS CONSENTITI: Permettiamo tutti gli header (per quando inviamo il token
                // JWT "Authorization")
                .allowedHeaders("*")
                // CREDENZIALI: Permette l'invio di cookie o token di autenticazione attraverso
                // il confine CORS
                .allowCredentials(true);
    }
}