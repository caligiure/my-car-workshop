package com.mycarworkshop.backend.dto;

public class AuthResponseDTO {
    private String token;
    private Long userId;

    public AuthResponseDTO(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
}