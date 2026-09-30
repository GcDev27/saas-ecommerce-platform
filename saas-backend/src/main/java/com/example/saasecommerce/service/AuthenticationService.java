package com.example.saasecommerce.service;

import com.example.saasecommerce.dto.AuthenticationRequest;
import com.example.saasecommerce.dto.AuthenticationResponse;
import com.example.saasecommerce.dto.RegisterRequest;
import com.example.saasecommerce.dto.RegisterTenantRequest;
import com.example.saasecommerce.dto.RegisterTenantResponse;
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

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public RegisterTenantResponse registerTenant(RegisterTenantRequest request) {
        String cleanSlug = request.storeSlug().trim().toLowerCase().replaceAll("[^a-z0-9-]", "");

        if (tenantRepository.existsBySlug(cleanSlug)) {
            throw new IllegalArgumentException("O slug/subdomínio '" + cleanSlug + "' já está em uso por outra loja.");
        }

        if (repository.existsByEmail(request.adminEmail())) {
            throw new IllegalArgumentException("O e-mail '" + request.adminEmail() + "' já está cadastrado.");
        }

        Tenant tenant = Tenant.builder()
                .name(request.storeName().trim())
                .slug(cleanSlug)
                .build();

        tenant = tenantRepository.save(tenant);

        User user = User.builder()
                .name(request.adminName().trim())
                .email(request.adminEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.adminPassword()))
                .role(User.Role.ADMIN)
                .tenant(tenant)
                .build();

        user = repository.save(user);

        String jwtToken = jwtService.generateToken(user);

        return new RegisterTenantResponse(
                jwtToken,
                tenant.getId(),
                tenant.getName(),
                tenant.getSlug(),
                user.getEmail()
        );
    }

    public AuthenticationResponse register(RegisterRequest request) {
        // Gera um nome e um slug automaticamente baseados no nome do utilizador
        String shopName = "Loja de " + request.name();

        // Remove espaços/caracteres especiais e adiciona um número aleatório para garantir que o slug é único
        String slug = request.name().toLowerCase().replaceAll("[^a-z0-9]", "-")
                + "-" + (int)(Math.random() * 1000);

        Tenant tenant = new Tenant();
        tenant.setName(shopName);
        tenant.setSlug(slug);

        // Agora sim, a base de dados vai aceitar o Tenant!
        tenant = tenantRepository.save(tenant);

        var user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(User.Role.ADMIN) // O dono da loja é sempre ADMIN do seu próprio Tenant
                .tenant(tenant)
                .build();

        repository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(jwtToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Valida as credenciais. Se estiverem erradas, o Spring lança erro 403 automático aqui.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        // Se passou, busca o user e gera o token
        var user = repository.findByEmail(request.email())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(jwtToken);
    }
}