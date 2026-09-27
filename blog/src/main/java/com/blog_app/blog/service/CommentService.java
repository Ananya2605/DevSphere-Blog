package com.blog_app.blog.service;

import com.blog_app.blog.model.Comment;
import com.blog_app.blog.model.Post;
import com.blog_app.blog.model.User;
import com.blog_app.blog.repository.CommentRepository;
import com.blog_app.blog.repository.PostRepository;
import com.blog_app.blog.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository) {

        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Comment addComment(
            Long postId,
            String username,
            String content) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        Comment comment = new Comment();

        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long postId) {

        return commentRepository.findByPostId(postId);
    }

    public void deleteComment(Long id) {

        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found");
        }

        commentRepository.deleteById(id);
    }
}