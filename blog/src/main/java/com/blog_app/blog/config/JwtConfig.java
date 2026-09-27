package com.blog_app.blog.config;

import com.blog_app.blog.security.JwtFilter;

import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    private final JwtFilter jwtFilter;

    public JwtConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    public JwtFilter getJwtFilter() {
        return jwtFilter;
    }
}