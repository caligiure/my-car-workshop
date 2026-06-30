package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.UserRegistrationDTO;
import com.mycarworkshop.backend.dto.UserProfileUpdateDTO;
import com.mycarworkshop.backend.dto.UserPasswordUpdateDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
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
     * Endpoint per la registrazione di un nuovo cliente. URL:
     * http://localhost:8080/api/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            User registeredUser = userService.registerNewUser(registrationDTO);
            // Inserisco i log per debug
            logger.info("Utente registrato con successo con ID: " + registeredUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Utente " + registeredUser.getName() + " registrato con successo con ID: "
                            + registeredUser.getId());
        } catch (IllegalArgumentException e) {
            // Se l'email è già in uso, restituiamo un errore 409 Conflict o 400 Bad Request
            logger.error("ERRORE durante la registrazione dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante la registrazione dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante la registrazione.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Principal principal) {
        try {
            logger.info("Recupero del profilo dell'utente con email: " + principal.getName());
            return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
        } catch (IllegalArgumentException e) {
            logger.error("ERRORE durante il recupero del profilo dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante il recupero del profilo dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante il recupero del profilo.");
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UserProfileUpdateDTO dto, Principal principal) {
        try {
            logger.info("Aggiornamento del profilo dell'utente con email: " + principal.getName());
            return ResponseEntity.ok(userService.updateUserProfile(principal.getName(), dto));
        } catch (IllegalArgumentException e) {
            logger.error("ERRORE durante l'aggiornamento del profilo dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante l'aggiornamento del profilo dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante l'aggiornamento del profilo.");
        }
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updateMyPassword(@RequestBody UserPasswordUpdateDTO dto, Principal principal) {
        try {
            logger.info("Aggiornamento della password dell'utente con email: " + principal.getName());
            userService.updateUserPassword(principal.getName(), dto);
            return ResponseEntity.ok("Password aggiornata con successo.");
        } catch (IllegalArgumentException e) {
            logger.error("ERRORE durante l'aggiornamento della password dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante l'aggiornamento della password dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante l'aggiornamento della password.");
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyProfile(Principal principal) {
        try {
            logger.info("Eliminazione del profilo dell'utente con email: " + principal.getName());
            userService.deleteUserProfile(principal.getName());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            logger.error("ERRORE durante l'eliminazione del profilo dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante l'eliminazione del profilo dell'utente. Causa: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante l'eliminazione del profilo.");
        }
    }
}