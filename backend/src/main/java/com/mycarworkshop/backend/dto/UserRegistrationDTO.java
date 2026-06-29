package com.mycarworkshop.backend.dto;

/**
 * DTO utilizzato per il trasferimento dei dati durante la registrazione di un nuovo utente.
 */
public class UserRegistrationDTO {

    private String email;
    private String password;
    private String name;
    private String surname;
    private String role;

    // Getters e Setters
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
}