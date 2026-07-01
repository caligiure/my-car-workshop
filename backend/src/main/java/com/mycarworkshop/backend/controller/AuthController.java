package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.AuthResponseDTO;
import com.mycarworkshop.backend.dto.LoginRequestDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.repository.UserRepository;
import com.mycarworkshop.backend.security.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // Spring Security prova ad autenticare con le credenziali fornite
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // Se passa, recuperiamo l'ID dell'utente dal DB
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Utente non trovato"));

            // Generiamo il token JWT includendo il ruolo
            final String jwt = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

            // Rispondiamo ad Angular con il token e l'ID utente
            return ResponseEntity.ok(new AuthResponseDTO(jwt, user.getId()));

        } catch (BadCredentialsException e) {
            logger.error("ERRORE durante il login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email o password errati.");
        }
    }
}