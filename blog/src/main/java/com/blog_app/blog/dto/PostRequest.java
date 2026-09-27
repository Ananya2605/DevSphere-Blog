package com.blog_app.blog.dto;

import jakarta.validation.constraints.NotBlank;

public class PostRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String slug;

    @NotBlank
    private String content;

    private boolean published;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
}