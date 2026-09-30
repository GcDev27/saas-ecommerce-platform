package com.example.saasecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterTenantRequest(
        @NotBlank(message = "O nome da loja é obrigatório")
        String storeName,

        @NotBlank(message = "O slug da loja é obrigatório")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "O slug da loja deve conter apenas letras minúsculas, números e hífens")
        String storeSlug,

        @NotBlank(message = "O nome do administrador é obrigatório")
        String adminName,

        @Email(message = "E-mail inválido")
        @NotBlank(message = "O e-mail é obrigatório")
        String adminEmail,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres")
        String adminPassword
) {}
