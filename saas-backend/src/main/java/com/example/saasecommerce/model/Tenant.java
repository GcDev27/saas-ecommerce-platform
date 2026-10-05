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

    // --- Sistema de Temas (Customização da Loja) ---
    @Column(name = "theme", nullable = false)
    @Builder.Default
    private String theme = "theme-glass"; // Padrão: Dark Mode Premium

    @Column(name = "primary_color", nullable = false)
    @Builder.Default
    private String primaryColor = "#8b5cf6"; // Padrão: Roxo (violet-500)
    
    @Column(name = "font_family", nullable = false)
    @Builder.Default
    private String font = "Inter"; // Fonte moderna

    @Column(name = "hero_title", columnDefinition = "TEXT")
    @Builder.Default
    private String heroTitle = "Premium Digital Assets.";

    @Column(name = "hero_description", columnDefinition = "TEXT")
    @Builder.Default
    private String heroDescription = "Elevate seu projeto com produtos, scripts e licenças de alta qualidade desenvolvidos por especialistas.";

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;
    // ---------------------------------------------

    // Esse método roda automaticamente antes de salvar no banco para preencher a data
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}