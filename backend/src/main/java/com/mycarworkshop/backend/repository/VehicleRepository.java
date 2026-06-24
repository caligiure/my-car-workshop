package com.mycarworkshop.backend.repository;

import com.mycarworkshop.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // JpaRepository fornisce già metodi come save(), findById(), findAll(), deleteById()
    // Long è il tipo dell'ID del veicolo

    // Metodo derivato per la validazione: cerca se una targa esiste già nel DB.
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    
    // Metodo per il Garage Virtuale: trova tutti i veicoli di un dato utente.
    java.util.List<Vehicle> findByOwnerId(Long ownerId);
}