package com.livelink.controller;

import com.livelink.dto.ApiResponse;
import com.livelink.service.StopsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class StopsController {

    @Autowired
    private StopsService stopsService;

    @GetMapping("/stops")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStopsByPincode(
            @RequestParam String pincode) {
        
        List<Map<String, Object>> stops = stopsService.getStopsByPincode(pincode);
        
        return ResponseEntity.ok(ApiResponse.success(stops,
            "Stops retrieved for pincode: " + pincode));
    }

    @GetMapping("/stops/search")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchStops(
            @RequestParam String q) {
        
        List<Map<String, Object>> stops = stopsService.searchStops(q);
        
        return ResponseEntity.ok(ApiResponse.success(stops,
            "Stop search results for query: " + q));
    }
}