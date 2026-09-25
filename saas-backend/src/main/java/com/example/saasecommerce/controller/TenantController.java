package com.example.saasecommerce.controller;

import com.example.saasecommerce.model.Tenant;
import com.example.saasecommerce.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tenants")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor // Injeta o Service automaticamente graças ao Lombok
public class TenantController {

    private final TenantService tenantService;

    // DTOs para organizar a entrada e a saída
    public record TenantRequestDTO(String name, String slug) {}
    public record TenantResponseDTO(UUID id, String name, String slug) {}

    // Rota POST: Cria a loja (O Next.js vai chamar isso ao cadastrar um cliente)
    @PostMapping
    public ResponseEntity<TenantResponseDTO> createTenant(@RequestBody TenantRequestDTO request) {
        Tenant tenant = tenantService.createTenant(request.name(), request.slug());

        TenantResponseDTO response = new TenantResponseDTO(tenant.getId(), tenant.getName(), tenant.getSlug());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Rota GET: Busca a loja pelo slug (O Next.js vai chamar isso para carregar a vitrine)
    @GetMapping("/{slug}")
    public ResponseEntity<TenantResponseDTO> getTenantBySlug(@PathVariable String slug) {
        Tenant tenant = tenantService.getTenantBySlug(slug);

        TenantResponseDTO response = new TenantResponseDTO(tenant.getId(), tenant.getName(), tenant.getSlug());
        return ResponseEntity.ok(response);
    }
}