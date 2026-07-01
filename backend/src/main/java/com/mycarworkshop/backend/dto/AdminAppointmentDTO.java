package com.mycarworkshop.backend.dto;

import com.mycarworkshop.backend.model.enums.AppointmentStatus;
import com.mycarworkshop.backend.model.enums.InterventionType;
import java.time.LocalDate;

public class AdminAppointmentDTO {
    private Long id;
    private LocalDate date;
    private String timeSlot;
    private String notes;
    private InterventionType interventionType;
    private AppointmentStatus status;
    
    // Dati Cliente
    private String clientEmail;
    private String clientName;
    private String clientSurname;
    
    // Dati Veicolo
    private String vehicleBrand;
    private String vehicleModel;
    private String vehicleLicensePlate;

    public AdminAppointmentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public InterventionType getInterventionType() { return interventionType; }
    public void setInterventionType(InterventionType interventionType) { this.interventionType = interventionType; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientSurname() { return clientSurname; }
    public void setClientSurname(String clientSurname) { this.clientSurname = clientSurname; }

    public String getVehicleBrand() { return vehicleBrand; }
    public void setVehicleBrand(String vehicleBrand) { this.vehicleBrand = vehicleBrand; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getVehicleLicensePlate() { return vehicleLicensePlate; }
    public void setVehicleLicensePlate(String vehicleLicensePlate) { this.vehicleLicensePlate = vehicleLicensePlate; }
}
