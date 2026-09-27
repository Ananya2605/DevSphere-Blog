
package com.blog_app.blog.controller;

import com.blog_app.blog.dto.PostRequest;
import com.blog_app.blog.dto.PostResponse;
import com.blog_app.blog.repository.PostRepository;
import com.blog_app.blog.service.PostService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    public PostController(
            PostService postService,
            PostRepository postRepository) {

        this.postService = postService;
        this.postRepository = postRepository;
    }


    // ==========================================
    // GET ALL POSTS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {

        return ResponseEntity.ok(
                postService.getAllPosts()
        );
    }


    // ==========================================
    // GET SINGLE POST
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    postService.getPostById(id)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // ==========================================
    // CREATE / PUBLISH POST
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody PostRequest request,
            Authentication authentication) {

        try {

            String username =
                    authentication.getName();

            PostResponse savedPost =
                    postService.createPost(
                            request,
                            username
                    );

            return ResponseEntity.ok(savedPost);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Could not create post."
                            )
                    );
        }
    }


    // ==========================================
    // UPDATE POST
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestBody PostRequest request) {

        try {

            PostResponse updatedPost =
                    postService.updatePost(
                            id,
                            request
                    );

            return ResponseEntity.ok(updatedPost);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Could not update post."
                            )
                    );
        }
    }


    // ==========================================
    // DELETE POST
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id) {

        try {

            postService.deletePost(id);

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message",
                            "Blog deleted successfully."
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Could not delete blog."
                            )
                    );
        }
    }
}

