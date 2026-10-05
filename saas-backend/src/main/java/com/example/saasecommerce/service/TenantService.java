package com.example.saasecommerce.service;

import com.example.saasecommerce.model.Tenant;
import com.example.saasecommerce.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    // Regra de Negócio 1: Criar uma loja nova
    public Tenant createTenant(String name, String slug) {
        // Verifica se a URL já está sendo usada por outra loja
        if (tenantRepository.findBySlug(slug).isPresent()) {
            throw new IllegalArgumentException("Esta URL já está em uso por outra loja!");
        }

        Tenant newTenant = Tenant.builder()
                .name(name)
                .slug(slug)
                .build();

        return tenantRepository.save(newTenant); // Salva no Postgres!
    }

    // Regra de Negócio 2: Buscar uma loja pelo slug
    public Tenant getTenantBySlug(String slug) {
        return tenantRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada!"));
    }

    // Regra de Negócio: Buscar uma loja pelo ID
    public Tenant getTenantById(java.util.UUID id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada!"));
    }

    // Regra de Negócio 3: Atualizar configurações da loja
    public Tenant updateTenantSettings(java.util.UUID id, String theme, String primaryColor, String font, String heroTitle, String heroDescription, String logoUrl) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada!"));
                
        if (theme != null) tenant.setTheme(theme);
        if (primaryColor != null) tenant.setPrimaryColor(primaryColor);
        if (font != null) tenant.setFont(font);
        if (heroTitle != null) tenant.setHeroTitle(heroTitle);
        if (heroDescription != null) tenant.setHeroDescription(heroDescription);
        if (logoUrl != null) tenant.setLogoUrl(logoUrl);

        return tenantRepository.save(tenant);
    }
}