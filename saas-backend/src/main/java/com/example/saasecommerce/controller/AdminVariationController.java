package com.example.saasecommerce.controller;

import com.example.saasecommerce.dto.AddStockLinesRequest;
import com.example.saasecommerce.dto.CreateVariationRequest;
import com.example.saasecommerce.dto.VariationResponse;
import com.example.saasecommerce.model.StockLine;
import com.example.saasecommerce.model.User;
import com.example.saasecommerce.service.VariationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminVariationController {

    private final VariationService variationService;

    // ─── VARIAÇÕES ──────────────────────────────────────────────────

    @PostMapping("/produtos/{productId}/variacoes")
    public ResponseEntity<VariationResponse> criarVariacao(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateVariationRequest request) {

        VariationResponse response = variationService.createVariation(
                productId, currentUser.getTenantId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/produtos/{productId}/variacoes")
    public ResponseEntity<List<VariationResponse>> listarVariacoes(
            @PathVariable UUID productId,
            @AuthenticationPrincipal User currentUser) {

        List<VariationResponse> variations = variationService.getVariationsByProduct(
                productId, currentUser.getTenantId());
        return ResponseEntity.ok(variations);
    }

    @GetMapping("/variacoes/{variationId}")
    public ResponseEntity<VariationResponse> obterVariacao(
            @PathVariable UUID variationId,
            @AuthenticationPrincipal User currentUser) {

        VariationResponse response = variationService.getVariation(
                variationId, currentUser.getTenantId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/variacoes/{variationId}")
    public ResponseEntity<VariationResponse> atualizarVariacao(
            @PathVariable UUID variationId,
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateVariationRequest request) {

        VariationResponse response = variationService.updateVariation(
                variationId, currentUser.getTenantId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/variacoes/{variationId}")
    public ResponseEntity<Void> deletarVariacao(
            @PathVariable UUID variationId,
            @AuthenticationPrincipal User currentUser) {

        variationService.deleteVariation(variationId, currentUser.getTenantId());
        return ResponseEntity.noContent().build();
    }

    // ─── LINHAS DE ESTOQUE ──────────────────────────────────────────

    @PostMapping("/variacoes/{variationId}/estoque")
    public ResponseEntity<List<StockLine>> adicionarEstoque(
            @PathVariable UUID variationId,
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody AddStockLinesRequest request) {

        List<StockLine> stockLines = variationService.addStockLines(
                variationId, currentUser.getTenantId(), request.getLines());
        return ResponseEntity.status(HttpStatus.CREATED).body(stockLines);
    }

    @GetMapping("/variacoes/{variationId}/estoque")
    public ResponseEntity<List<StockLine>> listarEstoque(
            @PathVariable UUID variationId,
            @AuthenticationPrincipal User currentUser) {

        List<StockLine> stockLines = variationService.getStockLines(
                variationId, currentUser.getTenantId());
        return ResponseEntity.ok(stockLines);
    }

    @DeleteMapping("/estoque/{stockLineId}")
    public ResponseEntity<Void> deletarLinhaEstoque(
            @PathVariable UUID stockLineId,
            @AuthenticationPrincipal User currentUser) {

        variationService.deleteStockLine(stockLineId, currentUser.getTenantId());
        return ResponseEntity.noContent().build();
    }
}
