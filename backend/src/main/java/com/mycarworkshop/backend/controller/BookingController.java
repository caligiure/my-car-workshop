package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.dto.BookingRequestDTO;
import com.mycarworkshop.backend.dto.BookingResponseDTO;
import com.mycarworkshop.backend.model.Vehicle;
import com.mycarworkshop.backend.repository.VehicleRepository;
import com.mycarworkshop.backend.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.*;

/**
 * I @RestController espongono le funzionalità dell'applicazione attraverso API
 * RESTful.
 * Gestiscono le richieste HTTP e forniscono risposte in formato JSON o XML.
 * 
 * @RequestMapping: definisce il prefisso dell'URL per tutti gli endpoint del
 *                  controller
 *                  NOTA: la logica di business non deve mai essere nel
 *                  Controller, ma nel Service.
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    /*
     * Controller REST che gestisce le operazioni relative alla prenotazione degli
     * appuntamenti.
     * Ascolta le richieste HTTP e fornisce risposte in formato JSON o XML.
     */

    private final BookingService bookingService;
    private final VehicleRepository vehicleRepository;

    // Costruttore con @Autowired per l'iniezione delle dipendenze tramite Spring
    @Autowired
    public BookingController(BookingService bookingService, VehicleRepository vehicleRepository) {
        this.bookingService = bookingService;
        this.vehicleRepository = vehicleRepository;
    }

    /**
     * Gestisce la richiesta POST in arrivo da Angular per creare una prenotazione.
     * Mappato direttamente su "/api/bookings" che è l'unico endpoint per questo
     * controller
     * 
     * @RequestBody indica che il corpo della richiesta HTTP conterrà un JSON
     *              che verrà mappato nell'oggetto BookingRequestDTO.
     */
    @PostMapping()
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO requestDTO) {
        try {
            // 1. Recupero il veicolo dal database tramite l'ID fornito nel DTO
            Vehicle vehicle = vehicleRepository.findById(requestDTO.getVehicleId())
                    .orElseThrow(() -> new IllegalArgumentException("Veicolo non trovato"));

            // 2. Chiamo il Service passando la responsabilità della logica di business
            BookingResponseDTO responseDTO = bookingService.createAppointment(
                    requestDTO.getDate(),
                    requestDTO.getTimeSlot(),
                    requestDTO.getInterventionType(),
                    vehicle,
                    requestDTO.getNotes());

            // 3. Rispondo con 201 CREATED se tutto è andato a buon fine
            return ResponseEntity.ok(responseDTO);

        } catch (IllegalStateException e) {
            // ECCEZIONE CAPACITÀ: L'officina è piena. Rispondiamo con 400 Bad Request.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (ObjectOptimisticLockingFailureException e) {
            // RACE CONDITION INTERCETTATA DALL'OPTIMISTIC LOCKING
            // Rispondiamo con 409 CONFLICT in modo che Angular possa mostrare
            // un avviso "Siamo spiacenti, lo slot è appena stato occupato da un altro
            // utente".
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Siamo spiacenti, il posto è appena stato occupato da un altro utente. Riprova.");

        } catch (Exception e) {
            // Qualsiasi altro errore generico (Es. 500 Internal Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Si è verificato un errore imprevisto.");
        }
    }

    /**
     * Endpoint per ottenere lo storico delle prenotazioni dell'utente loggato.
     * URL: GET http://localhost:8080/api/bookings/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyBookings(java.security.Principal principal) {
        try {
            // Sfrutta lo stesso pattern sicuro basato sul JWT Principal
            String email = principal.getName();

            // Richiama un metodo del service per ottenere la lista degli appuntamenti
            // dell'utente
            return ResponseEntity.ok(bookingService.getAppointmentsByUserEmail(email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nel recupero dello storico.");
        }
    }

    /**
     * Endpoint per il calendario: restituisce i giorni occupati/disponibili.
     * URL: GET http://localhost:8080/api/bookings/availability?year=2026&month=6
     */
    @GetMapping("/availability")
    public ResponseEntity<?> getMonthlyAvailability(@RequestParam int year, @RequestParam int month) {
        try {
            // Ritorna la lista dei record DailyAvailability per il mese selezionato
            return ResponseEntity.ok(bookingService.getMonthlyAvailability(year, month));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nel recupero del calendario.");
        }
    }
}