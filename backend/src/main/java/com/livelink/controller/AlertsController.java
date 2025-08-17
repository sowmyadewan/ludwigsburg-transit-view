package com.livelink.controller;

import com.livelink.dto.ApiResponse;
import com.livelink.service.AlertsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class AlertsController {

    @Autowired
    private AlertsService alertsService;

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActiveAlerts(
            @RequestParam(required = false) String pincode) {
        
        List<Map<String, Object>> alerts = alertsService.getActiveAlerts(pincode);
        
        String message = pincode != null 
            ? "Active alerts retrieved for pincode: " + pincode
            : "All active alerts retrieved";
            
        return ResponseEntity.ok(ApiResponse.success(alerts, message));
    }

    @GetMapping("/alerts/line/{lineNumber}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAlertsByLine(
            @PathVariable String lineNumber) {
        
        List<Map<String, Object>> alerts = alertsService.getAlertsByLine(lineNumber);
        
        return ResponseEntity.ok(ApiResponse.success(alerts,
            "Alerts retrieved for line: " + lineNumber));
    }
}