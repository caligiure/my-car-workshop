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

    @Transactional
    public VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO requestDTO, String userEmail) {
        // Recupero il veicolo dal database tramite ID
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veicolo non trovato nel sistema."));

        // CONTROLLO DI SICUREZZA CRITICO: l'utente possiede davvero questo veicolo?
        // Impedisce a un utente malizioso di modificare le auto di altri cambiando l'ID
        if (!vehicle.getOwner().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Non sei autorizzato a modificare i dati di questo veicolo.");
        }

        // Validazione targa: se la targa viene cambiata, verifichiamo che non sia già
        // di qualcun altro
        if (!vehicle.getLicensePlate().equals(requestDTO.getLicensePlate())) {
            if (vehicleRepository.findByLicensePlate(requestDTO.getLicensePlate()).isPresent()) {
                throw new IllegalArgumentException("Un veicolo con questa nuova targa è già presente nel sistema.");
            }
            vehicle.setLicensePlate(requestDTO.getLicensePlate());
        }

        // Aggiornamento dei campi consentiti
        vehicle.setBrand(requestDTO.getBrand());
        vehicle.setModel(requestDTO.getModel());
        vehicle.setProductionYear(requestDTO.getProductionYear());
        vehicle.setEngineType(requestDTO.getEngineType());

        // Salvataggio ed estrazione del DTO di risposta pulito per Jackson
        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        VehicleResponseDTO responseDTO = new VehicleResponseDTO();
        responseDTO.setId(updatedVehicle.getId());
        responseDTO.setLicensePlate(updatedVehicle.getLicensePlate());
        responseDTO.setBrand(updatedVehicle.getBrand());
        responseDTO.setModel(updatedVehicle.getModel());
        responseDTO.setProductionYear(updatedVehicle.getProductionYear());
        responseDTO.setEngineType(updatedVehicle.getEngineType());

        return responseDTO;
    }

    @Transactional
    public void deleteVehicle(Long id, String userEmail) {
        // Recupero il veicolo dal database tramite ID
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veicolo non trovato nel sistema."));

        // CONTROLLO DI SICUREZZA CRITICO: l'utente è il proprietario?
        if (!vehicle.getOwner().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Non sei autorizzato a eliminare questo veicolo.");
        }

        // Eliminazione del veicolo
        vehicleRepository.delete(vehicle);
    }
}