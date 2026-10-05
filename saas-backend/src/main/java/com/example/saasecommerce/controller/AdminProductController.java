package com.example.saasecommerce.controller;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.model.User;
import com.example.saasecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/produtos")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Product> criarProduto(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Product product) {
        // Extraímos o Tenant ID diretamente do utilizador logado
        Product novoProduto = productService.createProduct(currentUser.getTenantId(), product);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<Product>> listarProdutos(
            @AuthenticationPrincipal User currentUser) {
        List<Product> produtos = productService.getProductsByTenant(currentUser.getTenantId());
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> obterProduto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        Product produto = productService.getProductById(id, currentUser.getTenantId());
        return ResponseEntity.ok(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> atualizarProduto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser,
            @RequestBody Product product) {
        Product atualizado = productService.updateProduct(id, currentUser.getTenantId(), product);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        productService.deleteProduct(id, currentUser.getTenantId());
        return ResponseEntity.noContent().build();
    }
}