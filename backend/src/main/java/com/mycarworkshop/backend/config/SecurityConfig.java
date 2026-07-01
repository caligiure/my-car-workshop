package com.mycarworkshop.backend.config;

import com.mycarworkshop.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Classe di configurazione della sicurezza dell'applicazione tramite Spring
 * Security e JWT.
 * Configura le regole di accesso agli endpoint, la gestione della sessione e
 * l'integrazione del filtro JWT per l'autenticazione.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // Bean per la crittografia delle password
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Costruisce l'AuthenticationManager utilizzando il PasswordEncoder e il
    // CustomUserDetailsService (ponte tra DB SQL e Spring Security)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Configura le regole di sicurezza per le richieste HTTP, abilitando CORS,
    // disabilitando CSRF, definendo le regole di accesso agli endpoint e
    // aggiungendo il filtro JWT.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Abilitiamo il CORS globale che avevamo creato e disabilitiamo il CSRF
                // (Cross-Site Request Forgery) perché non necessario nelle API REST stateless
                // basate su token
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())

                // Regole di Accesso
                .authorizeHttpRequests(auth -> auth
                        // Gli endpoint di login, registrazione e recensioni pubbliche devono essere
                        // pubblici
                        .requestMatchers("/api/auth/login", "/api/users/register", "/api/reviews").permitAll()
                        // tutte le altre richieste richiedono il JWT
                        .anyRequest().authenticated())

                // Gestione della Sessione: impostiamo STATELESS perché usiamo JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Aggiungiamo il nostro filtro JWT prima di quello standard
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}