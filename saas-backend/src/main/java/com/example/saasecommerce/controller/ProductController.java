package com.example.saasecommerce.controller;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Product> criarProduto(
            @RequestHeader("X-Tenant-Slug") String tenantSlug,
            @RequestBody Product product) {

        Product novoProduto = productService.createProduct(
                tenantSlug,
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getSlug(),
                product.getVisibility(),
                product.isHasStock(),
                product.getStockQuantity()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<Product>> listarProdutos(
            @RequestHeader("X-Tenant-Slug") String tenantSlug) {

        List<Product> produtos = productService.getProductsByTenant(tenantSlug);
        return ResponseEntity.ok(produtos);
    }
}