package com.example.saasecommerce.repository;

import com.example.saasecommerce.model.StockLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StockLineRepository extends JpaRepository<StockLine, UUID> {

    // Lista todas as linhas de estoque de uma variação
    List<StockLine> findAllByVariationId(UUID variationId);

    // Conta quantas linhas ainda não foram entregues (estoque disponível)
    long countByVariationIdAndIsDeliveredFalse(UUID variationId);

    // Pega a primeira linha disponível (não entregue) para entrega automática
    Optional<StockLine> findFirstByVariationIdAndIsDeliveredFalseOrderByCreatedAtAsc(UUID variationId);
}
