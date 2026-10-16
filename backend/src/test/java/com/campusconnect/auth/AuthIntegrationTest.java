package com.campusconnect.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.isEmptyOrNullString;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") class AuthIntegrationTest {
 @Autowired MockMvc mvc;
 @Test void registerReturnsStudentAndJwt() throws Exception {
  mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content("""
   {"name":"Test Student","email":"test.student@example.com","password":"safe-password-123"}
   """))
   .andExpect(status().isCreated()).andExpect(jsonPath("$.token",not(isEmptyOrNullString())))
   .andExpect(jsonPath("$.user.role").value("STUDENT"));
 }
 @Test void protectedMeRequiresBearerToken() throws Exception {
  mvc.perform(get("/api/auth/me")).andExpect(status().is4xxClientError());
 }
 @Test void healthIsPublic() throws Exception {
  mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UP"));
 }
}
