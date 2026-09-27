package com.blog_app.blog.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog_app.blog.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

private final JwtService jwtService;
private final UserRepository userRepository;

public JwtFilter(
        JwtService jwtService,
        UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
}

@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

        filterChain.doFilter(request, response);
        return;
        }

        String token =
                authHeader.substring(7);

        try {

        String username =
                jwtService.extractUsername(token);

        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

                userRepository
                        .findByUsername(username)
                        .ifPresent(user -> {

                        if (jwtService.isTokenValid(
                                token,
                                username)) {

                                SimpleGrantedAuthority authority =
                                        new SimpleGrantedAuthority(
                                                "ROLE_" +
                                                user.getRole().name()
                                        );

                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                username,
                                                null,
                                                List.of(authority)
                                        );

                                SecurityContextHolder
                                        .getContext()
                                        .setAuthentication(
                                                authentication
                                        );
                        }
                        });
        }

        } catch (Exception e) {

 
        }

        filterChain.doFilter(request, response);
    }
}