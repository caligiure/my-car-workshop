package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.UserRegistrationDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User registerNewUser(UserRegistrationDTO registrationDTO) {
        // 1. Validazione: Controlliamo se l'email è già presente nel database
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un utente con questa email è già registrato.");
        }

        // 2. Creazione dell'entità
        User newUser = new User();
        newUser.setEmail(registrationDTO.getEmail());
        newUser.setNome(registrationDTO.getNome());
        newUser.setCognome(registrationDTO.getCognome());
        newUser.setRuolo("USER"); // Impostiamo il ruolo di default
        
        /* * NOTA INGEGNERISTICA SULLA SICUREZZA:
         * Al momento stiamo salvando la password in chiaro per testare il flusso base.
         * Nel prossimo step, quando introdurremo Spring Security, sostituiremo questa riga con:
         * newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
         */
        newUser.setPassword(registrationDTO.getPassword());

        // 3. Salvataggio nel database
        return userRepository.save(newUser);
    }
}