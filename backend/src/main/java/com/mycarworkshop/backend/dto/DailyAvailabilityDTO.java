package com.mycarworkshop.backend.dto;

import java.time.LocalDate;

/**
 * DTO semplificato usato dal Front-end per visualizzare il calendario.
 * Deve contenere SOLO i dati necessari per la vista, senza riferimenti ciclici.
 */
public class DailyAvailabilityDTO {

    private LocalDate date;
    private boolean available; // false se currentBookings >= maxCapacity
    private int currentBookings;
    private int maxCapacity;

    // Costruttore vuoto necessario per la deserializzazione (Jackson)
    public DailyAvailabilityDTO() {
    }

    // Costruttore completo per la creazione di nuovi DTO
    public DailyAvailabilityDTO(LocalDate date, int currentBookings, int maxCapacity) {
        this.date = date;
        this.currentBookings = currentBookings;
        this.maxCapacity = maxCapacity;
        this.available = currentBookings < maxCapacity;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public int getCurrentBookings() {
        return currentBookings;
    }

    public void setCurrentBookings(int currentBookings) {
        this.currentBookings = currentBookings;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
}
