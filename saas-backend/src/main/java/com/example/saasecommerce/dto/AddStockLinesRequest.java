package com.example.saasecommerce.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddStockLinesRequest {

    @NotEmpty(message = "A lista de linhas não pode estar vazia")
    private List<String> lines;
}
