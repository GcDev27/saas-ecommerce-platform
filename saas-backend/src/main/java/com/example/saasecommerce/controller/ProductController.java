package com.example.saasecommerce.controller;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tenants/{tenantSlug}/products")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Utilizamos 'Boolean' em vez de 'boolean' para evitar falhas caso o frontend envie 'null'
    public record ProductRequestDTO(String name, String description, BigDecimal price, String slug, String visibility, Boolean hasStock, Integer stockQuantity) {}
    public record ProductResponseDTO(UUID id, String name, String description, BigDecimal price, String slug, String visibility, Boolean hasStock, Integer stockQuantity) {}

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(
            @PathVariable("tenantSlug") String tenantSlug,
            @RequestBody ProductRequestDTO request) {

        Product product = productService.createProduct(
                tenantSlug, request.name(), request.description(), request.price(),
                request.slug(), request.visibility(), request.hasStock(), request.stockQuantity()
        );

        ProductResponseDTO response = new ProductResponseDTO(
                product.getId(), product.getName(), product.getDescription(), product.getPrice(),
                product.getSlug(), product.getVisibility(), product.isHasStock(), product.getStockQuantity()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> listProducts(@PathVariable("tenantSlug") String tenantSlug) {
        List<Product> products = productService.getProductsByTenant(tenantSlug);

        List<ProductResponseDTO> response = products.stream()
                .map(p -> new ProductResponseDTO(
                        p.getId(), p.getName(), p.getDescription(), p.getPrice(),
                        p.getSlug(), p.getVisibility(), p.isHasStock(), p.getStockQuantity()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}