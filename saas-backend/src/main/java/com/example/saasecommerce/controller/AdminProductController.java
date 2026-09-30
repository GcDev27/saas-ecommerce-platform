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
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    // POST: /api/admin/produtos
    @PostMapping
    public ResponseEntity<Product> criarProduto(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Product product) {

        // Extraímos o Tenant ID diretamente do usuário logado (segurança máxima!)
        Product novoProduto = productService.createProduct(currentUser.getTenant(), product);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    // GET: /api/admin/produtos
    @GetMapping
    public ResponseEntity<List<Product>> listarProdutos(
            @AuthenticationPrincipal User currentUser) {

        List<Product> produtos = productService.getProductsByTenant(currentUser.getTenant());
        return ResponseEntity.ok(produtos);
    }

    // GET: /api/admin/produtos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> obterProduto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        Product produto = productService.getProductById(id, currentUser.getTenant());
        return ResponseEntity.ok(produto);
    }

    // PUT: /api/admin/produtos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Product> atualizarProduto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser,
            @RequestBody Product productDetails) {

        Product atualizado = productService.updateProduct(id, currentUser.getTenant(), productDetails);
        return ResponseEntity.ok(atualizado);
    }

    // DELETE: /api/admin/produtos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagarProduto(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {

        productService.deleteProduct(id, currentUser.getTenant());
        return ResponseEntity.noContent().build();
    }
}