package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.VehicleRequestDTO;
import com.mycarworkshop.backend.dto.VehicleResponseDTO;
import com.mycarworkshop.backend.service.VehicleService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    // Inizializzazione del Logger di classe
    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    /**
     * Endpoint per l'aggiunta di un nuovo veicolo. URL:
     * http://localhost:8080/api/vehicles
     */
    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody VehicleRequestDTO requestDTO, Principal principal) {
        try {
            // Estraiamo l'identità certa e sicura dal token JWT
            String userEmail = principal.getName();

            VehicleResponseDTO savedVehicleDTO = vehicleService.addVehicle(requestDTO, userEmail);

            return ResponseEntity.ok(savedVehicleDTO);

        } catch (IllegalArgumentException e) {
            logger.error("ERRORE durante l'aggiunta del veicolo {}. Causa: {}", requestDTO.getLicensePlate(),
                    e.getMessage());
            // Intercetta gli errori di targa duplicata o utente non trovato
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante l'aggiunta del veicolo {}. Causa: {}", requestDTO.getLicensePlate(),
                    e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Si è verificato un errore durante il salvataggio del veicolo.");
        }
    }

    /**
     * Endpoint per la visualizzazione del "Garage Virtuale".
     * Restituisce la lista sicura e priva di cicli (VehicleResponseDTO) delle auto
     * di un utente.
     * URL: http://localhost:8080/api/vehicles
     * L'identità dell'utente viene dedotta in modo sicuro dal token JWT.
     */
    @GetMapping
    public ResponseEntity<?> getUserVehicles(Principal principal) {
        // principal.getName() estrae l'email dal token JWT appena validato
        String userEmail = principal.getName();
        try {
            List<VehicleResponseDTO> userVehicles = vehicleService.getUserVehicles(userEmail);
            // Restituisce la lista dei veicoli dell'utente con status 200 OK
            return ResponseEntity.ok(userVehicles);
        } catch (IllegalArgumentException e) {
            logger.error("ERRORE durante il recupero dei veicoli dell'utente {}. Causa: {}", userEmail, e.getMessage());
            // Ritorna 404 Not Found se l'utente richiesto non esiste
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante il recupero dei veicoli dell'utente {}. Causa: {}", userEmail,
                    e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante il recupero dei veicoli.");
        }
    }

    /**
     * Endpoint per la modifica dei dati di un veicolo esistente.
     * URL: PUT http://localhost:8080/api/vehicles/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody VehicleRequestDTO payload,
            Principal principal) {
        try {
            // Estraiamo in modo sicuro l'email dal token JWT dell'utente richiedente
            String userEmail = principal.getName();

            // Invochiamo il servizio per l'aggiornamento protetto
            VehicleResponseDTO updatedVehicle = vehicleService.updateVehicle(id, payload, userEmail);

            return ResponseEntity.ok(updatedVehicle);
        } catch (IllegalArgumentException e) {
            // Ritorna 400 Bad Request se la targa è duplicata o l'id è inesistente
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            // Ritorna 403 Forbidden se un utente prova a modificare l'auto di un altro
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante la modifica del veicolo {}. Causa: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore interno del server durante la modifica del veicolo.");
        }
    }

    /**
     * Endpoint per l'eliminazione di un veicolo tramite il suo ID.
     * Esempio di URL: DELETE http://localhost:8080/api/vehicles/5
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id, Principal principal) {
        try {
            // Estraiamo l'email del proprietario autorizzato dal token JWT
            String userEmail = principal.getName();

            // Invochiamo il metodo delete del servizio
            vehicleService.deleteVehicle(id, userEmail);

            // Standard REST: 204 No Content
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            // Ritorna 404 Not Found se il veicolo non esiste
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            // Ritorna 403 Forbidden se l'utente loggato non è il proprietario del veicolo
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            logger.error("ERRORE CRITICO durante l'eliminazione del veicolo {}. Causa: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore interno del server durante l'eliminazione del veicolo.");
        }
    }
}