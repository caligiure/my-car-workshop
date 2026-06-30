package com.mycarworkshop.backend.service;

import com.mycarworkshop.backend.dto.VehicleRequestDTO;
import com.mycarworkshop.backend.dto.VehicleResponseDTO;
import com.mycarworkshop.backend.model.User;
import com.mycarworkshop.backend.model.Vehicle;
import com.mycarworkshop.backend.repository.UserRepository;
import com.mycarworkshop.backend.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    // Autowired: costruttore che permette l'iniezione delle dipendenze dei
    // repository necessari per il servizio
    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    // Transactional: assicura che il metodo sia eseguito in una transazione,
    // garantendo coerenza dei dati
    @Transactional
    public VehicleResponseDTO addVehicle(VehicleRequestDTO requestDTO, String userEmail) {
        // Validazione Targa: Controlliamo che l'auto non sia già registrata
        if (vehicleRepository.findByLicensePlate(requestDTO.getLicensePlate()).isPresent()) {
            throw new IllegalArgumentException("Un veicolo con questa targa è già presente nel sistema.");
        }

        // Recupero Utente tramite l'email sicura estratta dal Token JWT
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Utente non trovato nel sistema di sicurezza."));

        // Creazione dell'entità
        Vehicle newVehicle = new Vehicle(
                requestDTO.getLicensePlate(),
                requestDTO.getBrand(),
                requestDTO.getModel(),
                requestDTO.getProductionYear(),
                requestDTO.getEngineType(),
                owner);

        // Salvataggio nel DB
        Vehicle savedVehicle = vehicleRepository.save(newVehicle);

        // MAPPING DA ENTITY A DTO
        VehicleResponseDTO responseDTO = new VehicleResponseDTO();
        responseDTO.setId(savedVehicle.getId());
        responseDTO.setLicensePlate(savedVehicle.getLicensePlate());
        responseDTO.setBrand(savedVehicle.getBrand());
        responseDTO.setModel(savedVehicle.getModel());
        responseDTO.setProductionYear(savedVehicle.getProductionYear());
        responseDTO.setEngineType(savedVehicle.getEngineType());

        return responseDTO;
    }

    /**
     * Recupera la lista dei veicoli di un utente per il "Garage Virtuale"
     * Ottimizziamo la transazione come sola lettura (readOnly = true) per
     * massimizzare le performance.
     */
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getUserVehicles(String email) {

        // Fail-fast validation: controlliamo prima che l'utente esista
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utente non registrato"));
        Long ownerId = user.getId();

        // Recupero le entità dal DB
        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(ownerId);

        // Mappo la lista di Entità (Vehicle) in una lista di DTO utilizzando gli stream
        // di Java
        return vehicles.stream().map(vehicle -> {
            VehicleResponseDTO dto = new VehicleResponseDTO();
            dto.setId(vehicle.getId());
            dto.setLicensePlate(vehicle.getLicensePlate());
            dto.setBrand(vehicle.getBrand());
            dto.setModel(vehicle.getModel());
            dto.setProductionYear(vehicle.getProductionYear());
            dto.setEngineType(vehicle.getEngineType());
            return dto;
        }).collect(Collectors.toList());
    }
}