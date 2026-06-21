package com.mycarworkshop.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // La targa deve essere unica e obbligatoria
    @Column(nullable = false)
    private String licensePlate;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer registrationYear; // Evitiamo di chiamarlo solo "year" che a volte è parola riservata in SQL

    @Column(nullable = false)
    private String engineType;

    // Relazione: Molti veicoli appartengono a un solo Utente
    // FetchType.LAZY -> quando legge un veicolo dal database, non fa subito una query extra (Join) 
    //      per caricare tutto l'oggetto User associato, a meno che io non chiami esplicitamente il metodo getOwner()
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    // Costruttore vuoto richiesto da JPA
    public Vehicle() {
    }

    public Vehicle(String licensePlate, String brand, String model, Integer registrationYear, String engineType, User owner) {
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.registrationYear = registrationYear;
        this.engineType = engineType;
        this.owner = owner;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getRegistrationYear() { return registrationYear; }
    public void setRegistrationYear(Integer registrationYear) { this.registrationYear = registrationYear; }

    public String getEngineType() { return engineType; }
    public void setEngineType(String engineType) { this.engineType = engineType; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}