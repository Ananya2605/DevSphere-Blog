package com.blog_app.blog.controller;

import com.blog_app.blog.model.Comment;
import com.blog_app.blog.service.CommentService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getComments(
            @PathVariable Long postId) {

        return commentService.getComments(postId);
    }

    @PostMapping("/post/{postId}")
    public Comment addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String content = request.get("content");

        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException(
                    "Comment cannot be empty"
            );
        }

        return commentService.addComment(
                postId,
                authentication.getName(),
                content
        );
    }

    @DeleteMapping("/{id}")
    public String deleteComment(
            @PathVariable Long id) {

        commentService.deleteComment(id);

        return "Comment deleted successfully";
    }
}