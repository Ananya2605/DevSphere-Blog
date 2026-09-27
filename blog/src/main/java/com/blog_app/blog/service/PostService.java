package com.blog_app.blog.service;

import com.blog_app.blog.dto.PostRequest;
import com.blog_app.blog.dto.PostResponse;
import com.blog_app.blog.model.Post;
import com.blog_app.blog.model.User;
import com.blog_app.blog.repository.PostRepository;
import com.blog_app.blog.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET ALL POSTS
    // ==========================================

    public List<PostResponse> getAllPosts() {

        return postRepository.findAll()
                .stream()
                .map(PostResponse::new)
                .toList();
    }


    // ==========================================
    // GET SINGLE POST
    // ==========================================

    public PostResponse getPostById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        return new PostResponse(post);
    }


    // ==========================================
    // CREATE / PUBLISH POST
    // ==========================================

    public PostResponse createPost(
            PostRequest request,
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Post post = new Post();

        post.setTitle(request.getTitle());

        // Generate unique slug
        String uniqueSlug =
                generateUniqueSlug(request.getSlug());

        post.setSlug(uniqueSlug);

        post.setContent(request.getContent());

        post.setPublished(request.isPublished());

        post.setAuthor(user);

        post.setCreatedAt(LocalDateTime.now());

        post.setUpdatedAt(LocalDateTime.now());

        Post savedPost =
                postRepository.save(post);

        return new PostResponse(savedPost);
    }


    // ==========================================
    // GENERATE UNIQUE SLUG
    // ==========================================

    private String generateUniqueSlug(String originalSlug) {

        if (originalSlug == null ||
                originalSlug.trim().isEmpty()) {

            originalSlug = "blog";
        }

        String baseSlug =
                originalSlug
                        .toLowerCase()
                        .trim()
                        .replaceAll("[^a-z0-9\\s-]", "")
                        .replaceAll("\\s+", "-")
                        .replaceAll("-+", "-")
                        .replaceAll("^-|-$", "");

        if (baseSlug.isEmpty()) {
            baseSlug = "blog";
        }

        String uniqueSlug = baseSlug;

        int counter = 2;

        while (postRepository.existsBySlug(uniqueSlug)) {

            uniqueSlug =
                    baseSlug + "-" + counter;

            counter++;
        }

        return uniqueSlug;
    }


    // ==========================================
    // UPDATE POST
    // ==========================================

    public PostResponse updatePost(
            Long id,
            PostRequest request) {

        Post post = postRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        post.setTitle(request.getTitle());

        // Generate unique slug while
        // ignoring the current post
        String uniqueSlug =
                generateUniqueSlugForUpdate(
                        request.getSlug(),
                        id
                );

        post.setSlug(uniqueSlug);

        post.setContent(request.getContent());

        post.setPublished(request.isPublished());

        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost =
                postRepository.save(post);

        return new PostResponse(updatedPost);
    }


    // ==========================================
    // UNIQUE SLUG FOR UPDATE
    // ==========================================

    private String generateUniqueSlugForUpdate(
            String originalSlug,
            Long currentPostId) {

        if (originalSlug == null ||
                originalSlug.trim().isEmpty()) {

            originalSlug = "blog";
        }

        String baseSlug =
                originalSlug
                        .toLowerCase()
                        .trim()
                        .replaceAll("[^a-z0-9\\s-]", "")
                        .replaceAll("\\s+", "-")
                        .replaceAll("-+", "-")
                        .replaceAll("^-|-$", "");

        if (baseSlug.isEmpty()) {
            baseSlug = "blog";
        }

        String uniqueSlug = baseSlug;

        int counter = 2;

        while (true) {

            Post existingPost =
                    postRepository
                            .findBySlug(uniqueSlug)
                            .orElse(null);

            // Slug does not exist
            if (existingPost == null) {
                break;
            }

            // Slug belongs to the same post
            if (existingPost.getId().equals(currentPostId)) {
                break;
            }

            // Slug belongs to another post
            uniqueSlug =
                    baseSlug + "-" + counter;

            counter++;
        }

        return uniqueSlug;
    }


    // ==========================================
    // DELETE POST
    // ==========================================

    public void deletePost(Long id) {

        if (!postRepository.existsById(id)) {

            throw new RuntimeException(
                    "Post not found");
        }

        postRepository.deleteById(id);
    }
}

