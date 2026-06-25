package com.mycarworkshop.backend.security;

import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Questo service serve da "ponte" tra il nostro database MySQL (la tabella utenti) 
 * e il sistema interno di Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Cerchiamo l'utente nel nostro database usando l'email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con l'email: " + email));

        // Trasformiamo la nostra entità in un oggetto "UserDetails" comprensibile a Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Qui andrebbero inseriti i ruoli/autorities (es. ROLE_USER, ROLE_ADMIN)
        );
    }
}