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

    // Criar (CREATE) - Admin Seguro
    public Product createProduct(Tenant tenant, Product product) {
        product.setTenant(tenant);
        return productRepository.save(product);
    }

    // Ler / Listar (READ) - Admin Seguro
    public List<Product> getProductsByTenant(Tenant tenant) {
        return productRepository.findAllByTenantId(tenant.getId());
    }

    // Ler um único produto por ID - Admin Seguro
    public Product getProductById(UUID id, Tenant tenant) {
        return productRepository.findByIdAndTenantId(id, tenant.getId())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado ou não pertence a esta loja"));
    }

    // Atualizar (UPDATE) - Admin Seguro
    public Product updateProduct(UUID id, Tenant tenant, Product detalhes) {
        Product produto = getProductById(id, tenant); // Já verifica se pertence ao tenant!

        produto.setName(detalhes.getName());
        produto.setDescription(detalhes.getDescription());
        produto.setSlug(detalhes.getSlug());
        produto.setVisibility(detalhes.getVisibility());

        return productRepository.save(produto);
    }

    // Apagar (DELETE) - Admin Seguro
    public void deleteProduct(UUID id, Tenant tenant) {
        Product produto = getProductById(id, tenant); // Garante que pertence
        productRepository.delete(produto);
    }
}