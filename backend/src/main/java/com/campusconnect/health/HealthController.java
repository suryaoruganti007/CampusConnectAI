package com.campusconnect.health;
import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api") public class HealthController {
@GetMapping("/health") public Map<String,Object> health(){return Map.of("status","UP","application","CampusConnect AI","service","CampusConnect AI API");}
@GetMapping("/features") public Map<String,Object> features(){return Map.of("modules",new String[]{"auth","courses","enrollments","attendance","assignments","submissions","campus-document-rag","chat-history"},"ragRetrieval","MySQL-persisted chunks ranked by lexical overlap; embeddings/vector database are not configured in this edition");}}
