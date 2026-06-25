package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.UserRegistrationDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerNewUser(UserRegistrationDTO registrationDTO) {
        // Validazione: Controlliamo se l'email è già presente nel database
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un utente con questa email è già registrato.");
        }

        // Creazione dell'entità
        User newUser = new User();
        newUser.setEmail(registrationDTO.getEmail());
        newUser.setName(registrationDTO.getName());
        newUser.setSurname(registrationDTO.getSurname());
        newUser.setRole("USER"); // Impostiamo il ruolo di default
        
        // CIFRATURA DELLA PASSWORD tramite BCrypt (PasswordEncoder)
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        // Salvataggio nel database
        return userRepository.save(newUser);
    }
}