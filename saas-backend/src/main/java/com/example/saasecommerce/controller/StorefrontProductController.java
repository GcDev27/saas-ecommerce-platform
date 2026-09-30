package com.example.saasecommerce.controller;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.model.Tenant;
import com.example.saasecommerce.service.ProductService;
import com.example.saasecommerce.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storefront/produtos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StorefrontProductController {

    private final ProductService productService;
    private final TenantService tenantService;

    // Rota pública para listar todos os produtos visíveis de uma vitrine específica
    @GetMapping
    public ResponseEntity<List<Product>> listarProdutosDaVitrine(
            @RequestHeader("X-Tenant-Slug") String tenantSlug) {

        // 1. Validar se a loja existe pelo slug
        Tenant tenant = tenantService.getTenantBySlug(tenantSlug);
        
        // 2. Retornar os produtos daquela loja
        List<Product> produtos = productService.getProductsByTenant(tenant);
        
        // Em um cenário real, também filtraríamos aqui produtos ocultos (visibility != "PUBLIC") ou sem estoque
        return ResponseEntity.ok(produtos);
    }
}
