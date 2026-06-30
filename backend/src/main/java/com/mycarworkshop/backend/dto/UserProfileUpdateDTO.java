package com.mycarworkshop.backend.dto;

public class UserProfileUpdateDTO {
    private String name;
    private String surname;

    // Costruttori
    public UserProfileUpdateDTO() {}

    public UserProfileUpdateDTO(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
}
