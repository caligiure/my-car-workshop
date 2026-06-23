package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.UserRegistrationDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

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
            // Non è buona norma restituire l'intera entità (inclusa la password, anche se hashata)
            // Andrebbe usato un UserResponseDTO. Per ora restituiamo un messaggio di successo.
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Utente " + registeredUser.getName() + " registrato con successo con ID: " + registeredUser.getId());
        } catch (IllegalArgumentException e) {
            // Se l'email è già in uso, restituiamo un errore 409 Conflict o 400 Bad Request
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante la registrazione.");
        }
    }
}