package com.example.saasecommerce.service;

import com.example.saasecommerce.dto.AuthenticationRequest;
import com.example.saasecommerce.dto.AuthenticationResponse;
import com.example.saasecommerce.dto.RegisterRequest;
import com.example.saasecommerce.model.Tenant;
import com.example.saasecommerce.model.User;
import com.example.saasecommerce.repository.TenantRepository;
import com.example.saasecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional // Impede que o utilizador seja criado se a loja falhar (e vice-versa)
    public AuthenticationResponse register(RegisterRequest request) {

        // 1. Gera um slug automático (URL amigável) para a loja
        String storeSlug = Normalizer.normalize(request.getStoreName().toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)+", "");

        // 2. Instancia e salva a Loja (Tenant)
        Tenant tenant = new Tenant();
        tenant.setName(request.getStoreName());
        tenant.setSlug(storeSlug);
        var savedTenant = tenantRepository.save(tenant);

        // 3. Instancia e salva o Utilizador Lojista, atrelando o ID da nova loja a ele
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setTenantId(savedTenant.getId());

        // Caso o seu modelo User exija um Role obrigatório, descomente e ajuste a linha abaixo:
        // user.setRole(Role.ADMIN);

        var savedUser = userRepository.save(user);

        // 4. Gera o Token JWT incluindo o slug da loja
        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("tenantId", savedUser.getTenantId().toString());
        extraClaims.put("tenantSlug", savedTenant.getSlug());
        extraClaims.put("role", "ROLE_USER");
        
        var jwtToken = jwtService.generateToken(extraClaims, savedUser);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Valida as credenciais no Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Se passar da autenticação acima, sabemos que o utilizador existe e a senha está correta
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilizador não encontrado"));
                
        var tenant = tenantRepository.findById(user.getTenantId())
                .orElseThrow(() -> new IllegalArgumentException("Loja não encontrada"));

        // Gera um novo Token JWT incluindo o slug da loja
        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("tenantId", user.getTenantId().toString());
        extraClaims.put("tenantSlug", tenant.getSlug());
        extraClaims.put("role", "ROLE_USER");
        
        var jwtToken = jwtService.generateToken(extraClaims, user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}