package com.mycarworkshop.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro che intercetta TUTTE le richieste HTTP in ingresso per verificare la presenza di un Token JWT valido.
 * @Component indica a Spring che questa classe è un bean gestito dal contesto dell'applicazione, cioè Spring si occuperà di crearne un'istanza e gestirne il ciclo di vita.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // Override del metodo doFilterInternal che viene chiamato per ogni richiesta HTTP. Qui avviene la logica di estrazione e validazione del token JWT.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Estrai l'header Authorization
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Verifica se l'header inizia con "Bearer " (lo standard per i JWT) e se sì, estrai username (email)
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Rimuove "Bearer "
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                // Token malformato o scaduto
                System.out.println("Errore nell'estrazione del JWT: " + e.getMessage());
            }
        }

        // Se abbiamo un'email e l'utente non è ancora autenticato in questo contesto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Carica l'utente dal database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Se il token è valido per questo utente
            if (jwtUtil.validateToken(jwt, userDetails)) {

                // Crea l'oggetto di autenticazione e lo inietta nel contesto di sicurezza di Spring
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Passa la palla al prossimo filtro (o al Controller)
        filterChain.doFilter(request, response);
    }
}