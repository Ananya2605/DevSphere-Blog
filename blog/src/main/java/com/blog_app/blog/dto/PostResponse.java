package com.blog_app.blog.dto;

import com.blog_app.blog.model.Post;

import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private String title;
    private String slug;
    private String content;
    private boolean published;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PostResponse(Post post) {

        this.id = post.getId();
        this.title = post.getTitle();
        this.slug = post.getSlug();
        this.content = post.getContent();
        this.published = post.isPublished();

        if (post.getAuthor() != null) {
            this.author = post.getAuthor().getUsername();
        }

        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSlug() {
        return slug;
    }

    public String getContent() {
        return content;
    }

    public boolean isPublished() {
        return published;
    }

    public String getAuthor() {
        return author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}