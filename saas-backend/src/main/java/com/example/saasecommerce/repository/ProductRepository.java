package com.example.saasecommerce.repository;

import com.example.saasecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Regra de Isolamento: Retorna os produtos filtrando pelo ID do lojista
    List<Product> findAllByTenantId(UUID tenantId);
}