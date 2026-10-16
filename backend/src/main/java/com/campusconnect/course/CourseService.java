package com.campusconnect.course;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CourseService {
    private final CourseRepository repository;
    public CourseService(CourseRepository repository) { this.repository = repository; }

    @Cacheable("courses")
    public List<CourseDtos.CourseResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::dto).toList();
    }

    @Cacheable(value="courseById", key="#id")
    public CourseDtos.CourseResponse get(Long id) {
        return dto(repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found.")));
    }

    @Transactional
    @CacheEvict(value={"courses","courseById"}, allEntries=true)
    public CourseDtos.CourseResponse create(CourseDtos.CourseRequest request) {
        String code = request.code().trim().toUpperCase();
        if (repository.existsByCodeIgnoreCase(code)) throw new IllegalArgumentException("Course code already exists.");
        Course c = repository.save(new Course(request.title().trim(), code, request.description(),
            request.instructor().trim(), request.credits()));
        return dto(c);
    }

    @Transactional
    @CacheEvict(value={"courses","courseById"}, allEntries=true)
    public CourseDtos.CourseResponse update(Long id, CourseDtos.CourseRequest request) {
        Course c = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found."));
        String code = request.code().trim().toUpperCase();
        boolean taken = repository.findAll().stream().anyMatch(other -> !other.getId().equals(id) && other.getCode().equalsIgnoreCase(code));
        if (taken) throw new IllegalArgumentException("Course code already exists.");
        c.update(request.title().trim(), code, request.description(), request.instructor().trim(), request.credits());
        return dto(c);
    }

    @Transactional
    @CacheEvict(value={"courses","courseById"}, allEntries=true)
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new IllegalArgumentException("Course not found.");
        repository.deleteById(id);
    }

    private CourseDtos.CourseResponse dto(Course c) {
        return new CourseDtos.CourseResponse(c.getId(), c.getTitle(), c.getCode(), c.getDescription(),
            c.getInstructor(), c.getCredits(), c.getCreatedAt().toString());
    }
}
