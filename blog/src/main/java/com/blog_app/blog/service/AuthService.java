package com.blog_app.blog.service;
import com.blog_app.blog.dto.LoginRequest;
import com.blog_app.blog.dto.RegisterRequest;
import com.blog_app.blog.model.Role;
import com.blog_app.blog.model.User;
import com.blog_app.blog.repository.UserRepository;
import com.blog_app.blog.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public String register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
        throw new RuntimeException("Username already exists");
    }

    User user = new User();

    user.setFullName(request.getFullName());
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());

    user.setPassword(
            passwordEncoder.encode(request.getPassword())
    );

    user.setRole(Role.USER);

    userRepository.save(user);

    return "Account created successfully";
}
    public String login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
        return jwtService.generateToken(user);
    }
}