package com.mycarworkshop.backend.model.enums;

public enum AppointmentStatus {
    REQUESTED, // Richiesto dall'utente, in attesa di conferma
    CONFIRMED, // Confermato dall'officina
    COMPLETED, // Intervento completato (visibile nello storico)
    CANCELLED  // Annullato
}