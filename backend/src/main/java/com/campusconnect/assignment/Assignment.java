
package com.campusconnect.assignment;

import com.campusconnect.course.Course;
import com.campusconnect.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 5000)
    private String description;

    @ManyToOne(optional = false)
    private Course course;

    @ManyToOne(optional = false)
    private User createdBy;

    @Column(nullable = false)
    private LocalDateTime dueAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Assignment() {
    }

    public Assignment(
            String title,
            String description,
            Course course,
            User createdBy,
            LocalDateTime dueAt) {
        this.title = title;
        this.description = description;
        this.course = course;
        this.createdBy = createdBy;
        this.dueAt = dueAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Course getCourse() {
        return course;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getDueAt() {
        return dueAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void update(
            String title,
            String description,
            LocalDateTime dueAt) {
        this.title = title;
        this.description = description;
        this.dueAt = dueAt;
    }
}
