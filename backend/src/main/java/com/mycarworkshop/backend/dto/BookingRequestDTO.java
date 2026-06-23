package com.mycarworkshop.backend.dto;

import com.mycarworkshop.backend.model.enums.InterventionType;
import java.time.LocalDate;

/**
 * Questo DTO mappa esattamente il JSON che Angular invierà al Back-end
 * quando l'utente preme il pulsante "Prenota".
 */
public class BookingRequestDTO {
    
    private LocalDate date;
    private String timeSlot;
    private Long vehicleId;
    private String notes;
    private InterventionType interventionType;

    // Getters e Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public InterventionType getInterventionType() { return interventionType; }
    public void setInterventionType(InterventionType interventionType) { this.interventionType = interventionType; }
}