package com.livelink.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = Map.of(
            "status", "UP",
            "timestamp", Instant.now().toString(),
            "service", "LiveLink API"
        );
        return ResponseEntity.ok(status);
    }
}