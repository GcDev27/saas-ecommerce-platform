package com.example.saasecommerce.dto;

import com.example.saasecommerce.model.DeliveryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VariationResponse {

    private UUID id;
    private String name;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private DeliveryType deliveryType;
    private String chatInitialMessage;
    private boolean hasUnlimitedStock;
    private Integer stockQuantity;

    // Contagem calculada a partir das StockLines
    private long availableStockCount;

    private LocalDateTime createdAt;
}
