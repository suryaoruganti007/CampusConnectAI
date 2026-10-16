package com.campusconnect.course;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService service;
    private final CourseRepository repository;
    public CourseController(CourseService service, CourseRepository repository) { this.service = service; this.repository = repository; }

    @GetMapping
    public List<CourseDtos.CourseResponse> list() { return service.list(); }

    @GetMapping("/page")
    public Page<CourseDtos.CourseResponse> page(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size, @RequestParam(defaultValue="createdAt") String sortBy, @RequestParam(defaultValue="desc") String direction) {
        if (page < 0 || size < 1 || size > 100) throw new IllegalArgumentException("page must be >= 0 and size must be between 1 and 100");
        var allowed = List.of("createdAt", "title", "code", "credits");
        if (!allowed.contains(sortBy)) throw new IllegalArgumentException("Unsupported sortBy field");
        var sort = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return repository.findAll(PageRequest.of(page, size, Sort.by(sort, sortBy))).map(c -> new CourseDtos.CourseResponse(c.getId(), c.getTitle(), c.getCode(), c.getDescription(), c.getInstructor(), c.getCredits(), c.getCreatedAt().toString()));
    }

    @GetMapping("/{id}")
    public CourseDtos.CourseResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public CourseDtos.CourseResponse create(@Valid @RequestBody CourseDtos.CourseRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public CourseDtos.CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseDtos.CourseRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
