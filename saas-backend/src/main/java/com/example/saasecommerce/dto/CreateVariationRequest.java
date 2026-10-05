package com.example.saasecommerce.dto;

import com.example.saasecommerce.model.DeliveryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateVariationRequest {

    @NotBlank(message = "O nome da variação é obrigatório")
    private String name;

    @NotNull(message = "O preço é obrigatório")
    private BigDecimal price;

    private BigDecimal compareAtPrice;

    @NotNull(message = "O tipo de entrega é obrigatório")
    private DeliveryType deliveryType;

    // Mensagem automática do chat (só para MANUAL_CHAT)
    private String chatInitialMessage;

    // Controle de estoque manual (para MANUAL_CHAT)
    private boolean hasUnlimitedStock;
    private Integer stockQuantity;
}
