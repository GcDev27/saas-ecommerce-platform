package com.example.saasecommerce.dto;

import java.util.UUID;

public record RegisterTenantResponse(
        String token,
        UUID tenantId,
        String storeName,
        String storeSlug,
        String adminEmail
) {}
