package com.mycarworkshop.backend.repository;

import com.mycarworkshop.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Ci servirà nel Controller per recuperare il veicolo prima di passarlo al Service
    // JpaRepository fornisce già metodi come save(), findById(), findAll(), deleteById()
    // Long è il tipo dell'ID del veicolo
}