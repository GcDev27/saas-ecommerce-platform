package com.example.saasecommerce.dto;

public record AuthenticationRequest(
        String email,
        String password
) {}