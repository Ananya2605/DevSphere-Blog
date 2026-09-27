package com.blog_app.blog.controller;

import com.blog_app.blog.model.User;
import com.blog_app.blog.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }
}