package com.example.saasecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // --- CAMPOS AVANÇADOS DO PRODUTO ---

    @Column(name = "slug", unique = true)
    private String slug;

    // O default ensina o banco a preencher os produtos antigos com "Visível na loja"
    @Column(nullable = false, columnDefinition = "varchar(255) default 'Visível na loja'")
    private String visibility;

    // O default false previne o erro de valores nulos nos produtos antigos
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean hasStock;

    @Column
    private Integer stockQuantity;

    // ------------------------------------

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}