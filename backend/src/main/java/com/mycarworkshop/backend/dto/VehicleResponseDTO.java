package com.mycarworkshop.backend.dto;

/**
 * DTO utilizzato per inviare i dati di un veicolo al frontend.
 * NOTA: Omettiamo deliberatamente il riferimento all'oggetto "User" per evitare
 * problemi di riferimenti circolari (Infinite Recursion) durante la conversione in JSON.
 */
public class VehicleResponseDTO {

    private Long id; // Fondamentale per il frontend (es. per il pulsante "Prenota" o "Elimina")
    private String licensePlate;
    private String brand;
    private String model;
    private Integer productionYear;
    private String engineType;

    // Costruttore vuoto
    public VehicleResponseDTO() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getProductionYear() { return productionYear; }
    public void setProductionYear(Integer productionYear) { this.productionYear = productionYear; }

    public String getEngineType() { return engineType; }
    public void setEngineType(String engineType) { this.engineType = engineType; }
}