package com.mycarworkshop.backend.repository;

import com.mycarworkshop.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // JpaRepository fornisce già metodi come save(), findById(), findAll(), deleteById()
    // Long è il tipo dell'ID del veicolo
}