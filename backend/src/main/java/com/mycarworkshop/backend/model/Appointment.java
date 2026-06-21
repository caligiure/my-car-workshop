package com.mycarworkshop.backend.model;

import com.mycarworkshop.backend.model.enums.AppointmentStatus;
import com.mycarworkshop.backend.model.enums.InterventionType;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // GESTIONE CONCORRENZA: Optimistic Locking di JPA per risolvere Race Condition fra Admin e User
    // Ogni volta che un record di appuntamento viene creato, MySQL imposta version = 0. 
    // Se l'Admin o l'Utente modificano l'appuntamento, Spring incrementa automaticamente il numero.
    // Se due transazioni tentano di aggiornare lo stesso record contemporaneamente partendo dalla stessa versione,
    // Spring lancerà un'eccezione ObjectOptimisticLockingFailureException
    @Version
    private Integer version;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    // Rappresenta lo slot orario (es. "10:00 - 11:00")
    @Column(nullable = false)
    private String timeSlot;

    @Enumerated(EnumType.STRING) // Salva l'enum come stringa nel DB (es. "INSPECTION") invece che come numero (es. 0, 1, 2...)
    @Column(nullable = false)
    private InterventionType interventionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    // Relazione: Molti appuntamenti sono associati a un solo veicolo
    @ManyToOne(fetch = FetchType.LAZY, optional = false) // FetchType.LAZY -> i dati del veicolo associato vengono caricati solo quando effettivamente richiesti (ottimizzazione delle performance)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(length = 500)
    private String userNotes; // Eventuali note aggiuntive del cliente

    public Appointment() {
    }

    public Appointment(LocalDate appointmentDate, String timeSlot, InterventionType interventionType, AppointmentStatus status, Vehicle vehicle, String userNotes) {
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.interventionType = interventionType;
        this.status = status;
        this.vehicle = vehicle;
        this.userNotes = userNotes;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public InterventionType getInterventionType() { return interventionType; }
    public void setInterventionType(InterventionType interventionType) { this.interventionType = interventionType; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public String getUserNotes() { return userNotes; }
    public void setUserNotes(String userNotes) { this.userNotes = userNotes; }
}