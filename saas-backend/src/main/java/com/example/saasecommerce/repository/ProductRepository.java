package com.example.saasecommerce.repository;

import com.example.saasecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Regra de Isolamento: Retorna os produtos filtrando pelo ID do lojista
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variations WHERE p.tenantId = :tenantId")
    List<Product> findAllByTenantId(UUID tenantId);
    
    // Busca segura garantindo que o produto pertence ao tenant
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variations WHERE p.id = :id AND p.tenantId = :tenantId")
    Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId);
    
    // Vitrine pública: filtra por visibilidade (VISIBLE) e força o carregamento das variações
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variations WHERE p.tenantId = :tenantId AND p.visibility = :visibility")
    List<Product> findAllByTenantIdAndVisibility(UUID tenantId, String visibility);
    
    // Busca por slug público para página de detalhe e força o carregamento das variações
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variations WHERE p.slug = :slug AND p.tenantId = :tenantId")
    Optional<Product> findBySlugAndTenantId(String slug, UUID tenantId);
}