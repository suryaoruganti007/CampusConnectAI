package com.campusconnect.course;

import jakarta.validation.constraints.*;

public final class CourseDtos {
    private CourseDtos() {}
    public record CourseRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 30) String code,
        @Size(max = 2000) String description,
        @NotBlank @Size(max = 100) String instructor,
        @NotNull @Min(1) @Max(10) Integer credits
    ) {}
    public record CourseResponse(Long id, String title, String code, String description,
                                 String instructor, Integer credits, String createdAt) {}
}
