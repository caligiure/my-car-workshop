package com.mycarworkshop.backend.model;

import jakarta.persistence.*;
import java.util.List;


@Entity // Dice a Spring e Hibernate che questa classe Java rappresenta una tabella all'interno del DB
@Table(name = "users") // Specifica il nome effettivo della tabella nel DB
public class User {

    @Id // Indica che questo campo è la chiave primaria della tabella
    @GeneratedValue(strategy = GenerationType.IDENTITY) // La strategia IDENTITY autoincrementa questo numero a ogni nuovo utente salvato
    private Long id;

    @Column(nullable = false, unique = true) // vincoli d'integrità fondamentali sulla colonna email
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false)
    private String role; // Es: "USER" oppure "ADMIN"

    // Relazione: Un utente possiede molti veicoli
    // cascade = CascadeType.ALL e orphanRemoval = true -> se elimino un utente, elimino anche tutti i veicoli associati a quell'utente
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicle> vehicles;

    // Costruttore vuoto richiesto da JPA
    public User() {
    }

    public User(String email, String password, String name, String surname, String role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.role = role;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Vehicle> getVehicles() { return vehicles; }
    public void setVehicles(List<Vehicle> vehicles) { this.vehicles = vehicles; }
}