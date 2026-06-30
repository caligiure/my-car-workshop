package com.mycarworkshop.backend.repository;

import com.mycarworkshop.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // JpaRepository fornisce già metodi come save(), findById(), findAll(),
    // deleteById()

    List<Appointment> findByVehicleOwnerEmail(String email);
}