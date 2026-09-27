package com.blog_app.blog.controller;

import com.blog_app.blog.dto.LoginRequest;
import com.blog_app.blog.dto.RegisterRequest;
import com.blog_app.blog.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String message = authService.register(request);

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        String token = authService.login(request);

        return ResponseEntity.ok(
                Map.of("token", token)
        );
    }
}