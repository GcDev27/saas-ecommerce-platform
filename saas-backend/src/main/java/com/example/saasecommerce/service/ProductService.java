package com.example.saasecommerce.service;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.model.Tenant;
import com.example.saasecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final TenantService tenantService;

    // Criar (CREATE)
    public Product createProduct(String tenantSlug, String name, String description, BigDecimal price, String slug, String visibility, boolean hasStock, Integer stockQuantity) {
        Tenant tenant = tenantService.getTenantBySlug(tenantSlug);

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .slug(slug)
                .visibility(visibility)
                .hasStock(hasStock)
                .stockQuantity(stockQuantity)
                .tenant(tenant)
                .build();

        return productRepository.save(product);
    }

    // Ler / Listar (READ)
    public List<Product> getProductsByTenant(String tenantSlug) {
        Tenant tenant = tenantService.getTenantBySlug(tenantSlug);
        return productRepository.findAllByTenantId(tenant.getId());
    }
    // Ler um único produto por ID
    public Product getProductById(UUID id, String tenantSlug) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }
    // Atualizar (UPDATE)
    public Product updateProduct(UUID id, String tenantSlug, Product detalhes) {
        Product produto = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Em um cenário real mais rigoroso, verificaríamos se o produto pertence ao tenantSlug aqui

        produto.setName(detalhes.getName());
        produto.setDescription(detalhes.getDescription());
        produto.setPrice(detalhes.getPrice());
        produto.setSlug(detalhes.getSlug());
        produto.setVisibility(detalhes.getVisibility());
        produto.setHasStock(detalhes.isHasStock());
        produto.setStockQuantity(detalhes.getStockQuantity());

        return productRepository.save(produto);
    }

    // Apagar (DELETE)
    public void deleteProduct(UUID id, String tenantSlug) {
        productRepository.deleteById(id);
    }
}