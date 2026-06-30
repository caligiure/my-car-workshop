package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.UserRegistrationDTO;
import com.mycarworkshop.backend.dto.UserProfileDTO;
import com.mycarworkshop.backend.dto.UserProfileUpdateDTO;
import com.mycarworkshop.backend.dto.UserPasswordUpdateDTO;
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

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
        return new UserProfileDTO(user.getId(), user.getName(), user.getSurname(), user.getEmail());
    }

    @Transactional
    public UserProfileDTO updateUserProfile(String email, UserProfileUpdateDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        user.setName(dto.getName());
        user.setSurname(dto.getSurname());

        User savedUser = userRepository.save(user);
        return new UserProfileDTO(savedUser.getId(), savedUser.getName(), savedUser.getSurname(), savedUser.getEmail());
    }

    @Transactional
    public void updateUserPassword(String email, UserPasswordUpdateDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La vecchia password non è corretta.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
        userRepository.delete(user);
    }
}