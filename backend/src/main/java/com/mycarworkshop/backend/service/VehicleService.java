package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.VehicleRequestDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.model.Vehicle;
import com.mycarworkshop.backend.repository.UserRepository;
import com.mycarworkshop.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    // Autowired: costruttore che permette l'iniezione delle dipendenze dei repository necessari per il servizio
    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    // Transactional: assicura che il metodo sia eseguito in una transazione, garantendo coerenza dei dati
    @Transactional
    public Vehicle addVehicle(VehicleRequestDTO requestDTO) {
        // 1. Validazione Targa: Controlliamo che l'auto non sia già registrata
        if (vehicleRepository.findByLicensePlate(requestDTO.getLicensePlate()).isPresent()) {
            throw new IllegalArgumentException("Un veicolo con questa targa è già presente nel sistema.");
        }

        // 2. Recupero Utente: Assicuriamoci che l'ID fornito corrisponda a un utente reale
        User owner = userRepository.findById(requestDTO.getOwnerId())
                .orElseThrow(() -> new IllegalArgumentException("Utente proprietario non trovato. Impossibile associare il veicolo."));

        // 3. Creazione dell'entità
        Vehicle newVehicle = new Vehicle(
                requestDTO.getLicensePlate(),
                requestDTO.getBrand(),
                requestDTO.getModel(),
                requestDTO.getProductionYear(),
                requestDTO.getEngineType(),
                owner
        );

        // 4. Salvataggio
        return vehicleRepository.save(newVehicle);
    }
}