package com.example.saasecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name; // Nome da loja (ex: Loja do João)

    @Column(nullable = false, unique = true)
    private String slug; // URL da loja (ex: loja-do-joao)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Esse método roda automaticamente antes de salvar no banco para preencher a data
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}