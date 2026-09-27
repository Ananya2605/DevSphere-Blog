package com.blog_app.blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // BASIC BLOG INFORMATION
    // ==========================================

    @Column(nullable = false)
    private String title;


    @Column(nullable = false, unique = true)
    private String slug;


    /*
     * This field stores the complete rich-text
     * content of the blog.
     *
     * It can contain:
     * - paragraphs
     * - headings
     * - bold / italic text
     * - lists
     * - links
     * - images
     * - YouTube iframe
     * - blockquotes
     */
    @Column(columnDefinition = "LONGTEXT")
    private String content;


    // ==========================================
    // BLOG CATEGORY / TAGS
    // ==========================================

    @Column(length = 100)
    private String category;


    /*
     * Example:
     *
     * Java, Spring Boot, Backend, Programming
     */
    @Column(length = 500)
    private String tags;


    // ==========================================
    // COVER IMAGE
    // ==========================================

    @Column(length = 1000)
    private String coverImage;


    // ==========================================
    // AUTHOR
    // ==========================================

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;


    // ==========================================
    // PUBLISH STATUS
    // ==========================================

    private boolean published;


    /*
     * Featured posts can be displayed
     * on the homepage.
     */
    private boolean featured;


    // ==========================================
    // SEO
    // ==========================================

    @Column(length = 255)
    private String seoTitle;


    @Column(columnDefinition = "TEXT")
    private String seoDescription;


    // ==========================================
    // BLOG STATISTICS
    // ==========================================

    private int viewCount = 0;

    private int likeCount = 0;

    private int readingTime = 0;


    // ==========================================
    // DATE / TIME
    // ==========================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Post() {
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }


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


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }


    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }


    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }


    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }


    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }


    public String getSeoTitle() {
        return seoTitle;
    }

    public void setSeoTitle(String seoTitle) {
        this.seoTitle = seoTitle;
    }


    public String getSeoDescription() {
        return seoDescription;
    }

    public void setSeoDescription(String seoDescription) {
        this.seoDescription = seoDescription;
    }


    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }


    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }


    public int getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(int readingTime) {
        this.readingTime = readingTime;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

