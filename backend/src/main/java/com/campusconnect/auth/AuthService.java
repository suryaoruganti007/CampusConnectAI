package com.campusconnect.auth;

import com.campusconnect.security.JwtService;
import com.campusconnect.user.Role;
import com.campusconnect.user.User;
import com.campusconnect.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User user = users.save(new User(request.name().trim(), email,
            encoder.encode(request.password()), Role.STUDENT));
        return response(user);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = users.findByEmailIgnoreCase(request.email().trim())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!encoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        return response(user);
    }

    public AuthDtos.UserResponse me(String email) {
        User user = users.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return userResponse(user);
    }

    private AuthDtos.AuthResponse response(User user) {
        return new AuthDtos.AuthResponse(jwt.generate(user), userResponse(user));
    }

    private AuthDtos.UserResponse userResponse(User user) {
        return new AuthDtos.UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
