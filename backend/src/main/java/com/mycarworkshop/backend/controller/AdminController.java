package com.mycarworkshop.backend.controller;

import com.mycarworkshop.backend.model.enums.AppointmentStatus;
import com.mycarworkshop.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments(
            @RequestParam(required = false) String filterTime,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String licensePlate) {
        try {
            logger.info("Richiesta admin per appuntamenti con filtri: - data: {}, email: {}, targa: {}", filterTime,
                    email, licensePlate);
            return ResponseEntity.ok(adminService.getAllAppointments(filterTime, email, licensePlate));
        } catch (Exception e) {
            logger.error("Errore durante il recupero degli appuntamenti: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante il recupero degli appuntamenti.");
        }
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            if (statusStr == null) {
                logger.error("Status mancante.");
                return ResponseEntity.badRequest().body("Status mancante.");
            }
            AppointmentStatus newStatus = AppointmentStatus.valueOf(statusStr);
            adminService.updateAppointmentStatus(id, newStatus);
            return ResponseEntity.ok("Status aggiornato con successo.");
        } catch (IllegalArgumentException e) {
            logger.error("Errore durante l'aggiornamento dello stato: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Errore durante l'aggiornamento dello stato: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante l'aggiornamento dello stato.");
        }
    }
}
