package com.blog_app.blog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Catches @Valid failures on RegisterRequest / LoginRequest
    // (e.g. blank username, password too short) and returns
    // field-level messages instead of Spring's default body.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(
            MethodArgumentNotValidException e) {

        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message", "Validation failed",
                        "errors", fieldErrors
                ));
    }

    // Catches AuthService's RuntimeExceptions:
    // "Username already exists", "Invalid username or password",
    // "User not found", etc.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
    }

    // Last-resort catch-all so nothing ever returns an empty body.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Something went wrong. Please try again."));
    }
}
