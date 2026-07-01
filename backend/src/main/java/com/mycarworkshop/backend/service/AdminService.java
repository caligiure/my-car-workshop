package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.AdminAppointmentDTO;
import com.mycarworkshop.backend.model.Appointment;
import com.mycarworkshop.backend.model.enums.AppointmentStatus;
import com.mycarworkshop.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AppointmentRepository appointmentRepo;

    @Autowired
    public AdminService(AppointmentRepository appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }

    @Transactional(readOnly = true)
    public List<AdminAppointmentDTO> getAllAppointments(String filterTime, String email, String licensePlate) {
        List<Appointment> allAppointments = appointmentRepo.findAll();
        LocalDate today = LocalDate.now();

        return allAppointments.stream()
            .filter(app -> {
                // Filtro Temporale (passato/futuro)
                if ("future".equalsIgnoreCase(filterTime)) {
                    if (app.getAppointmentDate().isBefore(today)) return false;
                } else if ("past".equalsIgnoreCase(filterTime)) {
                    if (app.getAppointmentDate().isAfter(today) || app.getAppointmentDate().isEqual(today)) return false;
                }
                
                // Filtro per Email
                if (email != null && !email.trim().isEmpty()) {
                    if (!app.getVehicle().getOwner().getEmail().toLowerCase().contains(email.toLowerCase())) return false;
                }
                
                // Filtro per Targa
                if (licensePlate != null && !licensePlate.trim().isEmpty()) {
                    if (!app.getVehicle().getLicensePlate().toLowerCase().contains(licensePlate.toLowerCase())) return false;
                }
                
                return true;
            })
            .map(this::mapToAdminDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void updateAppointmentStatus(Long id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Apputamento non trovato."));
        
        appointment.setStatus(newStatus);
        appointmentRepo.save(appointment);
    }

    private AdminAppointmentDTO mapToAdminDTO(Appointment app) {
        AdminAppointmentDTO dto = new AdminAppointmentDTO();
        dto.setId(app.getId());
        dto.setDate(app.getAppointmentDate());
        dto.setTimeSlot(app.getTimeSlot());
        dto.setNotes(app.getUserNotes());
        dto.setInterventionType(app.getInterventionType());
        dto.setStatus(app.getStatus());
        
        if (app.getVehicle() != null) {
            dto.setVehicleBrand(app.getVehicle().getBrand());
            dto.setVehicleModel(app.getVehicle().getModel());
            dto.setVehicleLicensePlate(app.getVehicle().getLicensePlate());
            
            if (app.getVehicle().getOwner() != null) {
                dto.setClientEmail(app.getVehicle().getOwner().getEmail());
                dto.setClientName(app.getVehicle().getOwner().getName());
                dto.setClientSurname(app.getVehicle().getOwner().getSurname());
            }
        }
        return dto;
    }
}
