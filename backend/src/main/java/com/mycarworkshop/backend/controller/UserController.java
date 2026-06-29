package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.UserRegistrationDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Inizializzazione del Logger di classe
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    // Costruttore con @Autowired per l'iniezione delle dipendenze tramite Spring
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint per la registrazione di un nuovo cliente. URL: http://localhost:8080/api/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            User registeredUser = userService.registerNewUser(registrationDTO);            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Utente " + registeredUser.getName() + " registrato con successo con ID: " + registeredUser.getId());
        } catch (IllegalArgumentException e) {
            // Se l'email è già in uso, restituiamo un errore 409 Conflict o 400 Bad Request
            logger.error("ERRORE durante la registrazione dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante la registrazione dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante la registrazione.");
        }
    }
}