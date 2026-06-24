package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.VehicleRequestDTO;
import com.mycarworkshop.backend.dto.VehicleResponseDTO;
import com.mycarworkshop.backend.model.Vehicle;
import com.mycarworkshop.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    /**
     * Endpoint per l'aggiunta di un nuovo veicolo. URL: http://localhost:8080/api/vehicles
     */
    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody VehicleRequestDTO requestDTO) {
        try {
            Vehicle createdVehicle = vehicleService.addVehicle(requestDTO);
            
            // Nell'app completa eviteremmo di restituire l'entità Vehicle intera 
            // per non far circolare i dati di "owner" allegati, ma useremmo un VehicleResponseDTO.
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicle);
            
        } catch (IllegalArgumentException e) {
            // Intercetta gli errori di targa duplicata o utente non trovato
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Si è verificato un errore durante il salvataggio del veicolo.");
        }
    }

    /**
     * Endpoint per la visualizzazione del "Garage Virtuale".
     * Restituisce la lista sicura e priva di cicli (VehicleResponseDTO) delle auto di un utente.
     * URL: http://localhost:8080/api/vehicles/user/{ownerId}
     */
    // @PathVariable indica che il valore di ownerId sarà estratto dall'URL della richiesta.
    @GetMapping("/user/{ownerId}")
    public ResponseEntity<?> getUserVehicles(@PathVariable Long ownerId) {
        try {
            List<VehicleResponseDTO> userVehicles = vehicleService.getUserVehicles(ownerId);
            // Restituisce la lista dei veicoli dell'utente con status 200 OK
            return ResponseEntity.ok(userVehicles);
        } catch (IllegalArgumentException e) {
            // Ritorna 404 Not Found se l'utente richiesto non esiste
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante il recupero dei veicoli.");
        }
    }
}