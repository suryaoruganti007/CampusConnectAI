package com.campusconnect.course;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 160)
    private String title;
    @Column(nullable = false, unique = true, length = 30)
    private String code;
    @Column(length = 2000)
    private String description;
    @Column(nullable = false, length = 100)
    private String instructor;
    @Column(nullable = false)
    private Integer credits;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Course() {}

    public Course(String title, String code, String description, String instructor, Integer credits) {
        this.title = title; this.code = code; this.description = description;
        this.instructor = instructor; this.credits = credits;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCode() { return code; }
    public String getDescription() { return description; }
    public String getInstructor() { return instructor; }
    public Integer getCredits() { return credits; }
    public Instant getCreatedAt() { return createdAt; }

    public void update(String title, String code, String description, String instructor, Integer credits) {
        this.title = title; this.code = code; this.description = description;
        this.instructor = instructor; this.credits = credits;
    }
}
