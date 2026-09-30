package com.example.saasecommerce.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}