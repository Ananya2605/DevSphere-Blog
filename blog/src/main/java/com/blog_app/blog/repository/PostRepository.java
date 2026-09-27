
package com.blog_app.blog.repository;

import com.blog_app.blog.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlug(String slug);

    boolean existsBySlug(String slug);
}

