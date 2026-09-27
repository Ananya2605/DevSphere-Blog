package com.blog_app.blog.config;

import com.blog_app.blog.model.User;
import com.blog_app.blog.repository.UserRepository;
import com.blog_app.blog.security.JwtFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    private final UserRepository userRepository;
    public SecurityConfig(
            JwtFilter jwtFilter,
            UserRepository userRepository) {
        this.jwtFilter = jwtFilter;
        this.userRepository = userRepository;
    }

    // =========================================================
    // 1. Load user from database
    // =========================================================

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            User dbUser = userRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "User not found: " + username
                            )
                    );

            return org.springframework.security.core.userdetails.User
                    .withUsername(dbUser.getUsername())
                    .password(dbUser.getPassword())
                    .roles(dbUser.getRole().name())
                    .build();
        };
    }

    // =========================================================
    // 2. Password encoder
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // 3. Authentication provider
    // =========================================================

@Bean
public AuthenticationProvider authenticationProvider(
        UserDetailsService userDetailsService,
        PasswordEncoder passwordEncoder) {

    DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider(userDetailsService);

    provider.setPasswordEncoder(passwordEncoder);

    return provider;
}

    // =========================================================
    // 4. Authentication Manager
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =========================================================
    // 5. Security Filter Chain
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider)
            throws Exception {

        http
                // JWT API -> CSRF disabled
                .csrf(csrf -> csrf.disable())

                // JWT is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Authentication rules
                .authorizeHttpRequests(auth -> auth

                        // Frontend files
                        .requestMatchers(
                                "/",
                                "/*.html",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/assets/**",
                                "/favicon.ico"
                        ).permitAll()

                        // Login + Register
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // Public blog posts
                        .requestMatchers(
                                "/api/posts",
                                "/api/posts/**"
                        ).permitAll()

                        // Admin APIs
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // Authentication provider
                .authenticationProvider(authenticationProvider)

                // JWT filter
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}