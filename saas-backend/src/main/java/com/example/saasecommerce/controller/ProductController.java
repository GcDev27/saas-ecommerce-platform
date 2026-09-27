package com.example.saasecommerce.controller;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // POST: /api/produtos
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

    // GET: /api/produtos
    @GetMapping
    public ResponseEntity<List<Product>> listarProdutos(
            @RequestHeader("X-Tenant-Slug") String tenantSlug) {

        List<Product> produtos = productService.getProductsByTenant(tenantSlug);
        return ResponseEntity.ok(produtos);
    }
    // GET: /api/produtos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> obterProduto(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-Slug") String tenantSlug) {

        Product produto = productService.getProductById(id, tenantSlug);
        return ResponseEntity.ok(produto);
    }
    // PUT: /api/produtos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Product> atualizarProduto(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-Slug") String tenantSlug,
            @RequestBody Product productDetails) {

        Product atualizado = productService.updateProduct(id, tenantSlug, productDetails);
        return ResponseEntity.ok(atualizado);
    }

    // DELETE: /api/produtos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagarProduto(
            @PathVariable UUID id,
            @RequestHeader("X-Tenant-Slug") String tenantSlug) {

        productService.deleteProduct(id, tenantSlug);
        return ResponseEntity.noContent().build();
    }
}