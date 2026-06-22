package com.mycarworkshop.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_availabilities")
public class DailyAvailability {

    // La data stessa funge da Chiave Primaria. Un giorno non può essere duplicato.
    @Id
    private LocalDate date;

    @Column(nullable = false)
    private Integer maxCapacity;

    @Column(nullable = false)
    private Integer currentBookings;

    // Gestione concorrenza per gli AGGIORNAMENTI (Optimistic Locking)
    @Version
    private Integer version;

    public DailyAvailability() {
    }

    public DailyAvailability(LocalDate date, Integer maxCapacity, Integer currentBookings) {
        this.date = date;
        this.maxCapacity = maxCapacity;
        this.currentBookings = currentBookings;
    }

    // Getters e Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getCurrentBookings() { return currentBookings; }
    public void setCurrentBookings(Integer currentBookings) { this.currentBookings = currentBookings; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
}