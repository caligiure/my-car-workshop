package com.mycarworkshop.backend.dto;

/**
 * DTO utilizzato per il trasferimento dei dati durante la registrazione di un nuovo utente.
 * Non includiamo il campo "ruolo" perché di default ogni nuovo registrato è un "USER".
 */
public class UserRegistrationDTO {

    private String email;
    private String password;
    private String nome;
    private String cognome;

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
}