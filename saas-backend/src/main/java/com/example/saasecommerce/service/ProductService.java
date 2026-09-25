package com.example.saasecommerce.service;

import com.example.saasecommerce.model.Product;
import com.example.saasecommerce.model.Tenant;
import com.example.saasecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final TenantService tenantService;

    public Product createProduct(String tenantSlug, String name, String description, BigDecimal price,
                                 String slug, String visibility, Boolean hasStock, Integer stockQuantity) {

        Tenant tenant = tenantService.getTenantBySlug(tenantSlug);

        // BLINDAGEM CONTRA XSS COM JSOUP:
        // Permite formatação rica (p, div, b, i, u, ul, li), mas bloqueia scripts e iframes perigosos.
        String safeDescription = "";
        if (description != null) {
            safeDescription = Jsoup.clean(description, Safelist.relaxed());
        }

        boolean safeHasStock = (hasStock != null) ? hasStock : false;

        Product product = Product.builder()
                .name(name)
                .description(safeDescription) // Salva apenas o HTML validado
                .price(price)
                .slug(slug)
                .visibility(visibility)
                .hasStock(safeHasStock)
                .stockQuantity(stockQuantity)
                .tenant(tenant)
                .build();

        return productRepository.save(product);
    }

    public List<Product> getProductsByTenant(String tenantSlug) {
        Tenant tenant = tenantService.getTenantBySlug(tenantSlug);
        return productRepository.findAllByTenantId(tenant.getId());
    }
}