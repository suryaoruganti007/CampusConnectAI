package com.campusconnect.health;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {
    @Test
    void healthReturnsUp() {
        var response = new HealthController().health();
        assertEquals("UP", response.get("status"));
        assertEquals("CampusConnect AI", response.get("application"));
    }
}
